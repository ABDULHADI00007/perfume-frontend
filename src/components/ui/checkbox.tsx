"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "onChange"> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
  onChange?: (e: { target: { checked: boolean } }) => void;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, error, helperText, id, checked, onCheckedChange, onChange, ...props }, ref) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  const handleCheckedChange = (isChecked: boolean | "indeterminate") => {
    const val = isChecked === true;
    if (onCheckedChange) {
      onCheckedChange(val);
    }
    if (onChange) {
      onChange({ target: { checked: val } });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2.5">
        <CheckboxPrimitive.Root
          ref={ref}
          id={inputId}
          checked={checked}
          onCheckedChange={handleCheckedChange}
          className={cn(
            "peer h-4.5 w-4.5 shrink-0 rounded-md border border-[#C4C0C9] bg-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C134F]/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#0C134F] data-[state=checked]:border-[#0C134F] data-[state=checked]:text-white transition-all shadow-2xs",
            error && "border-rose-500 data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600",
            className
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator
            className={cn("flex items-center justify-center text-current")}
          >
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-sans font-medium text-[#121735] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
      {error ? (
        <p className="text-[11px] text-rose-600 mt-1 ml-6 font-sans">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[#6B6F80] mt-1 ml-6 font-sans">{helperText}</p>
      ) : null}
    </div>
  );
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
