import React from "react";
import { Container } from "@/components/layout/Container";

export const JournalHero: React.FC = () => {
  return (
    <header className="py-12 sm:py-16 lg:py-20 bg-surface border-b border-border/60">
      <Container size="wide">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center space-x-3 mb-3">
            <span className="w-6 h-[1px] bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-accent">
              Chronicles & Dispatches
            </span>
            <span className="w-6 h-[1px] bg-accent" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground leading-tight tracking-tight mt-2 mb-4">
            The Olfactory Journal
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-foreground-muted font-sans font-light leading-relaxed max-w-xl mx-auto">
            Essays on Haute Parfumerie, botanical harvests, olfactory chemistry, and the enduring rituals of personal fragrance.
          </p>
        </div>
      </Container>
    </header>
  );
};
