import React from "react";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export const JournalSkeleton: React.FC = () => {
  return (
    <div className="py-12 sm:py-16">
      <Container size="wide">
        {/* Featured Article Skeleton */}
        <div className="border border-border p-6 sm:p-8 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-surface">
          <div className="lg:col-span-7">
            <Skeleton className="aspect-[16/9] w-full" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        {/* Article Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-border p-6 space-y-4 bg-surface">
              <Skeleton className="aspect-[16/9] w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export const ArticleSkeleton: React.FC = () => {
  return (
    <div className="py-12 sm:py-16">
      <Container size="default">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Breadcrumb Skeleton */}
          <Skeleton className="h-4 w-48" />

          {/* Header Skeleton */}
          <div className="space-y-4 text-center">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-10 w-full mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>

          {/* Featured Image Skeleton */}
          <Skeleton className="aspect-[16/9] w-full" />

          {/* Body Skeleton */}
          <div className="space-y-4 pt-6">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        </div>
      </Container>
    </div>
  );
};
