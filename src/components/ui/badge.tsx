import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-sans font-medium uppercase tracking-[0.2em] transition-all duration-300 shadow-2xs backdrop-blur-md",
  {
    variants: {
      variant: {
        default:
          "border-[#C5A880]/40 bg-[#0C134F] text-white hover:bg-[#141C66]",
        primary:
          "border-[#C5A880]/40 bg-[#0C134F] text-white hover:bg-[#141C66]",
        secondary:
          "border-[#C5A880]/30 bg-[#FAF6F0] text-[#0C134F]",
        outline: "border-[#C5A880]/50 bg-white/70 text-[#0C134F] hover:border-[#C5A880]",
        accent:
          "border-[#C5A880] bg-gradient-to-r from-[#C5A880]/20 to-[#B39266]/20 text-[#0C134F] font-semibold",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive",
        error:
          "border-status-error/30 bg-status-error-subtle text-status-error-foreground",
        success:
          "border-status-success/30 bg-status-success-subtle text-status-success-foreground",
        warning:
          "border-status-warning/30 bg-status-warning-subtle text-status-warning-foreground",
        info:
          "border-status-info/30 bg-status-info-subtle text-status-info-foreground",
        neutral:
          "border-border bg-surface-muted/60 text-foreground-muted",
        dark:
          "border-white/10 bg-[#0C134F] text-white",
      },
      size: {
        default: "px-3 py-1 text-[10px]",
        sm: "px-2.5 py-0.5 text-[9px]",
        lg: "px-4 py-1.5 text-[11px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

