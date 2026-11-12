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
  ({ className, type = "text", label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
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
            "flex h-10 w-full rounded-xl border border-[#E6E2EA] bg-white px-3.5 py-2 text-xs font-sans text-[#0B1938] shadow-2xs transition-all file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-[#94A3B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C134F]/20 focus-visible:border-[#0C134F] disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-9",
            rightIcon && "pr-9",
            error && "border-rose-500 focus-visible:ring-rose-500/20 focus-visible:border-rose-500 bg-rose-50/20",
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
          <p className="text-[11px] text-rose-600 font-medium mt-1.5 font-sans flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-foreground-subtle mt-1.5 font-sans">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
