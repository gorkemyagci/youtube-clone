import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ListVideoIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

interface PlaylistThumbnailProps {
    title: string;
    videoCount: number;
    imageUrl?: string;
    className?: string;
}

export const PlaylistThumbnailSkeleton = () => {
    return (
        <div className="relative w-full overflow-hidden transition-all group-hover:rounded-none rounded-xl aspect-video">
            <Skeleton className="size-full" />
        </div>
    )
}

export const PlaylistThumbnail = ({ title, videoCount, imageUrl, className }: PlaylistThumbnailProps) => {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: "compact",
            maximumFractionDigits: 1
        }).format(videoCount);
    }, [videoCount])
    return (
        <div className={cn("relative pt-3", className)}>
            <div className="relative">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[98.5%] overflow-hidden rounded-xl bg-black/25 aspect-video" />
                <div className="relative overflow-hidden w-full rounded-xl aspect-video">
                    <Image
                        src={imageUrl || "/assets/placeholder.svg"}
                        alt={title}
                        className="w-full h-full object-cover"
                        fill
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex items-center gap-x-2">
                            <PlayIcon className="size-4 text-white fill-white" />
                            <span className="text-white font-medium">Play all</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium flex items-center gap-x-1">
                <ListVideoIcon className="size-4" />
                {compactViews} videos
            </div>
        </div>
    )
}