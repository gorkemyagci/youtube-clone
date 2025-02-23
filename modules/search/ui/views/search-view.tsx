import { CategoriesSection } from "../sections/categories-section";
import { ResultsSection } from "../sections/result-section";

interface SearchViewProps {
    searchParams: {
        query: string | undefined;
        categoryId: string | undefined;
    }
}

export const SearchView = ({ searchParams }: SearchViewProps) => {
    const { query, categoryId } = searchParams;
    return <div className="max-w-[1300px] mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5">
        <CategoriesSection categoryId={categoryId} />
        <ResultsSection query={query} categoryId={categoryId} />
    </div>
}