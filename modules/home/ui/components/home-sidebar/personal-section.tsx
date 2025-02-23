"use client";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { pageUrls } from "@/lib/enums/page-urls";
import { useAuth, useClerk } from "@clerk/nextjs";
import { HistoryIcon, ListVideoIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
    {
        title: "History",
        url: pageUrls.HISTORY,
        icon: HistoryIcon,
        auth: true
    },
    {
        title: "Liked videos",
        url: pageUrls.LIKED_VIDEOS,
        icon: ThumbsUpIcon,
        auth: true
    },
    {
        title: "All playlists",
        url: pageUrls.ALL_PLAYLISTS,
        icon: ListVideoIcon,
        auth: true
    }
];

export const PersonalSection = () => {
    const { isSignedIn } = useAuth();
    const clerk = useClerk();
    const pathname = usePathname();
    return (
        <SidebarGroup>
            <SidebarGroupLabel>You</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item, index) => (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={pathname === item.url}
                                onClick={(e) => {
                                    if (!isSignedIn && item.auth) {
                                        e.preventDefault();
                                        return clerk.openSignIn();
                                    }
                                }}
                            >
                                <Link href={item.url} className="flex items-center gap-4">
                                    <item.icon />
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}