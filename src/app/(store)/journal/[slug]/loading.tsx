import React from "react";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function JournalDetailLoading() {
  return (
    <main className="py-12 sm:py-16 lg:py-20 bg-background min-h-screen">
      <Container size="narrow">
        <Skeleton className="h-4 w-40 mb-8" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-4 w-48 mb-8" />
        <Skeleton className="aspect-[16/9] w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Container>
    </main>
  );
}
