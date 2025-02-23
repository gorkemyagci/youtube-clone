import { DEFAULT_LIMIT } from "@/lib/constants";
import LikedView from "@/modules/playlist/ui/views/liked-view";
import { HydrateClient, trpc } from "@/trpc/server";

const Page = async () => {
    void trpc.playlists.getLiked.prefetchInfinite({ limit: DEFAULT_LIMIT });
    return (
        <HydrateClient>
            <LikedView />
        </HydrateClient>
    )
}

export default Page;