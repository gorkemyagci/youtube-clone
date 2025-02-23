"use client"
import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid.card";
import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function LikedVideosSection() {
    return (
        <Suspense
            fallback={<LikedVideosSectionFallback />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <LikedVideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

const LikedVideosSectionFallback = () => {
    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-10 md:hidden">
                {Array.from({ length: 18 }).map((_, index) => (
                    <VideoGridCardSkeleton
                        key={index}
                    />
                ))}
            </div>
            <div className="hidden flex-col gap-4 md:flex">
                {Array.from({ length: 18 }).map((_, index) => (
                    <VideoRowCardSkeleton
                        key={index}
                        size="compact"
                    />
                ))}
            </div>
        </div>
    )
}

function LikedVideosSectionSuspense() {
    const [playlists, query] = trpc.playlists.getLiked.useSuspenseInfiniteQuery(
        {
            limit: DEFAULT_LIMIT,
        },
        {
            getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
        }
    )
    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-10 md:hidden">
                {playlists.pages.flatMap((page) => page.items).map((video) => (
                    <VideoGridCard
                        key={video.id}
                        data={video}
                    />
                ))}
            </div>
            <div className="hidden flex-col gap-4 md:flex">
                {playlists.pages.flatMap((page) => page.items).map((video) => (
                    <VideoRowCard
                        key={video.id}
                        data={video}
                        size="compact"
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