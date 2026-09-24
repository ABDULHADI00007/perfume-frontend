import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs font-sans font-medium uppercase tracking-[0.2em] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#0B1938] text-white border border-[#C5A880]/40 hover:border-[#C5A880] hover:bg-[#172552] active:bg-[#060D24] shadow-md shadow-[#0B1938]/15 hover:shadow-xl hover:shadow-[#0B1938]/25 hover:-translate-y-0.5",
        primary:
          "bg-[#0B1938] text-white border border-[#C5A880]/40 hover:border-[#C5A880] hover:bg-[#172552] active:bg-[#060D24] shadow-md shadow-[#0B1938]/15 hover:shadow-xl hover:shadow-[#0B1938]/25 hover:-translate-y-0.5",
        secondary:
          "bg-[#FAF6F0] text-[#0B1938] border border-[#C5A880]/40 hover:bg-[#F3EADF] hover:border-[#C5A880] shadow-xs hover:shadow-md hover:-translate-y-0.5",
        outline:
          "bg-white/80 backdrop-blur-md text-[#0B1938] border border-[#0B1938]/20 hover:border-[#C5A880] hover:bg-[#0B1938] hover:text-white shadow-xs hover:shadow-md hover:-translate-y-0.5",
        accent:
          "bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#B39266] text-[#0B1938] font-semibold border border-[#C5A880] shadow-md shadow-[#C5A880]/20 hover:shadow-xl hover:shadow-[#C5A880]/35 hover:-translate-y-0.5 hover:brightness-105",
        ghost:
          "bg-transparent text-[#0B1938] hover:bg-[#0B1938]/5 active:bg-[#0B1938]/10 border border-transparent",
        link:
          "bg-transparent text-[#0B1938] underline-offset-8 hover:underline hover:text-accent border border-transparent p-0 h-auto font-normal lowercase tracking-normal",
        destructive:
          "bg-destructive text-white hover:opacity-90 border border-destructive shadow-sm hover:shadow-md",
        danger:
          "bg-status-error text-white hover:opacity-90 border border-status-error shadow-sm hover:shadow-md",
      },
      size: {
        default: "px-7 py-3.5 text-[11px] tracking-[0.2em]",
        sm: "px-5 py-2.5 text-[10px] tracking-[0.18em]",
        md: "px-7 py-3.5 text-[11px] tracking-[0.2em]",
        lg: "px-9 py-4 text-xs tracking-[0.22em]",
        icon: "h-11 w-11 p-0 justify-center rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || isLoading;

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <Spinner
            size={size === "sm" ? "xs" : "sm"}
            className={children ? "mr-2 text-current" : "text-current"}
          />
        )}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex items-center">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 inline-flex items-center">{rightIcon}</span>}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

