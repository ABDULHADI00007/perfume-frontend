import React from "react";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function PerfumeDetailLoading() {
  return (
    <main className="py-8 sm:py-12 lg:py-16 bg-background min-h-screen">
      <Container size="wide">
        {/* Breadcrumb Skeleton */}
        <Skeleton className="h-4 w-48 mb-8 sm:mb-12" />

        {/* Product Overview Layout: Gallery + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Gallery Skeleton */}
          <div className="lg:col-span-6 space-y-4">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="lg:col-span-6 space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </Container>
    </main>
  );
}
