"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
  icon?: React.ReactNode;
  trendLabel?: string;
  sparklineData?: number[];
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  description,
  icon,
  trendLabel,
  className = "",
}) => {
  const isPositive = changeType === "positive";
  const isNegative = changeType === "negative";

  return (
    <Card
      variant="default"
      className={`relative overflow-hidden bg-white rounded-2xl p-6 space-y-4 border border-slate-200/70 shadow-[0_4px_20px_rgba(18,23,53,0.03)] hover:shadow-[0_12px_32px_rgba(18,23,53,0.07)] hover:border-slate-300 transition-all duration-300 group ${className}`}
    >
      {/* Subtle Ambient Hover Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0C134F]/5 via-[#D4ADFC]/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500 opacity-60" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 relative z-10">
        <CardTitle className="text-[11px] uppercase tracking-[0.18em] font-bold text-slate-500 font-sans">
          {title}
        </CardTitle>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#0C134F] border border-slate-100 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 group-hover:bg-[#0C134F] group-hover:text-white transition-all duration-300">
            {icon}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 space-y-2 relative z-10">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[#0C134F] leading-none tracking-tight tabular-nums">
          {value}
        </div>

        {(change || description) && (
          <div className="pt-1 flex items-center gap-2 text-xs font-sans flex-wrap">
            {change && (
              <span
                className={`inline-flex items-center gap-1 font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isPositive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : isNegative
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {isPositive ? (
                  <Icons.ArrowUpRight size={11} className="stroke-[2.5]" />
                ) : isNegative ? (
                  <Icons.ArrowDownRight size={11} className="stroke-[2.5]" />
                ) : null}
                <span>{change}</span>
              </span>
            )}

            {(description || trendLabel) && (
              <span className="text-slate-500 text-xs leading-relaxed font-normal">
                {trendLabel || description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
