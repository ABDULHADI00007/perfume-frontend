import React from "react";
import { Badge, BadgeProps } from "@/components/ui/badge";

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusMap: Record<string, NonNullable<BadgeProps["variant"]>> = {
  pending: "warning",
  pending_verification: "warning",
  awaiting_payment_verification: "warning",
  confirmed: "accent",
  processing: "accent",
  shipped: "default",
  delivered: "success",
  cancelled: "error",
  payment_rejected: "error",
  rejected: "error",
  failed: "error",
  paid: "success",
  unpaid: "warning",
  refunded: "neutral",
  partially_refunded: "warning",
  active: "success",
  subscribed: "success",
  unsubscribed: "neutral",
  draft: "neutral",
  archived: "neutral",
  in_stock: "success",
  low_stock: "warning",
  out_of_stock: "error",
  blocked: "error",
  approved: "success",
};

const dotColors: Record<string, string> = {
  success: "bg-[#2B5A41]",
  warning: "bg-[#926618]",
  error: "bg-[#9E2A2B]",
  accent: "bg-[#D4ADFC]",
  default: "bg-[#0C134F]",
  neutral: "bg-[#6B6F80]",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  if (!status) return null;
  const normalized = status.toLowerCase().replace(/[\s-]+/g, "_");
  const variant = statusMap[normalized] || "neutral";
  const label = status.replace(/_/g, " ");

  return (
    <Badge
      variant={variant}
      size="sm"
      className={`capitalize font-sans font-medium tracking-[0.14em] text-[9px] px-2.5 py-0.5 border inline-flex items-center gap-1.5 rounded-sm ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full inline-block ${dotColors[variant] || "bg-current"}`} />
      <span>{label}</span>
    </Badge>
  );
};



