import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  description,
  icon,
  className = "",
}) => {
  const badgeVariants = {
    positive: "success",
    negative: "error",
    neutral: "neutral",
  } as const;

  return (
    <Card
      variant="default"
      className={`bg-white rounded-[24px] p-7 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.1)] border-0 transition-all duration-300 group ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
        <CardTitle className="text-xs uppercase tracking-[0.18em] font-bold text-[#64748B] font-sans">
          {title}
        </CardTitle>
        {icon && (
          <div className="w-12 h-12 rounded-full bg-[#FAF4E8] text-[#0B1938] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform border-0">
            {icon}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 space-y-2">
        <div className="text-3xl sm:text-4xl font-sans font-bold text-[#0B1938] leading-none tracking-tight">
          {value}
        </div>

        {(change || description) && (
          <div className="pt-1 flex items-center gap-2 text-xs font-sans">
            {change && (
              <Badge
                variant={badgeVariants[changeType]}
                size="sm"
                className="font-mono text-[9px] px-2 py-0.5"
              >
                {change}
              </Badge>
            )}
            {description && (
              <span className="text-[#64748B] text-xs leading-relaxed font-normal">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};



