"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AdminTableSkeletonProps {
  category?: string;
  title?: string;
  hasFilters?: boolean;
  rows?: number;
  className?: string;
}

export function AdminTableSkeleton({
  category = "STORE OPERATIONS",
  title = "Management",
  hasFilters = true,
  rows = 7,
  className = "",
}: AdminTableSkeletonProps) {
  return (
    <div className={cn("space-y-6 font-sans animate-in fade-in duration-300", className)}>
      {/* 1. Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0C134F]/40 font-mono">
              {category}
            </span>
            <Skeleton className="h-3.5 w-12 rounded-full bg-slate-200/70" />
          </div>
          <Skeleton className="h-8 sm:h-9 w-60 rounded-xl bg-slate-300/80" />
          <Skeleton className="h-3.5 w-80 max-w-full rounded bg-slate-200/70" />
        </div>

        {/* Action Button Skeleton */}
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-32 rounded-xl bg-[#0C134F]/20" />
        </div>
      </div>

      {/* 2. Filter Bar Skeleton */}
      {hasFilters && (
        <Card className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-6">
              <Skeleton className="h-9 w-full rounded-xl bg-slate-200/70" />
            </div>
            <div className="sm:col-span-3">
              <Skeleton className="h-9 w-full rounded-xl bg-slate-200/60" />
            </div>
            <div className="sm:col-span-3">
              <Skeleton className="h-9 w-full rounded-xl bg-slate-200/60" />
            </div>
          </div>
        </Card>
      )}

      {/* 3. Table Shell & Shimmer Rows */}
      <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-xs overflow-hidden">
        {/* Table Header Row */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/80 border-b border-slate-200/80">
          <div className="col-span-4">
            <Skeleton className="h-3 w-28 rounded bg-slate-300/80" />
          </div>
          <div className="col-span-3">
            <Skeleton className="h-3 w-20 rounded bg-slate-300/80" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-3 w-16 rounded bg-slate-300/80" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-3 w-16 rounded bg-slate-300/80" />
          </div>
          <div className="col-span-1 text-right">
            <Skeleton className="h-3 w-12 ml-auto rounded bg-slate-300/80" />
          </div>
        </div>

        {/* Shimmer Data Rows */}
        <div className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
              <div className="col-span-4 space-y-1.5">
                <Skeleton className="h-4 w-44 rounded-md bg-slate-200/80" />
                <Skeleton className="h-2.5 w-24 rounded bg-slate-200/60" />
              </div>
              <div className="col-span-3">
                <Skeleton className="h-3.5 w-28 rounded-md bg-slate-200/70" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-5 w-20 rounded-full bg-slate-200/60" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-4 w-20 rounded-md bg-slate-200/70" />
              </div>
              <div className="col-span-1 flex justify-end">
                <Skeleton className="h-7 w-14 rounded-lg bg-slate-200/70" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 4. Pagination Skeleton */}
      <div className="flex justify-center pt-2">
        <Skeleton className="h-8 w-60 rounded-xl bg-slate-200/60" />
      </div>
    </div>
  );
}

export default AdminTableSkeleton;
