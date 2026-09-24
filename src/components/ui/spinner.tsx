import React from "react";

export interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeMap = {
  xs: "h-3.5 w-3.5 border",
  sm: "h-4 w-4 border-[1.5px]",
  md: "h-5 w-5 border-2",
  lg: "h-8 w-8 border-2",
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
  label = "Loading...",
}) => {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeMap[size]} ${className}`}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
};

