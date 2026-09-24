"use client";

import React from "react";
import Link from "next/link";
import { Collection } from "../types";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Icons } from "@/components/ui/icons";

export interface CollectionCardProps {
  collection: Collection;
  priority?: boolean;
  className?: string;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  priority = false,
  className = "",
}) => {
  const displayImage = collection.heroImage || "/images/perfumes/oud-majesty.png";

  return (
    <article
      className={`group relative flex flex-col bg-transparent overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Media Container */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden bg-surface-subtle/60 border border-border">
        <Link
          href={`/collections/${collection.slug}`}
          aria-label={`Explore ${collection.title} collection`}
          className="block h-full w-full"
        >
          <OptimizedImage
            src={displayImage}
            alt={collection.title}
            aspectRatio="16/9"
            priority={priority}
            className="transition-transform duration-700 ease-editorial group-hover:scale-105"
          />
        </Link>

        {/* Featured Badge */}
        {collection.featured && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="inline-flex items-center px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] font-medium bg-primary text-primary-foreground">
              Featured Edition
            </span>
          </div>
        )}
      </div>

      {/* Narrative & Details */}
      <div className="mt-5 flex flex-col space-y-2 text-left">
        {collection.subtitle && (
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground-muted">
            {collection.subtitle}
          </p>
        )}

        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-foreground group-hover:text-primary transition-colors leading-tight">
          <Link href={`/collections/${collection.slug}`}>{collection.title}</Link>
        </h3>

        {collection.description && (
          <p className="text-xs sm:text-sm text-foreground-muted font-sans font-light line-clamp-2 leading-relaxed">
            {collection.description}
          </p>
        )}

        <div className="pt-2">
          <Link
            href={`/collections/${collection.slug}`}
            className="inline-flex items-center text-xs uppercase tracking-[0.18em] font-medium text-foreground group-hover:text-primary transition-colors"
          >
            Explore Collection
            <Icons.ArrowRight size={13} className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};
