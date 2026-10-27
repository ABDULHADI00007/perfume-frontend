"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCatalogSkeleton({ cardCount = 8 }: { cardCount?: number }) {
  return (
    <div className="w-full font-sans bg-white min-h-screen animate-in fade-in duration-300 select-none">
      <Container size="wide" className="pt-8 pb-12">
        {/* ================= 1. CIRCULAR CATEGORY FILTER ICONS SKELETON ================= */}
        <div className="w-full mb-10 overflow-x-auto scrollbar-none py-2 relative">
          <div className="flex items-center justify-start lg:justify-between gap-8 sm:gap-12 lg:gap-14 min-w-max">
            {[1, 2, 3, 4, 5, 6, 7].map((catIndex) => (
              <div key={catIndex} className="flex flex-col items-center gap-3">
                {/* Circular Category Icon Pill */}
                <Skeleton
                  variant="circular"
                  className="w-16 h-16 sm:w-18 sm:h-18 bg-[#F0ECE5] border border-stone-200/60"
                />
                {/* Category Label */}
                <Skeleton className="h-3 w-16 sm:w-20 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* ================= 2. PRODUCTS COUNT TEXT SKELETON ================= */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-3.5 w-44 rounded-md" />
        </div>

        {/* ================= 3. 4-COLUMN PRODUCT CARDS SKELETON GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {[...Array(cardCount)].map((_, i) => (
            <div key={i} className="flex justify-center w-full">
              {/* Card Outer Shell - 1:1 match with InteractiveTravelCard */}
              <div className="relative h-[29.5rem] w-full max-w-[340px] rounded-[30px] overflow-hidden bg-[#ECE7DF] border border-stone-200/70 p-4 sm:p-5 flex flex-col justify-between shadow-md">
                {/* Shimmer background on the card itself */}
                <Skeleton className="absolute inset-0 w-full h-full rounded-none -z-0 bg-[#ECE8E1]/60" />

                {/* Top Row: Discount Badge & Heart Button */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  {/* 14% off badge skeleton */}
                  <Skeleton className="h-6 w-16 rounded-full bg-white/70 backdrop-blur-sm border border-stone-300/40" />

                  {/* Wishlist heart skeleton */}
                  <Skeleton
                    variant="circular"
                    className="w-8 h-8 bg-white/60 backdrop-blur-sm border border-stone-300/40"
                  />
                </div>

                {/* Bottom Section: Title, Overview, Badges, Button */}
                <div className="relative z-10 space-y-3">
                  {/* Perfume Title */}
                  <Skeleton className="h-6 w-3/4 rounded-lg bg-stone-300/80" />

                  {/* Scent Overview Description (2 lines) */}
                  <div className="space-y-1.5 pt-0.5">
                    <Skeleton className="h-3 w-full rounded bg-stone-300/60" />
                    <Skeleton className="h-3 w-4/5 rounded bg-stone-300/60" />
                  </div>

                  {/* Badges & Price Row */}
                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-6 w-18 rounded-full bg-white/60" />
                      <Skeleton className="h-6 w-14 rounded-full bg-white/60" />
                    </div>

                    {/* Price Pill */}
                    <Skeleton className="h-10 w-20 rounded-2xl bg-white/70 border border-stone-300/30" />
                  </div>

                  {/* Add to Cart Pill Button */}
                  <Skeleton className="h-12 w-full rounded-full bg-white shadow-sm border border-stone-200 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default ProductCatalogSkeleton;
