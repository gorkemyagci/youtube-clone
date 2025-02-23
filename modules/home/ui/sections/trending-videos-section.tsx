"use client"
import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid.card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function TrendingVideosSection() {
    return (
        <Suspense
            fallback={<TrendingVideosSectionFallback />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <TrendingVideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

const TrendingVideosSectionFallback = () => { 
    return (
        <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [&media(min-width:2200px)]:grid-cols-6">
            {Array.from({ length: 18 }).map((_, index) => (
                <VideoGridCardSkeleton
                    key={index}
                />
            ))}
        </div>
    )
}

function TrendingVideosSectionSuspense() {
    const [videos, query] = trpc.videos.getManyTrending.useSuspenseInfiniteQuery(
        {
            limit: DEFAULT_LIMIT,
        },
        {
            getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
        }
    )
    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [&media(min-width:2200px)]:grid-cols-6">
                {videos.pages.flatMap((page) => page.items).map((video) => (
                    <VideoGridCard
                        key={video.id}
                        data={video}
                    />
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