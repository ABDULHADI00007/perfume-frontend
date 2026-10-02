import React from "react";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function FAQLoading() {
  return (
    <main className="bg-background min-h-screen">
      <section className="border-b border-border/60 py-20 sm:py-28">
        <Container size="default">
          <div className="max-w-2xl">
            <Skeleton className="h-4 w-24 mb-6" />
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-6 w-full" />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container size="default">
          <div className="space-y-12">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-5 w-40 mb-6" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-14 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
