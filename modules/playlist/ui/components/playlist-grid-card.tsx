import Link from "next/link";
import { PlaylistGetManyOutput } from "../../types";
import { PlaylistThumbnail, PlaylistThumbnailSkeleton } from "./playlist-thumbnail";
import { PlaylistInfo, PlaylistInfoSkeleton } from "./playlist-info";

interface PlaylistGridCardProps {
    data: PlaylistGetManyOutput["items"][number];
}

export const PlaylistGridCardSkeleton = () => {
    return (
        <div className="flex flex-col gap-2">
            <PlaylistThumbnailSkeleton />
            <PlaylistInfoSkeleton />
        </div>
    )
}

export const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
    return <Link prefetch  href={`/playlists/${data.id}`}>
        <div className="flex flex-col gap-2 group">
            <PlaylistThumbnail
                imageUrl={data.thumbnailUrl || "/assets/placeholder.svg"}
                title={data.name}
                videoCount={data.videoCount}
            />
            <PlaylistInfo
                data={data}
            />
        </div>
    </Link>
}