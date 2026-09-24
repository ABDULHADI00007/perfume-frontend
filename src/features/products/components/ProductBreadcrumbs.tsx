import React from "react";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";

export interface ProductBreadcrumbsProps {
  productTitle: string;
  collectionTitle?: string;
  collectionSlug?: string;
  className?: string;
}

export const ProductBreadcrumbs: React.FC<ProductBreadcrumbsProps> = ({
  productTitle,
  collectionTitle,
  collectionSlug,
  className = "",
}) => {
  return (
    <nav
      aria-label="Breadcrumbs"
      className={`flex items-center space-x-2 text-[11px] uppercase tracking-[0.16em] text-foreground-subtle font-sans ${className}`}
    >
      <Link
        href="/"
        className="hover:text-foreground transition-colors duration-150"
      >
        Home
      </Link>
      <Icons.ChevronRight size={12} className="text-foreground-subtle/60" />
      <Link
        href="/perfumes"
        className="hover:text-foreground transition-colors duration-150"
      >
        Perfumes
      </Link>
      {collectionTitle && collectionSlug && (
        <>
          <Icons.ChevronRight size={12} className="text-foreground-subtle/60" />
          <Link
            href={`/collections/${collectionSlug}`}
            className="hover:text-foreground transition-colors duration-150"
          >
            {collectionTitle}
          </Link>
        </>
      )}
      <Icons.ChevronRight size={12} className="text-foreground-subtle/60" />
      <span
        aria-current="page"
        className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs"
      >
        {productTitle}
      </span>
    </nav>
  );
};
