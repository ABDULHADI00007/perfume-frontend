import React from "react";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <main className="py-10 sm:py-16 lg:py-20 bg-background min-h-screen">
      <Container size="wide">
        {/* Header Skeleton */}
        <div className="pb-8 mb-8 border-b border-border flex justify-between items-end">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>

        {/* 2-Column Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Items List Skeleton */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center space-x-4 py-6 border-b border-border">
              <Skeleton className="h-28 w-24 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>

            <div className="flex items-center space-x-4 py-6 border-b border-border">
              <Skeleton className="h-28 w-24 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Summary Skeleton */}
          <div className="lg:col-span-5">
            <div className="p-8 bg-surface border border-border space-y-6">
              <Skeleton className="h-6 w-36" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
