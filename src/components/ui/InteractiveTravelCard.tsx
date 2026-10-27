"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props for the InteractiveTravelCard component.
 */
export interface InteractiveTravelCardProps {
  /** The main title for the card, e.g., "Elite Fusion" */
  title: string;
  /** Optional custom class for title */
  titleClassName?: string;
  /** A subtitle or concentration/size, e.g., "50ml" */
  subtitle?: string;
  /** Overview or short description */
  overview: string;
  /** Rating out of 5, e.g. 5 or 4.9 */
  rating?: number;
  /** Number of customer reviews, e.g. 142 */
  ratingCount?: number;
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
  /** Optional custom class name or positioning for image */
  imageClassName?: string;
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
      titleClassName,
      subtitle = "50ml",
      overview,
      rating = 5,
      ratingCount,
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
      imageClassName,
      className,
    },
    ref
  ) => {
    const router = useRouter();
    const [localLiked, setLocalLiked] = React.useState(false);
    const isFav = isWishlisted !== undefined ? isWishlisted : localLiked;

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      // Do not navigate if user clicked on action buttons (like wishlist or add to cart)
      if (target.closest("button")) {
        return;
      }
      if (href) {
        router.push(href);
      }
    };

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
          onClick={handleCardClick}
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
            "relative h-[29.5rem] w-full max-w-[340px] rounded-[30px] overflow-hidden shadow-[0_12px_36px_rgba(40,30,20,0.08)] hover:shadow-[0_20px_45px_rgba(40,30,20,0.14)] transition-all duration-300 select-none group border border-[#E0D7CB]/80 outline-none bg-[#EBE4D8] cursor-pointer",
            className
          )}
        >
          {/* Base Sharp Image */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src={imageUrl}
              alt={title}
              className={cn(
                "w-full h-[114%] object-cover object-top -translate-y-5 sm:-translate-y-7",
                imageClassName
              )}
            />
          </div>

          {/* Permanent Frosted Glass Blur at Bottom (Visible in Normal State) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none z-[5]"
            style={{
              maskImage: "linear-gradient(to top, black 0%, black 18%, transparent 40%)",
              WebkitMaskImage: "linear-gradient(to top, black 0%, black 18%, transparent 40%)",
            }}
          >
            <img
              src={imageUrl}
              alt=""
              aria-hidden="true"
              className={cn(
                "w-full h-[114%] object-cover object-top -translate-y-5 sm:-translate-y-7 scale-110 filter blur-[16px]",
                imageClassName
              )}
            />
          </div>

          {/* Warm Luxury Cream Gradient Overlay matching reference mockup */}
          <div className="absolute inset-x-0 bottom-0 h-[50%] pointer-events-none rounded-b-[30px] z-[6] bg-gradient-to-t from-[#EAE2D7] via-[#EDE6DC]/95 via-36% to-transparent" />

          {/* Card Content Container */}
          <div className="relative h-full flex flex-col justify-between p-4 sm:p-4.5 pb-2.5 sm:pb-3 z-10 antialiased [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale]">
            {/* Top Row: Discount Badge on Left, Clean White Heart on Right */}
            <div className="flex items-center justify-between w-full pt-0.5 px-0.5">
              {/* 14% off Badge on Left */}
              <span className="px-3 py-1 rounded-full text-[10.5px] font-medium bg-[#2B2927]/80 backdrop-blur-md text-white shadow-sm tracking-wide">
                {discountBadge}
              </span>

              {/* Minimalist Floating Wishlist Heart */}
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
                className="p-1 -mr-0.5 text-white transition-transform cursor-pointer flex items-center justify-center"
              >
                <Heart
                  className={cn(
                    "w-5 h-5 stroke-white stroke-[2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] transition-all duration-200",
                    isFav
                      ? "fill-red-600 text-red-600 stroke-red-600"
                      : "fill-none text-white hover:scale-105"
                  )}
                />
              </motion.button>
            </div>

            {/* Bottom Section: Title, Description, Badges, Price, Button - Exactly matched to reference Image 1 */}
            <div className="w-full">
              {/* Title & Description shifted down away from bottle base */}
              <div className="translate-y-3.5 sm:translate-y-4.5">
                <Link href={href} className="hover:opacity-90 transition-opacity block">
                  <h3 className={cn("font-serif text-[19px] sm:text-[21px] font-semibold sm:font-bold text-[#0A0A0A] tracking-[-0.01em] leading-[1.12]", titleClassName)}>
                    {title}
                  </h3>
                </Link>
                <p className="text-[11.5px] text-[#2C2723] font-medium leading-[1.35] mt-1 line-clamp-2 max-w-[270px]">
                  {overview}
                </p>
              </div>

              {/* Pill Tags & Pricing Row with Rating in place of badges */}
              <div className="flex items-center justify-between gap-2 mt-2 sm:mt-2.5">
                <div className="flex items-center gap-1.5">
                  {/* Rating Pill */}
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-[#DFD5C8] text-[#22201E] tracking-tight shadow-2xs flex items-center gap-1">
                    <svg className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-[#0A0A0A]">{Number(rating).toFixed(1)}</span>
                    {ratingCount ? (
                      <span className="text-[#635C54]">({ratingCount})</span>
                    ) : null}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-[#DFD5C8] text-[#22201E] tracking-tight shadow-2xs">
                    {subtitle || "50ml"}
                  </span>
                </div>

                {/* Price Pill Badge with cut price stacked above active real price */}
                <div className="flex flex-col items-end justify-center bg-[#DFD2C3] px-2.5 py-0.5 rounded-[13px] shrink-0 border border-white/20 shadow-xs">
                  <span className="text-[9.5px] line-through text-[#6F655B] font-sans leading-tight">
                    {currency} {originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[14.5px] font-bold text-[#050505] font-sans leading-tight">
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
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-[#0A0A0A] hover:bg-[#FAF9F7] font-semibold text-[13px] py-2 sm:py-2.5 rounded-full transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md cursor-pointer mt-2 flex items-center justify-center gap-2 border border-black/[0.04]"
              >
                {isAdded ? (
                  <>
                    <Check className="w-[16px] h-[16px] text-emerald-600 stroke-[2]" />
                    <span>Added to cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-[16px] h-[16px] text-[#0A0A0A] stroke-[1.8]" />
                    <span>{actionText}</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
);

InteractiveTravelCard.displayName = "InteractiveTravelCard";
