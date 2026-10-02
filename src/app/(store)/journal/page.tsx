import { Suspense } from "react";
import { constructMetadata } from "@/lib/seo/metadata";
import { journalService } from "@/features/journal/services/journalService";
import { JournalListingView } from "@/features/journal/components/JournalListingView";
import { JournalSkeleton } from "@/features/journal/components/JournalSkeleton";
import { BlogPostSummary, PaginationMeta } from "@/features/journal/types";

export const metadata = constructMetadata({
  title: "Olfactory Journal & Stories",
  description:
    "Read editorial stories and essays on haute parfumerie, rare botanical harvests, scent layering, and olfactory craftsmanship.",
  canonical: "/journal",
});

interface JournalPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function JournalPage({ searchParams }: JournalPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const category = params.category || "";
  const search = params.search || "";

  let initialPosts: BlogPostSummary[] = [];
  let initialMeta: PaginationMeta = {
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };
  let allCategories: string[] = [];

  try {
    const postsPromise = journalService.getPublishedPosts({
      page,
      category: category || undefined,
      search: search || undefined,
      limit: 9,
    });

    const categoriesPromise = (category || search)
      ? journalService.getPublishedPosts({ limit: 50 })
      : Promise.resolve(null);

    const [resResult, allResResult] = await Promise.allSettled([
      postsPromise,
      categoriesPromise,
    ]);

    if (
      resResult.status === "fulfilled" &&
      resResult.value?.success &&
      resResult.value.data
    ) {
      const res = resResult.value;
      initialPosts = res.data;
      if (res.meta) {
        const total = res.meta.total ?? res.data.length;
        const totalPages = res.meta.totalPages ?? Math.ceil(total / 9);
        initialMeta = {
          total,
          page: res.meta.page ?? page,
          limit: res.meta.limit ?? 9,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        };
      }
    }

    if (
      allResResult.status === "fulfilled" &&
      allResResult.value?.success &&
      allResResult.value.data
    ) {
      const catSet = new Set<string>();
      allResResult.value.data.forEach((p) => {
        if (p.category && p.category.trim()) catSet.add(p.category.trim());
      });
      allCategories = Array.from(catSet);
    } else {
      const catSet = new Set<string>();
      initialPosts.forEach((p) => {
        if (p.category && p.category.trim()) catSet.add(p.category.trim());
      });
      allCategories = Array.from(catSet);
    }
  } catch {
    // If backend is empty or unreachable during build/first load, fallback cleanly
  }

  return (
    <Suspense fallback={<JournalSkeleton />}>
      <JournalListingView
        initialPosts={initialPosts}
        initialMeta={initialMeta}
        allCategories={allCategories}
      />
    </Suspense>
  );
}
