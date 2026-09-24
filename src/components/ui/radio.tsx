import React from "react";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      error,
      helperText,
      id,
      className = "",
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const inputId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col">
        <label
          htmlFor={inputId}
          className={`group inline-flex items-start gap-3 select-none ${
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          }`}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={ref}
              id={inputId}
              type="radio"
              checked={checked}
              disabled={disabled}
              className="peer sr-only"
              {...props}
            />
            <div
              className={`h-4 w-4 rounded-full border transition-all duration-150 flex items-center justify-center bg-surface ${
                error
                  ? "border-status-error peer-checked:border-status-error"
                  : "border-border-strong hover:border-foreground peer-checked:border-primary"
              } peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-1 ${className}`}
            >
              <div className="h-2 w-2 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>
          {label && (
            <span className="text-sm font-sans text-foreground leading-tight">
              {label}
            </span>
          )}
        </label>
        {error ? (
          <p className="text-xs text-status-error mt-1 ml-7 font-sans">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-foreground-subtle mt-1 ml-7 font-sans">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Radio.displayName = "Radio";
