"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ResponsiveModal } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { trpc } from "@/trpc/client";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { toast } from "sonner";
import { util } from "zod";

interface PlaylistAddModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    videoId: string;
}

export const PlaylistAddModal = ({ open, onOpenChange, videoId }: PlaylistAddModalProps) => {
    const utils = trpc.useUtils();
    const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.playlists.getManyForVideo.useInfiniteQuery({
        limit: DEFAULT_LIMIT,
        videoId
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!videoId && open,
    })
    const addVideo = trpc.playlists.addVideo.useMutation({
        onSuccess: (data) => {
            toast.success(`Added to playlist`);
            utils.playlists.getManyForVideo.invalidate({ videoId });
            utils.playlists.getMany.invalidate();
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });
    const removeVideo = trpc.playlists.removeVideo.useMutation({
        onSuccess: () => {
            toast.success(`Removed from playlist`);
            utils.playlists.getManyForVideo.invalidate({ videoId });
            utils.playlists.getMany.invalidate();
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });
    return (
        <ResponsiveModal title="Add to Playlist" open={open} onOpenChange={onOpenChange}>
            <div className="flex flex-col gap-2">
                {isLoading && (
                    <div className="flex justify-center p-4">
                        <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
                    </div>
                )}
                {!isLoading && data?.pages.flatMap((page) => page.items.map((playlist) => (
                    <Button onClick={() => {
                        if (playlist.containsVideo) {
                            removeVideo.mutate({ playlistId: playlist.id, videoId });
                        } else {
                            addVideo.mutate({ playlistId: playlist.id, videoId });
                        }
                    }}
                        disabled={removeVideo.isPending || addVideo.isPending}
                        key={playlist.id} variant="ghost" className="w-full justify-start px-2 [&_svg]:size-5" size="lg">
                        {playlist.containsVideo ? <SquareCheckIcon className="mr-2" /> : <SquareIcon className="mr-2" />}
                        {playlist.name}
                    </Button>
                )))}
                {!isLoading && (
                    <InfiniteScroll
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        isManual
                    />
                )}
            </div>
        </ResponsiveModal>
    )
}
