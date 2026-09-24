import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  className = "",
  ...props
}) => {
  const variantStyles = {
    rectangular: "rounded-none",
    circular: "rounded-full",
    text: "h-4 rounded-xs",
  };

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-surface-subtle/80 border border-border-subtle/40 ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
};

