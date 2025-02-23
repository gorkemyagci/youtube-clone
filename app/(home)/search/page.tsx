import { DEFAULT_LIMIT } from "@/lib/constants";
import { SearchView } from "@/modules/search/ui/views/search-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface SearchPageProps {
    searchParams: Promise<{
        query: string | undefined;
        categoryId: string | undefined;
    }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { query, categoryId } = await searchParams;
    void trpc.categories.getMany.prefetch();
    void trpc.search.getMany.prefetchInfinite({
        query,
        categoryId,
        limit: DEFAULT_LIMIT
    })
    return (
        <HydrateClient>
            <SearchView searchParams={{ query, categoryId }} />
        </HydrateClient>
    )
} 