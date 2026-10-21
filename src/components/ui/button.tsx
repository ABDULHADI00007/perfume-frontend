import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-sans font-medium uppercase tracking-[0.18em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none active:scale-[0.99]",
  {
    variants: {
      variant: {
        default:
          "bg-[#0C134F] text-white border border-[#0C134F] hover:bg-[#121A4B] hover:border-[#121A4B] active:bg-[#070B30] shadow-xs",
        primary:
          "bg-[#0C134F] text-white border border-[#0C134F] hover:bg-[#121A4B] hover:border-[#121A4B] active:bg-[#070B30] shadow-xs",
        secondary:
          "bg-[#FBF9F5] text-[#0C134F] border border-[#E6E2EA] hover:bg-[#FFFFFF] hover:border-[#C5A880] shadow-xs",
        outline:
          "bg-white text-[#121735] border border-[#E6E2EA] hover:border-[#0C134F] hover:bg-[#FBF9F5] hover:text-[#0C134F] shadow-xs",
        accent:
          "bg-[#C5A880] text-[#0C134F] font-semibold border border-[#C5A880] hover:bg-[#B39266] shadow-xs",
        brand:
          "bg-[#590B16] text-white border border-[#590B16] hover:bg-[#6D0E1C] active:bg-[#470811] shadow-xs hover:shadow-[0_2px_10px_rgba(89,11,22,0.25)]",
        tableAction:
          "bg-white/95 text-[#0C134F] border border-slate-200/90 hover:bg-[#FAF7EE] hover:text-[#590B16] hover:border-[#590B16]/30 shadow-2xs hover:shadow-xs capitalize font-medium tracking-normal",
        tableActionDestructive:
          "bg-rose-50/70 text-rose-600 border border-rose-200/80 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300 shadow-2xs capitalize font-medium tracking-normal",
        tableActionSuccess:
          "bg-emerald-50/70 text-emerald-600 border border-emerald-200/80 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300 shadow-2xs capitalize font-medium tracking-normal",
        ghost:
          "bg-transparent text-[#6B6F80] hover:text-[#121735] hover:bg-[#F8F6F2] border border-transparent",
        link:
          "bg-transparent text-[#0C134F] underline-offset-4 hover:underline border border-transparent p-0 h-auto font-normal lowercase tracking-normal",
        destructive:
          "bg-[#9E2A2B] text-white hover:bg-[#852324] border border-[#9E2A2B] shadow-xs",
        danger:
          "bg-[#9E2A2B] text-white hover:bg-[#852324] border border-[#9E2A2B] shadow-xs",
      },
      size: {
        default: "px-6 py-2.5 text-[11px] tracking-[0.18em]",
        xs: "h-7 px-2.5 text-[11px] tracking-normal font-sans rounded-lg",
        sm: "px-4 py-2 text-[10px] tracking-[0.16em]",
        md: "px-6 py-2.5 text-[11px] tracking-[0.18em]",
        lg: "px-8 py-3 text-xs tracking-[0.2em]",
        icon: "h-9 w-9 p-0 justify-center rounded-lg",
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

