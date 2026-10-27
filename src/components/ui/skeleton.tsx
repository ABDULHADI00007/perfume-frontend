import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text";
  shimmer?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  shimmer = true,
  className = "",
  ...props
}) => {
  const variantStyles = {
    rectangular: "rounded-xl",
    circular: "rounded-full",
    text: "h-4 rounded-md",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden bg-[#ECE8E1]/80",
        shimmer &&
          "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent",
        !shimmer && "animate-pulse",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
};


