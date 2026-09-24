"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Pagination } from "@/components/ui/pagination";
import { BlogPostSummary, PaginationMeta } from "../types";
import { journalService } from "../services/journalService";
import { JournalHero } from "./JournalHero";
import { JournalFilters } from "./JournalFilters";
import { JournalFeaturedArticle } from "./JournalFeaturedArticle";
import { JournalArticleCard } from "./JournalArticleCard";
import { JournalEmptyState } from "./JournalEmptyState";
import { JournalSkeleton } from "./JournalSkeleton";

interface JournalListingViewProps {
  initialPosts: BlogPostSummary[];
  initialMeta: PaginationMeta;
  allCategories: string[];
}

export const JournalListingView: React.FC<JournalListingViewProps> = ({
  initialPosts,
  initialMeta,
  allCategories,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [posts, setPosts] = useState<BlogPostSummary[]>(initialPosts);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Fetch updated data when filters or pagination change
  const updateQuery = (newCategory?: string, newSearch?: string, newPage?: number) => {
    const category = newCategory !== undefined ? newCategory : currentCategory;
    const search = newSearch !== undefined ? newSearch : currentSearch;
    const page = newPage !== undefined ? newPage : 1;

    // Update URL query parameters
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (page > 1) params.set("page", String(page));

    const newQueryString = params.toString();
    router.push(newQueryString ? `/journal?${newQueryString}` : "/journal", { scroll: false });

    // Fetch from backend
    startTransition(async () => {
      setError(null);
      try {
        const res = await journalService.getPublishedPosts({
          category: category || undefined,
          search: search || undefined,
          page,
          limit: 9,
        });

        if (res.success && res.data) {
          setPosts(res.data);
          if (res.meta) {
            setMeta({
              total: res.meta.total ?? res.data.length,
              page: res.meta.page ?? page,
              limit: res.meta.limit ?? 9,
              totalPages: res.meta.totalPages ?? Math.ceil((res.meta.total ?? res.data.length) / 9),
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dispatches.");
      }
    });
  };

  const handleCategoryChange = (category: string) => {
    updateQuery(category, currentSearch, 1);
  };

  const handleSearchChange = (search: string) => {
    updateQuery(currentCategory, search, 1);
  };

  const handlePageChange = (page: number) => {
    updateQuery(currentCategory, currentSearch, page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const isFiltered = Boolean(currentCategory || currentSearch);
  const showFeatured = !isFiltered && currentPage === 1 && posts.length > 0;
  const featuredPost = showFeatured ? posts[0] : null;
  const gridPosts = showFeatured ? posts.slice(1) : posts;

  return (
    <div className="min-h-screen bg-surface">
      <JournalHero />

      <main className="py-12 sm:py-16 lg:py-20">
        <Container size="wide">
          <JournalFilters
            categories={allCategories}
            selectedCategory={currentCategory}
            searchQuery={currentSearch}
            onCategoryChange={handleCategoryChange}
            onSearchChange={handleSearchChange}
          />

          {isPending ? (
            <JournalSkeleton />
          ) : error ? (
            <div className="py-16 text-center text-status-error font-sans text-sm border border-status-error/30 bg-status-error-subtle p-6 max-w-md mx-auto">
              <p className="mb-4">{error}</p>
              <button
                type="button"
                onClick={() => updateQuery(currentCategory, currentSearch, currentPage)}
                className="px-4 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-wider"
              >
                Retry
              </button>
            </div>
          ) : posts.length === 0 ? (
            <JournalEmptyState
              isFiltered={isFiltered}
              onResetFilters={() => updateQuery("", "", 1)}
            />
          ) : (
            <>
              {/* Featured Lead Story on First Page */}
              {featuredPost && <JournalFeaturedArticle post={featuredPost} />}

              {/* Grid of Articles */}
              {gridPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gridPosts.map((post, idx) => (
                    <JournalArticleCard
                      key={post._id || post.slug}
                      post={post}
                      priority={idx < 3}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="mt-14 sm:mt-18 flex justify-center">
                  <Pagination
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </Container>
      </main>
    </div>
  );
};
