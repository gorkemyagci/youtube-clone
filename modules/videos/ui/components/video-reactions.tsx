import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"
import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { toast } from "sonner";

interface VideoReactionsProps {
    videoId: string;
    likes: number;
    dislikes: number;
    viewerReaction: "like" | "dislike" | null;
}

export const VideoReactions = ({ videoId, likes, dislikes, viewerReaction }: VideoReactionsProps) => {
    const clerk = useClerk();
    const utils = trpc.useUtils();
    const like = trpc.videoReactions.like.useMutation({
        onSuccess: () => {
            utils.videos.getOne.invalidate({ id: videoId });
        },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                toast.error("Something went wrong");
                clerk.openSignIn();
            }
        },
    });
    const dislike = trpc.videoReactions.dislike.useMutation({
        onSuccess: () => {
            utils.videos.getOne.invalidate({ id: videoId });
        },
        onError: (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                toast.error("Something went wrong");
                clerk.openSignIn();
            }
        },
    });
    return (
        <div className="flex items-center flex-none">
            <Button onClick={() => like.mutate({ videoId })} disabled={like.isPending || dislike.isPending} variant="secondary" className="rounded-l-full rounded-r-none gap-2 pr-4">
                <ThumbsUpIcon className={cn("size-5", viewerReaction === "like" && "fill-black")} />
                {likes}
            </Button>
            <Separator orientation="vertical" className="h-7" />
            <Button onClick={() => dislike.mutate({ videoId })} disabled={like.isPending || dislike.isPending} variant="secondary" className="rounded-l-none rounded-r-full pl-3">
                <ThumbsDownIcon className={cn("size-5", viewerReaction === "dislike" && "fill-black")} />
                {dislikes}
            </Button>
        </div>
    )
}   
