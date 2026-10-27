"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AdminDetailSkeletonProps {
  category?: string;
  hasSidebar?: boolean;
  className?: string;
}

export function AdminDetailSkeleton({
  category = "RESOURCE DETAILS",
  hasSidebar = true,
  className = "",
}: AdminDetailSkeletonProps) {
  return (
    <div className={cn("space-y-6 font-sans animate-in fade-in duration-300", className)}>
      {/* 1. Detail Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0C134F]/40 font-mono">
              {category}
            </span>
            <Skeleton className="h-3 w-16 rounded bg-slate-200/60" />
          </div>
          <Skeleton className="h-8 sm:h-9 w-72 rounded-xl bg-slate-300/80" />
          <Skeleton className="h-3.5 w-96 max-w-full rounded bg-slate-200/70" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-24 rounded-xl bg-slate-200/70" />
          <Skeleton className="h-9 w-28 rounded-xl bg-[#0C134F]/20" />
        </div>
      </div>

      {/* 2. Top Summary KPI Cards (3-4 small cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 space-y-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <Skeleton className="h-3 w-20 rounded bg-slate-200/60" />
            <Skeleton className="h-6 w-28 rounded bg-slate-300/80" />
          </Card>
        ))}
      </div>

      {/* 3. Main Body: Form / Content & Sidebar */}
      <div className={cn("grid gap-6 items-start", hasSidebar ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1")}>
        {/* Left / Main Section (8 cols if sidebar) */}
        <div className={cn("space-y-6", hasSidebar ? "lg:col-span-8" : "w-full")}>
          {/* Main Card */}
          <Card className="p-6 sm:p-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <Skeleton className="h-6 w-44 rounded-lg bg-slate-300/80" />
              <Skeleton className="h-3.5 w-72 rounded bg-slate-200/60" />
            </div>

            {/* Field rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24 rounded bg-slate-300/70" />
                <Skeleton className="h-10 w-full rounded-xl bg-slate-200/60" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-28 rounded bg-slate-300/70" />
                <Skeleton className="h-10 w-full rounded-xl bg-slate-200/60" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-3 w-32 rounded bg-slate-300/70" />
              <Skeleton className="h-24 w-full rounded-xl bg-slate-200/60" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <Skeleton className="h-10 w-full rounded-xl bg-slate-200/60" />
              <Skeleton className="h-10 w-full rounded-xl bg-slate-200/60" />
              <Skeleton className="h-10 w-full rounded-xl bg-slate-200/60" />
            </div>
          </Card>

          {/* Secondary Details Card */}
          <Card className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <Skeleton className="h-5 w-36 rounded-lg bg-slate-300/80" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                  <Skeleton className="h-4 w-40 rounded bg-slate-200/70" />
                  <Skeleton className="h-4 w-24 rounded bg-slate-200/70" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sidebar Section (4 cols) */}
        {hasSidebar && (
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <Skeleton className="h-5 w-32 rounded-lg bg-slate-300/80" />
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <Skeleton className="h-3 w-20 rounded bg-slate-300/60" />
                  <Skeleton className="h-4 w-full rounded bg-slate-200/80" />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <Skeleton className="h-3 w-24 rounded bg-slate-300/60" />
                  <Skeleton className="h-4 w-full rounded bg-slate-200/80" />
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <Skeleton className="h-5 w-28 rounded-lg bg-slate-300/80" />
              <Skeleton className="h-10 w-full rounded-xl bg-slate-200/60" />
              <Skeleton className="h-10 w-full rounded-xl bg-[#0C134F]/20" />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDetailSkeleton;
