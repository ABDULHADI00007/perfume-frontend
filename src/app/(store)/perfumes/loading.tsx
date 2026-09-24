import React from "react";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function PerfumesLoading() {
  return (
    <main className="py-12 sm:py-16 lg:py-20 bg-background min-h-screen">
      <Container size="wide">
        {/* Header Skeleton */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>

        {/* Product Grid Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-4">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
