"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { BlogPostDetail, BlogPostSummary } from "../types";
import { calculateReadTime } from "../utils/safeContent";
import { ArticleBreadcrumb } from "./ArticleBreadcrumb";
import { ArticleContentRenderer } from "./ArticleContentRenderer";
import { RelatedArticles } from "./RelatedArticles";

interface ArticleDetailViewProps {
  post: BlogPostDetail;
  relatedPosts: BlogPostSummary[];
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  post,
  relatedPosts,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const readTime = calculateReadTime(post.content || post.excerpt || "");
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const handleShare = () => {
    if (typeof window === "undefined") return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <article className="py-10 sm:py-16 lg:py-20">
        <Container size="default">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb Navigation */}
            <ArticleBreadcrumb title={post.title} />

            {/* Article Header */}
            <header className="text-center mb-10 sm:mb-14">
              {/* Category */}
              <div className="inline-flex items-center space-x-3 mb-4">
                <span className="w-4 h-[1px] bg-accent" />
                <span className="text-[11px] uppercase tracking-[0.24em] font-medium text-accent">
                  {post.category || "Perfume Editorial"}
                </span>
                <span className="w-4 h-[1px] bg-accent" />
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground leading-[1.15] tracking-tight mb-6">
                {post.title}
              </h1>

              {/* Excerpt / Lead */}
              {post.excerpt && (
                <p className="text-sm sm:text-base md:text-lg text-foreground-muted font-sans font-light leading-relaxed mb-6 max-w-2xl mx-auto">
                  {post.excerpt}
                </p>
              )}

              {/* Metadata row */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-mono text-foreground-subtle pt-4 border-t border-border/60">
                {post.author?.name && (
                  <span className="font-sans italic text-foreground/85">
                    Written by {post.author.name}
                  </span>
                )}
                {post.author?.name && <span>•</span>}
                {formattedDate && <span>{formattedDate}</span>}
                {formattedDate && <span>•</span>}
                <span>{readTime}</span>
              </div>
            </header>

            {/* Cover Image */}
            {post.featuredImage?.url && (
              <figure className="mb-10 sm:mb-14">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-subtle border border-border shadow-subtle">
                  <OptimizedImage
                    src={post.featuredImage.url}
                    alt={post.featuredImage.altText || post.title}
                    aspectRatio="auto"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
                  />
                </div>
                {post.featuredImage.altText && (
                  <figcaption className="mt-2.5 text-center text-xs text-foreground-muted font-sans font-light italic">
                    {post.featuredImage.altText}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Article Content Body */}
            <div className="border-b border-border/70 pb-12 sm:pb-16 mb-12 sm:mb-16">
              <ArticleContentRenderer content={post.content} />
            </div>

            {/* Tags & Share Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-12 border-b border-border/60">
              {/* Tags */}
              {post.tags && post.tags.length > 0 ? (
                <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-foreground-subtle font-mono mr-1">
                    Topics:
                  </span>
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-surface-subtle text-[11px] font-sans text-foreground-muted border border-border uppercase tracking-wider"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : (
                <div />
              )}

              {/* Share Button */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  leftIcon={copiedLink ? <Icons.Check size={14} /> : <Icons.ExternalLink size={14} />}
                >
                  {copiedLink ? "Link Copied" : "Share Dispatch"}
                </Button>
              </div>
            </div>

            {/* Back Navigation Bar */}
            <div className="py-8 flex items-center justify-between">
              <Link href="/journal">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Icons.ArrowLeft size={14} />}
                >
                  Return to Journal
                </Button>
              </Link>
              <Link href="/perfumes">
                <Button variant="outline" size="sm">
                  Explore Fragrances
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </article>

      {/* Related Dispatches Section */}
      {relatedPosts.length > 0 && (
        <RelatedArticles articles={relatedPosts} currentSlug={post.slug} />
      )}
    </div>
  );
};
