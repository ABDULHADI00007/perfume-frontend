import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean | string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const inputElement = (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <span className="absolute left-3 text-foreground-muted flex items-center pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-xs border border-border bg-surface px-3 py-2 text-xs font-sans text-foreground shadow-xs transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-foreground-subtle focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-9",
            rightIcon && "pr-9",
            error && "border-status-error focus-visible:ring-status-error",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 text-foreground-muted flex items-center">
            {rightIcon}
          </span>
        )}
      </div>
    );

    if (!label && !error && !helperText) {
      return inputElement;
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-foreground-muted mb-1.5"
          >
            {label}
          </label>
        )}
        {inputElement}
        {typeof error === "string" && error ? (
          <p className="text-[11px] text-status-error mt-1.5 font-sans">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-foreground-subtle mt-1.5 font-sans">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
