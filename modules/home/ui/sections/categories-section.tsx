"use client";

import { FilterCarousel } from "@/components/filter-carousel";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/navigation";

export const CategoriesSection = ({ categoryId }: { categoryId?: string | null }) => {
    return (
        <Suspense fallback={<CategoriesSkeleton />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <CategoriesSectionSuspense categoryId={categoryId} />
            </ErrorBoundary>
        </Suspense>
    )
}

const CategoriesSkeleton = () => {
    return <FilterCarousel isLoading data={[]} onSelect={() => { }} />
}

export default function CategoriesSectionSuspense({ categoryId }: { categoryId?: string | null }) {
    const router = useRouter();
    const [categories] = trpc.categories.getMany.useSuspenseQuery();
    const data = categories.map((category) => ({
        value: category.id,
        label: category.name,
    }));
    const onSelect = (value: string | null) => {
        const url = new URL(window.location.href);
        if (value) {
            url.searchParams.set("categoryId", value);
        } else {
            url.searchParams.delete("categoryId");
        }
        router.push(url.toString());
    }
    return <FilterCarousel onSelect={onSelect} value={categoryId} data={data} />
}