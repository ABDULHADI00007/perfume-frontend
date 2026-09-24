import React from "react";
import Link from "next/link";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Icons } from "@/components/ui/icons";
import { BlogPostSummary } from "../types";
import { calculateReadTime } from "../utils/safeContent";

interface JournalArticleCardProps {
  post: BlogPostSummary;
  priority?: boolean;
}

export const JournalArticleCard: React.FC<JournalArticleCardProps> = ({
  post,
  priority = false,
}) => {
  const readTime = calculateReadTime(post.excerpt || "");
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article className="group flex flex-col justify-between bg-surface border border-border/70 hover:border-accent/40 transition-all duration-300 hover:shadow-subtle">
      <div>
        {/* Cover Image Container */}
        <Link
          href={`/journal/${post.slug}`}
          className="block relative overflow-hidden"
          tabIndex={-1}
          aria-hidden="true"
        >
          <OptimizedImage
            src={post.featuredImage?.url || "/images/perfumes/secret-garden.png"}
            alt={post.featuredImage?.altText || post.title}
            aspectRatio="16/9"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="group-hover:scale-105 transition-transform duration-700 ease-luxury"
          />
        </Link>

        {/* Card Body */}
        <div className="p-6 sm:p-7">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle pb-3 border-b border-border/60 mb-4">
            <span className="text-accent uppercase tracking-widest text-[10px] font-medium truncate max-w-[140px]">
              {post.category || "Perfume Editorial"}
            </span>
            <div className="flex items-center space-x-2 text-foreground-subtle">
              {formattedDate && <span>{formattedDate}</span>}
              {formattedDate && <span>•</span>}
              <span>{readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-xl sm:text-2xl text-foreground font-normal group-hover:text-primary transition-colors leading-snug mb-3">
            <Link href={`/journal/${post.slug}`} className="focus:outline-none">
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xs sm:text-sm text-foreground-muted font-sans font-light leading-relaxed line-clamp-3 mb-4">
              {post.excerpt}
            </p>
          )}

          {/* Author if available */}
          {post.author?.name && (
            <p className="text-[11px] text-foreground-subtle font-sans italic">
              By {post.author.name}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="px-6 sm:px-7 pb-6 pt-2 border-t border-border/40">
        <Link
          href={`/journal/${post.slug}`}
          className="inline-flex items-center text-xs uppercase tracking-[0.16em] font-medium text-foreground group-hover:text-primary transition-colors"
          aria-label={`Read dispatch: ${post.title}`}
        >
          <span>Read Dispatch</span>
          <Icons.ArrowRight
            size={12}
            className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1 text-primary"
          />
        </Link>
      </div>
    </article>
  );
};
