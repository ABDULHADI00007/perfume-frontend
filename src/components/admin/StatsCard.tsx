import React from "react";

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
  const changeColors = {
    positive: "text-status-success",
    negative: "text-status-error",
    neutral: "text-foreground-muted",
  };

  return (
    <div
      className={`p-6 border border-border bg-surface shadow-subtle flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:border-border-strong ${className}`}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] uppercase tracking-[0.18em] font-semibold text-foreground-muted font-sans">
          {title}
        </h4>
        {icon && (
          <div className="w-8 h-8 rounded bg-surface-subtle border border-border flex items-center justify-center text-foreground-muted">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-2xl sm:text-3xl font-serif font-normal text-foreground leading-none tracking-tight">
          {value}
        </p>

        {(change || description) && (
          <div className="mt-2.5 flex items-center space-x-2 text-[11px] font-sans">
            {change && (
              <span className={`font-semibold ${changeColors[changeType]}`}>
                {change}
              </span>
            )}
            {description && (
              <span className="text-foreground-muted leading-tight">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


