"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TableActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "brand" | "outline" | "ghost" | "destructive" | "success";
  size?: "xs" | "sm";
  href?: string;
  icon?: React.ReactNode;
}

const variantStyles = {
  default:
    "bg-[#0C134F] text-white border border-[#0C134F] hover:bg-[#151D68] shadow-xs hover:shadow-sm",
  brand:
    "bg-[#590B16] text-white border border-[#590B16] hover:bg-[#6D0E1C] shadow-xs hover:shadow-[0_2px_10px_rgba(89,11,22,0.25)]",
  outline:
    "bg-white/95 text-[#0C134F] border border-slate-200/90 hover:bg-[#FAF7EE] hover:text-[#590B16] hover:border-[#590B16]/30 shadow-2xs hover:shadow-xs",
  ghost:
    "bg-transparent text-slate-600 hover:text-[#0C134F] hover:bg-slate-100/70 border border-transparent",
  destructive:
    "bg-rose-50/70 text-rose-600 border border-rose-200/80 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300 shadow-2xs",
  success:
    "bg-emerald-50/70 text-emerald-600 border border-emerald-200/80 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300 shadow-2xs",
};

const sizeStyles = {
  xs: "h-7 px-2.5 text-[11px] gap-1",
  sm: "h-8 px-3 text-xs gap-1.5",
};

export const TableActionButton = React.forwardRef<
  HTMLButtonElement,
  TableActionButtonProps
>(
  (
    {
      className,
      variant = "outline",
      size = "xs",
      href,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center font-sans font-medium rounded-lg transition-all duration-200 select-none cursor-pointer tracking-normal",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#590B16]/30 focus-visible:ring-offset-1",
      "disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (href && !disabled) {
      return (
        <Link href={href} className={baseClasses}>
          {icon && <span className="inline-flex shrink-0">{icon}</span>}
          <span>{children}</span>
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={baseClasses}
        {...props}
      >
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);
TableActionButton.displayName = "TableActionButton";

export function TableActionGroup({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-center justify-end gap-1.5", className)}>
      {children}
    </div>
  );
}

export default TableActionButton;
