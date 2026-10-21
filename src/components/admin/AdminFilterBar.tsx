"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface AdminFilterBarProps {
  children: React.ReactNode;
  onReset?: () => void;
  resetLabel?: string;
  hasActiveFilters?: boolean;
  className?: string;
}

export const AdminFilterBar: React.FC<AdminFilterBarProps> = ({
  children,
  onReset,
  resetLabel = "RESET",
  hasActiveFilters = false,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200/70 p-4 shadow-[0_4px_20px_rgba(18,23,53,0.02)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-sans transition-all duration-200",
        className
      )}
    >
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
        {children}
      </div>

      {onReset && (
        <div className="flex items-center justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={!hasActiveFilters}
            className={cn(
              "h-10 px-4 text-[10px] font-bold tracking-[0.16em] uppercase rounded-xl gap-2 transition-all duration-200 cursor-pointer border-slate-200 text-[#0C134F] hover:bg-slate-50",
              !hasActiveFilters && "opacity-40 cursor-not-allowed hover:bg-transparent"
            )}
          >
            <Icons.RotateCcw size={12} className="text-slate-400" />
            <span>{resetLabel}</span>
          </Button>
        </div>
      )}
    </div>
  );
};
