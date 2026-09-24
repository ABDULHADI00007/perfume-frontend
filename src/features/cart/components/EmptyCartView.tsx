import React from "react";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";

export const EmptyCartView: React.FC = () => {
  return (
    <div className="py-20 sm:py-28 text-center max-w-2xl mx-auto px-4">
      <div className="p-4 rounded-full bg-surface-subtle inline-flex items-center justify-center text-foreground-subtle mb-6 border border-border">
        <Icons.Bag size={32} />
      </div>

      <div className="inline-flex items-center justify-center space-x-3 mb-3">
        <span className="w-6 h-[1px] bg-accent" />
        <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-foreground-muted font-sans">
          Maison de Parfum
        </span>
        <span className="w-6 h-[1px] bg-accent" />
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground leading-tight tracking-tight mb-4">
        Your Shopping Bag is Empty
      </h1>

      <p className="text-sm sm:text-base text-foreground-muted font-sans font-light max-w-md mx-auto mb-10 leading-relaxed">
        Discover handcrafted extraits de parfum, rare harvest distillations, and curated collections formulated for individual expression.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/perfumes"
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground hover:bg-primary-hover text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200"
        >
          Explore All Fragrances
        </Link>
        <Link
          href="/collections"
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-border text-foreground hover:border-foreground bg-surface text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200"
        >
          Curated Collections
        </Link>
      </div>
    </div>
  );
};
