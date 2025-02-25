import { DEFAULT_LIMIT } from "@/lib/constants";
import SubscriptionsView from "@/modules/subscriptions/ui/views/subscriptions-view";
import { HydrateClient, trpc } from "@/trpc/server";

const Page = async () => {
    void trpc.subscriptions.getMany.prefetchInfinite({
        limit: DEFAULT_LIMIT
    });
    return <HydrateClient>
        <SubscriptionsView />
    </HydrateClient>
}

export default Page;