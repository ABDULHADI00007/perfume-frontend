import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      id,
      className = "",
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-medium tracking-[0.14em] uppercase text-foreground/80 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          className={`w-full bg-surface/90 text-foreground text-sm px-3.5 py-2.5 transition-all duration-200 border placeholder:text-foreground-subtle/70 focus:outline-none resize-y ${
            error
              ? "border-status-error focus:border-status-error focus:ring-1 focus:ring-status-error"
              : "border-border hover:border-border-strong focus:border-foreground focus:ring-1 focus:ring-foreground"
          } ${
            disabled
              ? "bg-surface-subtle/50 text-foreground-subtle cursor-not-allowed opacity-60"
              : ""
          } ${className}`}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-status-error mt-1.5 font-sans">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-foreground-subtle mt-1.5 font-sans">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
