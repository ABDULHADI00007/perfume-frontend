import React from "react";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <main className="bg-[#F8F6F0] min-h-screen py-8 sm:py-12">
      <Container size="wide">
        {/* Breadcrumb */}
        <Skeleton className="h-4 w-32 mb-4" />

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 sm:mb-14">
          <div className="lg:col-span-6 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-16 w-full max-w-xl" />
          </div>
          <div className="lg:col-span-6">
            <Skeleton className="h-[320px] sm:h-[420px] w-full rounded-2xl" />
          </div>
        </div>

        {/* Feature Bar */}
        <Skeleton className="h-32 w-full rounded-2xl mb-14" />

        {/* Mission */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Skeleton className="h-4 w-24 mx-auto mb-2" />
          <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
          <Skeleton className="h-12 w-full" />
        </div>
      </Container>
    </main>
  );
}
