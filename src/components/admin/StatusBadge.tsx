"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md";
}

const statusStyles: Record<
  string,
  { bg: string; text: string; border: string; dot: string; pulse?: boolean }
> = {
  active: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  paid: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  delivered: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  approved: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  in_stock: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  published: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  pending: {
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    border: "border-amber-500/25",
    dot: "bg-amber-500",
    pulse: true,
  },
  pending_verification: {
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    border: "border-amber-500/25",
    dot: "bg-amber-500",
    pulse: true,
  },
  unpaid: {
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    border: "border-amber-500/25",
    dot: "bg-amber-500",
  },
  low_stock: {
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    border: "border-amber-500/25",
    dot: "bg-amber-500",
    pulse: true,
  },
  draft: {
    bg: "bg-slate-500/10",
    text: "text-slate-600",
    border: "border-slate-500/20",
    dot: "bg-slate-400",
  },
  shipped: {
    bg: "bg-sky-500/10",
    text: "text-sky-700",
    border: "border-sky-500/25",
    dot: "bg-sky-500",
  },
  confirmed: {
    bg: "bg-[#0C134F]/10",
    text: "text-[#0C134F]",
    border: "border-[#0C134F]/20",
    dot: "bg-[#0C134F]",
  },
  processing: {
    bg: "bg-purple-500/10",
    text: "text-purple-700",
    border: "border-purple-500/25",
    dot: "bg-purple-500",
    pulse: true,
  },
  cancelled: {
    bg: "bg-rose-500/10",
    text: "text-rose-700",
    border: "border-rose-500/25",
    dot: "bg-rose-500",
  },
  out_of_stock: {
    bg: "bg-rose-500/10",
    text: "text-rose-700",
    border: "border-rose-500/25",
    dot: "bg-rose-500",
  },
  failed: {
    bg: "bg-rose-500/10",
    text: "text-rose-700",
    border: "border-rose-500/25",
    dot: "bg-rose-500",
  },
  rejected: {
    bg: "bg-rose-500/10",
    text: "text-rose-700",
    border: "border-rose-500/25",
    dot: "bg-rose-500",
  },
  refunded: {
    bg: "bg-slate-500/10",
    text: "text-slate-700",
    border: "border-slate-500/20",
    dot: "bg-slate-400",
  },
  inactive: {
    bg: "bg-slate-500/10",
    text: "text-slate-500",
    border: "border-slate-500/20",
    dot: "bg-slate-400",
  },
  archived: {
    bg: "bg-[#590B16]/10",
    text: "text-[#590B16]",
    border: "border-[#590B16]/25",
    dot: "bg-[#590B16]",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
  size = "sm",
}) => {
  const normalizedKey = status?.toLowerCase().replace(/\s+/g, "_") || "pending";
  const style = statusStyles[normalizedKey] || {
    bg: "bg-slate-500/10",
    text: "text-slate-600",
    border: "border-slate-500/20",
    dot: "bg-slate-400",
  };

  const formattedLabel = status
    ? status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Unknown";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium font-sans border backdrop-blur-2xs transition-all duration-200 select-none",
        size === "sm" ? "px-2.5 py-0.5 text-[10.5px] tracking-wide" : "px-3 py-1 text-xs tracking-wide",
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {style.pulse && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              style.dot
            )}
          />
        )}
        <span
          className={cn("relative inline-flex rounded-full h-1.5 w-1.5", style.dot)}
        />
      </span>
      <span>{formattedLabel}</span>
    </span>
  );
};

export default StatusBadge;
