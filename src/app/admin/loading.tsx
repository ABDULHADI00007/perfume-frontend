import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#0C134F]/40 font-mono">
              EXECUTIVE OVERVIEW
            </span>
            <Skeleton className="h-3.5 w-16 rounded-full bg-slate-200/70" />
          </div>
          <Skeleton className="h-8 sm:h-9 w-64 rounded-xl bg-slate-300/80" />
          <Skeleton className="h-3.5 w-96 max-w-full rounded bg-slate-200/70" />
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28 rounded-full bg-slate-200/60" />
        </div>
      </div>

      {/* 2. 4 KPI Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 space-y-3 bg-white rounded-2xl shadow-xs border border-slate-200/80">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24 bg-slate-300/70 rounded" />
              <Skeleton className="h-8 w-8 rounded-xl bg-slate-200/60" />
            </div>
            <Skeleton className="h-8 w-36 bg-slate-300/80 rounded-lg" />
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-4 w-12 rounded bg-slate-200/60" />
              <Skeleton className="h-3 w-28 rounded bg-slate-200/50" />
            </div>
          </Card>
        ))}
      </div>

      {/* 3. Wire Transfer Alert Banner Skeleton */}
      <div className="bg-amber-50/60 border border-amber-200/70 p-5 rounded-2xl shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Skeleton className="w-9 h-9 rounded-xl bg-amber-200/60" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-48 rounded bg-amber-200/70" />
              <Skeleton className="h-3 w-80 max-w-full rounded bg-amber-200/50" />
            </div>
          </div>
          <Skeleton className="h-8 w-32 rounded-xl bg-amber-200/60" />
        </div>
      </div>

      {/* 4. Recent Orders Table Skeleton */}
      <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-36 rounded bg-slate-300/80" />
            <Skeleton className="h-3 w-56 rounded bg-slate-200/60" />
          </div>
          <Skeleton className="h-8 w-24 rounded-xl bg-slate-200/60" />
        </div>

        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/70 border-b border-slate-200/80">
          <div className="col-span-3">
            <Skeleton className="h-3 w-24 rounded bg-slate-300/70" />
          </div>
          <div className="col-span-3">
            <Skeleton className="h-3 w-20 rounded bg-slate-300/70" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-3 w-16 rounded bg-slate-300/70" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-3 w-16 rounded bg-slate-300/70" />
          </div>
          <div className="col-span-2 text-right">
            <Skeleton className="h-3 w-14 ml-auto rounded bg-slate-300/70" />
          </div>
        </div>

        {/* Shimmer Rows */}
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
              <div className="col-span-3 space-y-1">
                <Skeleton className="h-4 w-28 rounded bg-slate-200/80" />
                <Skeleton className="h-2.5 w-16 rounded bg-slate-200/60" />
              </div>
              <div className="col-span-3 space-y-1">
                <Skeleton className="h-3.5 w-36 rounded bg-slate-200/70" />
                <Skeleton className="h-2.5 w-24 rounded bg-slate-200/50" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-5 w-20 rounded-full bg-slate-200/60" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-5 w-20 rounded-full bg-slate-200/60" />
              </div>
              <div className="col-span-2 flex justify-end">
                <Skeleton className="h-4 w-20 rounded bg-slate-200/80" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
