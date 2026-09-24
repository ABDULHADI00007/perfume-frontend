"use client";

import React, { useState, useEffect } from "react";
import { Icons } from "@/components/ui/icons";

interface JournalFiltersProps {
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
}

export const JournalFilters: React.FC<JournalFiltersProps> = ({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync with prop if it changes externally
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch.trim());
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  return (
    <div className="mb-10 sm:mb-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/60">
        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="Filter journal dispatches by category"
          className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!selectedCategory}
            onClick={() => onCategoryChange("")}
            className={`px-4 py-2 text-xs uppercase tracking-[0.16em] font-medium transition-all duration-200 whitespace-nowrap border ${
              !selectedCategory
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-surface text-foreground-muted border-border hover:border-foreground/50 hover:text-foreground"
            }`}
          >
            All Dispatches
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onCategoryChange(isSelected ? "" : cat)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.16em] font-medium transition-all duration-200 whitespace-nowrap border ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-surface text-foreground-muted border-border hover:border-foreground/50 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full md:w-72 flex-shrink-0"
          role="search"
        >
          <input
            type="text"
            placeholder="Search dispatches..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-surface text-foreground text-xs font-sans px-3.5 py-2.5 pl-9 pr-8 border border-border focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground-subtle"
            aria-label="Search articles by title or keyword"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none">
            <Icons.Search size={14} />
          </span>

          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground p-1 transition-colors"
            >
              <Icons.Close size={14} />
            </button>
          )}
        </form>
      </div>

      {/* Active filters notice */}
      {(selectedCategory || searchQuery) && (
        <div className="flex items-center justify-between text-xs font-sans text-foreground-muted bg-surface-subtle/50 px-4 py-2 border border-border">
          <div className="flex items-center space-x-2 flex-wrap">
            <span>Filtering by:</span>
            {selectedCategory && (
              <span className="font-medium text-foreground bg-surface px-2 py-0.5 border border-border">
                Category: {selectedCategory}
              </span>
            )}
            {searchQuery && (
              <span className="font-medium text-foreground bg-surface px-2 py-0.5 border border-border">
                Keyword: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onCategoryChange("");
              handleClearSearch();
            }}
            className="text-primary hover:underline text-[11px] uppercase tracking-wider font-medium"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
