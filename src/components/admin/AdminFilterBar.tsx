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
  resetLabel = "RESET FILTERS",
  hasActiveFilters = false,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[#E6E2EA] p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-sans transition-all duration-200",
        className
      )}
    >
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
        {children}
      </div>

      {onReset && (
        <div className="flex items-center justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EFECE6]">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={!hasActiveFilters}
            className={cn(
              "h-10 px-4 text-[10px] font-bold tracking-[0.16em] uppercase rounded-xl gap-2 transition-all duration-200 cursor-pointer border-[#E2DED6] text-[#0B1938] hover:bg-[#FAF8F5]",
              !hasActiveFilters && "opacity-50 cursor-not-allowed"
            )}
          >
            <Icons.RotateCcw size={13} className="text-[#64748B]" />
            <span>{resetLabel}</span>
          </Button>
        </div>
      )}
    </div>
  );
};
