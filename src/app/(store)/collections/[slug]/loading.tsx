import React from "react";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionDetailLoading() {
  return (
    <main className="py-10 sm:py-16 lg:py-20 bg-background min-h-screen">
      <Container size="wide">
        <Skeleton className="h-4 w-40 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-16 pb-12 border-b border-border">
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="aspect-[16/9] w-full" />
          </div>
        </div>
      </Container>
    </main>
  );
}
