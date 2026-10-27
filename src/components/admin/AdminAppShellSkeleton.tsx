"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AdminAppShellSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col md:flex-row bg-[#F8F9FA] font-sans text-slate-900 select-none animate-in fade-in duration-300",
        className
      )}
      aria-label="Loading Admin Portal..."
      aria-busy="true"
    >
      {/* 1. Left Persistent Sidebar Skeleton */}
      <aside className="hidden md:flex w-72 lg:w-80 bg-white h-screen sticky top-0 shrink-0 p-5 sm:p-6 flex-col justify-between border-r border-slate-200/80 shadow-[2px_0_16px_rgba(18,23,53,0.02)]">
        <div className="space-y-6">
          {/* Brand Header Skeleton */}
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <Skeleton className="h-8 w-36 rounded-lg bg-slate-300/80" />
            <Skeleton className="h-5 w-14 rounded-full bg-slate-200/60" />
          </div>

          {/* Nav Group 1: Overview */}
          <div className="space-y-2">
            <Skeleton className="h-2.5 w-16 rounded bg-slate-300/60 ml-2" />
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-100/80 border border-slate-200/60">
              <Skeleton className="w-4 h-4 rounded bg-[#0C134F]/30" />
              <Skeleton className="h-3.5 w-24 rounded bg-slate-300/80" />
            </div>
          </div>

          {/* Nav Group 2: Store Operations */}
          <div className="space-y-2">
            <Skeleton className="h-2.5 w-24 rounded bg-slate-300/60 ml-2" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-4 h-4 rounded bg-slate-200/80" />
                  <Skeleton className="h-3 w-28 rounded bg-slate-200/70" />
                </div>
                {i === 1 && <Skeleton className="h-4 w-7 rounded-full bg-[#0C134F]/20" />}
              </div>
            ))}
          </div>

          {/* Nav Group 3: Editorial & Marketing */}
          <div className="space-y-2">
            <Skeleton className="h-2.5 w-32 rounded bg-slate-300/60 ml-2" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl">
                <Skeleton className="w-4 h-4 rounded bg-slate-200/80" />
                <Skeleton className="h-3 w-24 rounded bg-slate-200/70" />
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. Main Administration Area with Top Header & Dashboard Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Skeleton */}
        <header className="h-16 px-4 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between gap-4">
          {/* Mobile hamburger placeholder + Search Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Skeleton className="md:hidden w-8 h-8 rounded-lg bg-slate-200/80" />
            <Skeleton className="h-9 w-full rounded-xl bg-slate-100 border border-slate-200/60" />
          </div>

          {/* Header Actions (Right) */}
          <div className="flex items-center gap-3">
            <Skeleton className="hidden sm:block h-8 w-28 rounded-full bg-slate-100 border border-slate-200/60" />
            <Skeleton variant="circular" className="w-9 h-9 bg-slate-200/70" />
            <Skeleton variant="circular" className="w-9 h-9 bg-[#0C134F]/20" />
          </div>
        </header>

        {/* Content Body Skeleton */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-[1700px] mx-auto space-y-8">
            {/* Page Title & Breadcrumb Skeleton */}
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

              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-32 rounded-xl bg-[#0C134F]/20" />
              </div>
            </div>

            {/* 4 KPI Cards Grid */}
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

            {/* Main Table / Data Shell Skeleton */}
            <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-40 rounded bg-slate-300/80" />
                  <Skeleton className="h-3 w-64 rounded bg-slate-200/60" />
                </div>
                <Skeleton className="h-8 w-24 rounded-xl bg-slate-200/60" />
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/70 border-b border-slate-200/80">
                <div className="col-span-3">
                  <Skeleton className="h-3 w-28 rounded bg-slate-300/70" />
                </div>
                <div className="col-span-3">
                  <Skeleton className="h-3 w-24 rounded bg-slate-300/70" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-3 w-16 rounded bg-slate-300/70" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-3 w-16 rounded bg-slate-300/70" />
                </div>
                <div className="col-span-2 text-right">
                  <Skeleton className="h-3 w-16 ml-auto rounded bg-slate-300/70" />
                </div>
              </div>

              {/* Shimmer Data Rows */}
              <div className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                    <div className="col-span-3 space-y-1.5">
                      <Skeleton className="h-4 w-32 rounded bg-slate-200/80" />
                      <Skeleton className="h-2.5 w-18 rounded bg-slate-200/60" />
                    </div>
                    <div className="col-span-3 space-y-1.5">
                      <Skeleton className="h-3.5 w-40 rounded bg-slate-200/70" />
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
        </main>
      </div>
    </div>
  );
}

export default AdminAppShellSkeleton;
