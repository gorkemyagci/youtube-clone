import { DEFAULT_LIMIT } from "@/lib/constants";
import HistoryView from "@/modules/playlist/ui/views/history-view";
import { HydrateClient, trpc } from "@/trpc/server";

const Page = async () => {
    void trpc.playlists.getHistory.prefetchInfinite({ limit: DEFAULT_LIMIT });
    return (
        <HydrateClient>
            <HistoryView />
        </HydrateClient>
    )
}

export default Page;