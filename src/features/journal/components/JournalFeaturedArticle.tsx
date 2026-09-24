import React from "react";
import Link from "next/link";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { BlogPostSummary } from "../types";
import { calculateReadTime } from "../utils/safeContent";

interface JournalFeaturedArticleProps {
  post: BlogPostSummary;
}

export const JournalFeaturedArticle: React.FC<JournalFeaturedArticleProps> = ({ post }) => {
  const readTime = calculateReadTime(post.excerpt || "");
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="group relative bg-surface border border-border/80 overflow-hidden mb-12 sm:mb-16 shadow-subtle">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Visual Column */}
        <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[380px] lg:min-h-[440px] overflow-hidden">
          <Link
            href={`/journal/${post.slug}`}
            className="block h-full w-full relative"
            tabIndex={-1}
            aria-hidden="true"
          >
            <OptimizedImage
              src={post.featuredImage?.url || "/images/perfumes/secret-garden.png"}
              alt={post.featuredImage?.altText || post.title}
              aspectRatio="auto"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="group-hover:scale-105 transition-transform duration-700 ease-luxury object-cover h-full w-full"
            />
          </Link>
        </div>

        {/* Editorial Text Column */}
        <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-surface">
          <div>
            {/* Lead Tag & Category */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="w-5 h-[1px] bg-accent" />
              <span className="text-[10px] uppercase tracking-[0.24em] font-medium text-accent">
                Featured Dispatch • {post.category || "Editorial"}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground font-normal leading-snug tracking-tight mb-4 group-hover:text-primary transition-colors">
              <Link href={`/journal/${post.slug}`}>
                {post.title}
              </Link>
            </h2>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xs sm:text-sm text-foreground-muted font-sans font-light leading-relaxed mb-6">
                {post.excerpt}
              </p>
            )}

            {/* Metadata */}
            <div className="text-[11px] font-mono text-foreground-subtle space-y-1 mb-8">
              {post.author?.name && (
                <p className="font-sans italic text-foreground/80">
                  By {post.author.name}
                </p>
              )}
              <div className="flex items-center space-x-2">
                {formattedDate && <span>{formattedDate}</span>}
                {formattedDate && <span>•</span>}
                <span>{readTime}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div>
            <Link href={`/journal/${post.slug}`}>
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
                rightIcon={<Icons.ArrowRight size={14} />}
              >
                Read Featured Dispatch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
