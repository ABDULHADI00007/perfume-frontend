"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      {/* Decorative */}
      <div className="inline-flex items-center justify-center space-x-3 mb-8">
        <span className="w-8 h-[1px] bg-accent" />
        <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-foreground-muted font-sans">
          An Unexpected Error
        </span>
        <span className="w-8 h-[1px] bg-accent" />
      </div>

      <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground leading-[1.1] tracking-tight mb-4 max-w-md">
        Something Did Not Go as Planned
      </h2>

      <p className="text-sm text-foreground-muted font-sans font-light leading-relaxed mb-10 max-w-sm">
        We encountered an unexpected issue. Please try again, or contact our concierge if the problem persists.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center font-sans font-medium uppercase px-8 py-4 text-xs tracking-[0.2em] bg-primary text-primary-foreground hover:bg-primary-hover border border-primary transition-all duration-200 cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center font-sans font-medium uppercase px-8 py-4 text-xs tracking-[0.2em] bg-transparent text-foreground border border-border-strong hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-pointer"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
