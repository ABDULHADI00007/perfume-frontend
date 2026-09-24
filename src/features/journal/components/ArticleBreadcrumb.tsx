import React from "react";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";

interface ArticleBreadcrumbProps {
  title: string;
}

export const ArticleBreadcrumb: React.FC<ArticleBreadcrumbProps> = ({ title }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-xs font-sans text-foreground-subtle mb-6 sm:mb-8"
    >
      <ol className="flex items-center space-x-2 flex-wrap">
        <li>
          <Link
            href="/"
            className="hover:text-primary transition-colors uppercase tracking-[0.14em]"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="text-border-strong select-none">
          <Icons.ChevronRight size={12} />
        </li>
        <li>
          <Link
            href="/journal"
            className="hover:text-primary transition-colors uppercase tracking-[0.14em]"
          >
            Journal
          </Link>
        </li>
        <li aria-hidden="true" className="text-border-strong select-none">
          <Icons.ChevronRight size={12} />
        </li>
        <li
          aria-current="page"
          className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md"
        >
          {title}
        </li>
      </ol>
    </nav>
  );
};
