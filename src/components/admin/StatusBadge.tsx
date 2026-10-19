import React from "react";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  active: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  paid: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  delivered: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  approved: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  in_stock: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  pending: {
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
  },
  pending_verification: {
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
  },
  unpaid: {
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
  },
  low_stock: {
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
  },
  shipped: {
    bg: "bg-blue-500/10",
    text: "text-blue-700",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
  },
  confirmed: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-700",
    border: "border-indigo-500/20",
    dot: "bg-indigo-500",
  },
  processing: {
    bg: "bg-purple-500/10",
    text: "text-purple-700",
    border: "border-purple-500/20",
    dot: "bg-purple-500",
  },
  cancelled: {
    bg: "bg-rose-500/10",
    text: "text-rose-700",
    border: "border-rose-500/20",
    dot: "bg-rose-500",
  },
  out_of_stock: {
    bg: "bg-rose-500/10",
    text: "text-rose-700",
    border: "border-rose-500/20",
    dot: "bg-rose-500",
  },
  failed: {
    bg: "bg-rose-500/10",
    text: "text-rose-700",
    border: "border-rose-500/20",
    dot: "bg-rose-500",
  },
  inactive: {
    bg: "bg-gray-500/10",
    text: "text-gray-600",
    border: "border-gray-500/20",
    dot: "bg-gray-400",
  },
  archived: {
    bg: "bg-gray-500/10",
    text: "text-gray-600",
    border: "border-gray-500/20",
    dot: "bg-gray-400",
  },
  draft: {
    bg: "bg-gray-500/10",
    text: "text-gray-600",
    border: "border-gray-500/20",
    dot: "bg-gray-400",
  },
};

const defaultStyle = {
  bg: "bg-gray-500/10",
  text: "text-gray-700",
  border: "border-gray-500/20",
  dot: "bg-gray-400",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  if (!status) return null;
  const normalized = status.toLowerCase().replace(/[\s-]+/g, "_");
  const style = statusStyles[normalized] || defaultStyle;
  const label = status.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.14em] font-sans border transition-all shadow-xs",
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 animate-pulse", style.dot)} />
      <span className="capitalize">{label}</span>
    </span>
  );
};
