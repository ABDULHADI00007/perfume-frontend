import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface JournalEmptyStateProps {
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

export const JournalEmptyState: React.FC<JournalEmptyStateProps> = ({
  isFiltered = false,
  onResetFilters,
}) => {
  return (
    <div className="py-16 sm:py-24 text-center max-w-md mx-auto">
      <div className="w-14 h-14 rounded-full bg-surface-subtle border border-border flex items-center justify-center mx-auto mb-5 text-foreground-subtle">
        <Icons.Search size={22} className="text-accent" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-foreground font-normal tracking-tight mb-3">
        {isFiltered ? "No Matching Dispatches" : "The Journal is Being Curated"}
      </h2>

      <p className="text-xs sm:text-sm text-foreground-muted font-sans font-light leading-relaxed mb-8">
        {isFiltered
          ? "We could not find any journal entries matching your chosen criteria. Try adjusting your search query or exploring another category."
          : "Our master perfumers and editorial curators are currently preparing the next series of olfactory essays. Please revisit soon."}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {isFiltered && onResetFilters ? (
          <Button
            variant="primary"
            size="md"
            onClick={onResetFilters}
            className="w-full sm:w-auto"
          >
            Clear All Filters
          </Button>
        ) : (
          <Link href="/perfumes" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full">
              Explore Fragrances
            </Button>
          </Link>
        )}

        <Link href="/" className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="w-full">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
