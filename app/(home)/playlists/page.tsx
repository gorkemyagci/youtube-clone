import { DEFAULT_LIMIT } from "@/lib/constants";
import PlaylistView from "@/modules/playlist/ui/views/playlist-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const Page = async () => {
    void trpc.playlists.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });
    return (
        <HydrateClient>
            <PlaylistView />
        </HydrateClient>
    )
};

export default Page;
