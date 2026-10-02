import React from "react";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageLoading() {
  return (
    <main className="bg-background min-h-screen py-16 sm:py-24">
      <Container size="default">
        <Skeleton className="h-4 w-24 mb-6" />
        <Skeleton className="h-12 w-2/3 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </Container>
    </main>
  );
}
