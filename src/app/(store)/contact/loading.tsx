import React from "react";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContactLoading() {
  return (
    <main className="bg-[#F8F6F0] min-h-screen py-8 sm:py-12">
      <Container size="wide">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-2/3 mb-2" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
          <div className="lg:col-span-8">
            <Skeleton className="h-[480px] w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
        </div>

        {/* FAQ Section */}
        <Skeleton className="h-[300px] w-full rounded-2xl mt-8" />
      </Container>
    </main>
  );
}
