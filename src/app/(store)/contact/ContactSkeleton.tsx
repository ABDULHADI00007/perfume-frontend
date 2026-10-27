"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export function ContactSkeleton() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen py-8 sm:py-14 font-sans select-none animate-in fade-in duration-300">
      <Container size="wide">
        {/* Breadcrumb Navigation Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-3.5 w-12 rounded" />
          <span className="text-[#C5A880]/60 text-xs font-semibold">&gt;</span>
          <Skeleton className="h-3.5 w-20 rounded" />
        </div>

        {/* Header Section Skeleton */}
        <div className="mb-10 sm:mb-14 space-y-3">
          <Skeleton className="h-6 w-44 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-3/5 max-w-xl rounded-xl" />
          <Skeleton className="h-4 w-4/5 max-w-2xl rounded" />
          <Skeleton className="h-4 w-3/5 max-w-lg rounded" />
        </div>

        {/* 2-Column Main Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Card: Send Us a Message Skeleton (8 cols) */}
          <div className="lg:col-span-8 border border-[#E2DED6] bg-white rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-2 border-b border-stone-100 pb-5">
              <Skeleton className="h-8 w-60 rounded-lg" />
              <Skeleton className="h-4 w-96 max-w-full rounded" />
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-12 w-full rounded-xl border border-stone-200/50" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-28 rounded" />
                  <Skeleton className="h-12 w-full rounded-xl border border-stone-200/50" />
                </div>
              </div>

              {/* Row 2: Phone Number & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-28 rounded" />
                  <Skeleton className="h-12 w-full rounded-xl border border-stone-200/50" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-20 rounded" />
                  <Skeleton className="h-12 w-full rounded-xl border border-stone-200/50" />
                </div>
              </div>

              {/* Row 3: Message Textarea */}
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-32 rounded" />
                <Skeleton className="h-32 w-full rounded-xl border border-stone-200/50" />
              </div>

              {/* Submit Button */}
              <Skeleton className="h-12 w-full rounded-xl bg-stone-300/80" />
            </div>
          </div>

          {/* Right Card: Contact Channels Skeleton (4 cols) */}
          <div className="lg:col-span-4 border border-[#E2DED6] bg-white rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-2 border-b border-stone-100 pb-5">
              <Skeleton className="h-7 w-44 rounded-lg" />
              <Skeleton className="h-4 w-full rounded" />
            </div>

            {/* Contact Channels List */}
            <div className="space-y-4">
              {/* Channel 1: Email */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-stone-50/70 border border-stone-100">
                <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
                <div className="space-y-2 flex-1 pt-0.5">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3 w-44 rounded" />
                  <Skeleton className="h-2.5 w-32 rounded" />
                </div>
              </div>

              {/* Channel 2: Phone */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-stone-50/70 border border-stone-100">
                <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
                <div className="space-y-2 flex-1 pt-0.5">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                  <Skeleton className="h-2.5 w-40 rounded" />
                </div>
              </div>

              {/* Channel 3: Studio */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-stone-50/70 border border-stone-100">
                <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
                <div className="space-y-2 flex-1 pt-0.5">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3 w-36 rounded" />
                  <Skeleton className="h-2.5 w-28 rounded" />
                </div>
              </div>

              {/* Scent Concierge Promise Card */}
              <div className="p-4 rounded-xl bg-[#FAF7EE] border border-[#590B16]/15 space-y-2 mt-4">
                <Skeleton className="h-4 w-36 rounded" />
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-4/5 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section Skeleton */}
        <div className="mt-14 sm:mt-18 border-t border-stone-200/70 pt-12 space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto mb-8">
            <Skeleton className="h-8 w-72 mx-auto rounded-lg" />
            <Skeleton className="h-4 w-96 max-w-full mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-stone-200/80 bg-white shadow-2xs space-y-2"
              >
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}

export default ContactSkeleton;
