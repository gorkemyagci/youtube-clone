"use client"
import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid.card";
import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";


export default function VideosSection({ playlistId }: { playlistId: string }) {
    return (
        <Suspense
            fallback={<VideosSectionFallback />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <VideosSectionSuspense playlistId={playlistId} />
            </ErrorBoundary>
        </Suspense>
    )
}

const VideosSectionFallback = () => {
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

function VideosSectionSuspense({ playlistId }: { playlistId: string }) {
    const [playlists, query] = trpc.playlists.getVideos.useSuspenseInfiniteQuery(
        {
            playlistId,
            limit: DEFAULT_LIMIT,
        },
        {
            getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
        }
    );
    const utils = trpc.useUtils();
    const removeVideo = trpc.playlists.removeVideo.useMutation({
        onSuccess: (data) => {
            console.log("success");
            toast.success("Video removed from playlist");
            utils.playlists.getManyForVideo.invalidate({ videoId: data.videoId });
            utils.playlists.getMany.invalidate();
            utils.playlists.getOne.invalidate({ id: data.playlistId });
            utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
        },
        onError: () => {
            console.log("error");
            toast.error("Something went wrong");
        }
    })
    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-10 md:hidden">
                {playlists.pages.flatMap((page) => page.items).map((video) => (
                    <VideoGridCard
                        key={video.id}
                        data={video}
                        onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })}
                    />
                ))}
            </div>
            <div className="hidden flex-col gap-4 md:flex">
                {playlists.pages.flatMap((page) => page.items).map((video) => (
                    <VideoRowCard
                        key={video.id}
                        data={video}
                        size="compact"
                        onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })}
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