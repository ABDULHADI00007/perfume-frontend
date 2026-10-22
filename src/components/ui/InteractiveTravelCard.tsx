"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props for the InteractiveTravelCard component.
 */
export interface InteractiveTravelCardProps {
  /** The main title for the card, e.g., "Elite Fusion" */
  title: string;
  /** A subtitle or concentration/size, e.g., "50ml" */
  subtitle?: string;
  /** Overview or short description */
  overview: string;
  /** The URL for the background image. */
  imageUrl: string;
  /** Active price, e.g. 3000 */
  price?: number;
  /** Cut / compare price, e.g. 3500 */
  originalPrice?: number;
  /** Currency symbol or text, e.g. "Rs." */
  currency?: string;
  /** Badge text, e.g. "Best Seller" */
  badge?: string;
  /** Discount badge text, e.g. "14% off" */
  discountBadge?: string;
  /** Stock or secondary badge, e.g. "In Stock" or "9 left" */
  stockBadge?: string;
  /** The text for the primary action button, e.g., "Add to cart" */
  actionText?: string;
  /** Destination URL for the perfume. */
  href: string;
  /** Callback function when the primary action button is clicked. */
  onActionClick: () => void;
  /** Whether the item has just been added */
  isAdded?: boolean;
  /** Whether the item is wishlisted */
  isWishlisted?: boolean;
  /** Wishlist toggle callback */
  onWishlistToggle?: () => void;
  /** Optional additional class names for custom styling. */
  className?: string;
}

/**
 * A luxury card matching the modern rounded design with 3D tilt physics and frosted blur on text area.
 */
export const InteractiveTravelCard = React.forwardRef<
  HTMLDivElement,
  InteractiveTravelCardProps
>(
  (
    {
      title,
      subtitle = "50ml",
      overview,
      imageUrl,
      price = 3000,
      originalPrice = 3500,
      currency = "Rs.",
      badge = "Best Seller",
      discountBadge = "14% off",
      stockBadge,
      actionText = "Add to cart",
      href,
      onActionClick,
      isAdded = false,
      isWishlisted,
      onWishlistToggle,
      className,
    },
    ref
  ) => {
    const [localLiked, setLocalLiked] = React.useState(false);
    const isFav = isWishlisted !== undefined ? isWishlisted : localLiked;

    // --- 3D Tilt Animation Logic with Buttery Smooth Spring Physics ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Buttery smooth luxury spring configuration
    const springConfig = { damping: 22, stiffness: 120, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // 3D tilt angles: top, bottom, left, and right all respond with fluid depth
    const rotateX = useTransform(springY, [-0.5, 0.5], ["14deg", "-14deg"]);
    const rotateY = useTransform(springX, [-0.5, 0.5], ["-14deg", "14deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const { width, height, left, top } = rect;
      const mouseXVal = e.clientX - left;
      const mouseYVal = e.clientY - top;
      const xPct = mouseXVal / width - 0.5;
      const yPct = mouseYVal / height - 0.5;
      mouseX.set(xPct);
      mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    return (
      <div style={{ perspective: 1200 }} className="w-full flex justify-center">
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: 1.02 }}
          transition={{ scale: { duration: 0.3, ease: "easeOut" } }}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className={cn(
            "relative h-[29rem] w-full max-w-[340px] rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 select-none group border-0 outline-none bg-[#0D1424] cursor-pointer",
            className
          )}
        >
          {/* Full Bleed Perfume Image */}
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Ambient Dark Gradient for Contrast & High Readability (No blur) */}
          <div className="absolute inset-x-0 bottom-0 h-[62%] pointer-events-none rounded-b-[32px] bg-gradient-to-t from-black/85 via-black/40 via-50% to-transparent" />

          {/* Card Content Container - Crystal Sharp Typography */}
          <div className="relative h-full flex flex-col justify-between p-5 sm:p-6 text-white z-10 antialiased [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale]">
            {/* Top Row: Discount Badge on Left, Circular Heart Button on Right */}
            <div className="flex items-center justify-between w-full">
              {/* 14% off Badge on Left */}
              <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-black/40 backdrop-blur-sm border border-white/20 text-white/95 shadow-sm">
                {discountBadge}
              </span>

            {/* Minimalist Floating Wishlist Heart (matching reference) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onWishlistToggle) {
                  onWishlistToggle();
                } else {
                  setLocalLiked(!localLiked);
                }
              }}
              aria-label="Save to wishlist"
              className="p-1.5 -mr-1 text-white transition-transform cursor-pointer flex items-center justify-center"
            >
              <Heart
                className={cn(
                  "w-6 h-6 stroke-[1.8] drop-shadow-[0_2px_5px_rgba(0,0,0,0.45)] transition-all duration-200",
                  isFav
                    ? "fill-white text-white"
                    : "fill-none text-white hover:scale-105"
                )}
              />
            </motion.button>
            </div>

            {/* Bottom Section: Title, Price, Description, Badges, Button */}
            <div className="space-y-3">
              {/* Title Row */}
              <div>
                <Link href={href} className="hover:underline">
                  <h3 className="text-2xl sm:text-[25px] font-bold font-sans text-white tracking-tight leading-tight drop-shadow-sm">
                    {title}
                  </h3>
                </Link>
              </div>

              {/* Overview / Description */}
              <p className="text-xs sm:text-[13px] text-white/90 font-normal leading-relaxed line-clamp-2 drop-shadow-xs">
                {overview}
              </p>

              {/* Pill Tags & Pricing Row (Best Seller, 24 left, and Price badge) */}
              <div className="flex items-center justify-between gap-1.5 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/45 backdrop-blur-md text-white/95 border border-white/10 shadow-xs">
                    {badge}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/45 backdrop-blur-md text-white/95 border border-white/10 shadow-xs">
                    {stockBadge || subtitle}
                  </span>
                </div>

                {/* Price Pill Badge with cut price stacked above active real price */}
                <div className="flex flex-col items-end justify-center bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl sm:rounded-2xl border border-white/10 shadow-sm shrink-0">
                  <span className="text-[10px] line-through text-white/50 font-sans leading-tight">
                    {currency} {originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-white font-sans leading-tight">
                    {currency} {price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Full-Width White Pill Button: Add to cart */}
              <motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onActionClick();
                }}
                whileHover={{ scale: 1.02 }}
                className="w-full bg-white text-black hover:bg-neutral-100 font-bold text-sm py-3.5 rounded-full transition-colors shadow-lg cursor-pointer mt-2 text-center"
              >
                {isAdded ? "Added to cart ✓" : actionText}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
);

InteractiveTravelCard.displayName = "InteractiveTravelCard";
