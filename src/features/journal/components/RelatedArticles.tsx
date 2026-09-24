import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";
import { BlogPostSummary } from "../types";
import { JournalArticleCard } from "./JournalArticleCard";

interface RelatedArticlesProps {
  articles: BlogPostSummary[];
  currentSlug: string;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  articles,
  currentSlug,
}) => {
  const filtered = articles.filter((a) => a.slug !== currentSlug).slice(0, 3);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Related Dispatches"
      className="py-16 sm:py-20 bg-surface-subtle/30 border-t border-border/60"
    >
      <Container size="wide">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-3 mb-2">
              <span className="w-5 h-[1px] bg-accent" />
              <span className="text-[10px] uppercase tracking-[0.24em] font-medium text-accent">
                Further Reading
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground font-normal tracking-tight">
              Related Dispatches
            </h2>
          </div>

          <Link
            href="/journal"
            className="inline-flex items-center text-xs uppercase tracking-[0.16em] font-medium text-foreground hover:text-primary transition-colors"
          >
            <span>All Journal Entries</span>
            <Icons.ArrowRight size={12} className="ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article) => (
            <JournalArticleCard key={article._id || article.slug} post={article} />
          ))}
        </div>
      </Container>
    </section>
  );
};
