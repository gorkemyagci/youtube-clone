"use client"
import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid.card";
import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import { SubscriptionItem, SubscriptionItemSkeleton } from "../components/subscription-item";

export default function SubscriptionsSection() {
    return (
        <Suspense
            fallback={<SubscriptionsSectionFallback />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <SubscriptionsSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

const SubscriptionsSectionFallback = () => {
    return (
        <div>
            <div className="flex flex-col gap-4">
                {Array.from({ length: 18 }).map((_, index) => (
                    <SubscriptionItemSkeleton key={index} />
                ))}
            </div>
        </div>
    )
}

function SubscriptionsSectionSuspense() {
    const utils = trpc.useUtils();
    const [subscriptions, query] = trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
        {
            limit: DEFAULT_LIMIT,
        },
        {
            getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
        }
    )
    const unsubscribe = trpc.subscriptions.remove.useMutation({
        onSuccess: (data) => {
            toast.success("Unsubscribed");
            utils.subscriptions.getMany.invalidate();
            utils.videos.getManySubscribed.invalidate();
            utils.users.getOne.invalidate({ id: data.creatorId });
        },
        onError: (error) => {
            toast.error("Something went wrong");
        },
    });
    return (
        <div>
            <div className="flex flex-col gap-4">
                {subscriptions.pages.flatMap((page) => page.items).map((subscription) => (
                    <Link prefetch  href={`/users/${subscription.user.id}`} key={subscription.creatorId}>
                        <SubscriptionItem
                            name={subscription.user.name}
                            imageUrl={subscription.user.imageUrl}
                            subscriberCount={subscription.user.subscriberCount}
                            onUnsubscribe={() => {
                                unsubscribe.mutate({ userId: subscription.creatorId })
                            }}
                            disabled={unsubscribe.isPending}
                        />
                    </Link>
                ))}
            </div>
            <InfiniteScroll
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
            />
        </div>
    )
}   