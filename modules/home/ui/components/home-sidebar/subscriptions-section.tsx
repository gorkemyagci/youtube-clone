"use client";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/user-avatar";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { trpc } from "@/trpc/client";
import { ListIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const LoadingSkeleton = () => {
    return (
        <>
            {[1, 2, 3, 4].map((i) => (
                <SidebarMenuItem key={i}>
                    <SidebarMenuButton disabled>
                        <Skeleton className="size-6 rounded-full shrink-0" />
                        <Skeleton className="w-full h-4" />
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </>
    )
}

export const SubscriptionsSection = () => {
    const pathname = usePathname();
    const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery({
        limit: DEFAULT_LIMIT
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {isLoading && <LoadingSkeleton />}
                    {!isLoading && data?.pages.flatMap((page) => page.items).map((item, index) => (
                        <SidebarMenuItem key={`${item.creatorId}-${item.viewerId}`}>
                            <SidebarMenuButton
                                tooltip={item.user.name}
                                asChild
                                isActive={pathname === `/users/${item.user.id}`}
                            >
                                <Link prefetch  href={`/users/${item.user.id}`} className="flex items-center gap-4">
                                    <UserAvatar
                                        imageUrl={item.user.imageUrl}
                                        name={item.user.name}
                                        size="sm"
                                    />
                                    <span className="text-sm">{item.user.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    {!isLoading && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === "/subscriptions"}>
                                <Link prefetch  href="/subscriptions" className="flex items-center gap-4">
                                    <ListIcon className="size-4" />
                                    <span className="text-sm">All subscriptions</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}