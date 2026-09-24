import React from "react";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionsLoading() {
  return (
    <main className="py-12 sm:py-16 lg:py-20 bg-background min-h-screen">
      <Container size="wide">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-4 bg-surface p-6 border border-border">
              <Skeleton className="aspect-[16/9] w-full" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
