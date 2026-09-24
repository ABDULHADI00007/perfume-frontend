import React from "react";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "line" | "with-text" | "with-diamond";
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  variant = "line",
  label,
  className = "",
  ...props
}) => {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`inline-block w-[1px] self-stretch bg-border ${className}`}
        {...props}
      />
    );
  }

  if (variant === "with-text" && label) {
    return (
      <div
        role="separator"
        className={`relative flex items-center justify-center my-6 ${className}`}
        {...props}
      >
        <div className="flex-grow border-t border-border" />
        <span className="flex-shrink mx-4 text-[10px] uppercase tracking-[0.2em] font-medium text-foreground-muted font-sans bg-background px-2">
          {label}
        </span>
        <div className="flex-grow border-t border-border" />
      </div>
    );
  }

  if (variant === "with-diamond") {
    return (
      <div
        role="separator"
        className={`relative flex items-center justify-center my-8 ${className}`}
        {...props}
      >
        <div className="flex-grow border-t border-border" />
        <div className="flex-shrink mx-4 h-1.5 w-1.5 rotate-45 bg-accent/60" />
        <div className="flex-grow border-t border-border" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      className={`w-full border-t border-border my-6 ${className}`}
      {...props}
    />
  );
};
