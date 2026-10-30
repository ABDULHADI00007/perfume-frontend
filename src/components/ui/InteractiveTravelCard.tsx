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
    const [isCardHovered, setIsCardHovered] = React.useState(false);
    const [isButtonHovered, setIsButtonHovered] = React.useState(false);
    const isFav = isWishlisted !== undefined ? isWishlisted : localLiked;
    const [imgSrc, setImgSrc] = React.useState<string>(
      imageUrl || "/images/perfumes/vivid-desire-still-life.png"
    );

    React.useEffect(() => {
      setImgSrc(imageUrl || "/images/perfumes/vivid-desire-still-life.png");
    }, [imageUrl]);

    const handleImgError = () => {
      if (imgSrc !== "/images/perfumes/vivid-desire-still-life.png") {
        setImgSrc("/images/perfumes/vivid-desire-still-life.png");
      }
    };

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
      const target = e.target as HTMLElement;
      if (target.closest("button")) {
        setIsButtonHovered(true);
        mouseX.set(0);
        mouseY.set(0);
        return;
      }
      setIsButtonHovered(false);
      const rect = e.currentTarget.getBoundingClientRect();
      const { width, height, left, top } = rect;
      const mouseXVal = e.clientX - left;
      const mouseYVal = e.clientY - top;
      const xPct = mouseXVal / width - 0.5;
      const yPct = mouseYVal / height - 0.5;
      mouseX.set(xPct);
      mouseY.set(yPct);
    };

    const handleMouseEnter = () => {
      setIsCardHovered(true);
    };

    const handleMouseLeave = () => {
      setIsCardHovered(false);
      setIsButtonHovered(false);
      mouseX.set(0);
      mouseY.set(0);
    };

    return (
      <div style={{ perspective: 1200 }} className="w-full flex justify-center">
        <motion.div
          ref={ref}
          onClick={handleCardClick}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{
            scale: isCardHovered && !isButtonHovered ? 1.02 : 1,
          }}
          transition={{ scale: { duration: 0.25, ease: "easeOut" } }}
          style={{
            rotateX: isButtonHovered ? "0deg" : rotateX,
            rotateY: isButtonHovered ? "0deg" : rotateY,
            transformStyle: "preserve-3d",
          }}
          className={cn(
            "relative h-[19.5rem] min-[360px]:h-[21rem] min-[440px]:h-[23rem] sm:h-[25rem] lg:h-[29.5rem] w-full max-w-[340px] rounded-[18px] min-[380px]:rounded-[22px] sm:rounded-[30px] overflow-hidden transition-all duration-300 select-none group border border-[#E0D7CB]/80 outline-none bg-[#EBE4D8] cursor-pointer",
            isCardHovered && !isButtonHovered
              ? "shadow-[0_20px_45px_rgba(40,30,20,0.14)]"
              : "shadow-[0_12px_36px_rgba(40,30,20,0.08)]",
            className
          )}
        >
          {/* Base Sharp Image */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src={imgSrc}
              alt={title}
              onError={handleImgError}
              className={cn(
                "w-full h-[112%] sm:h-[114%] object-cover object-top -translate-y-4 min-[380px]:-translate-y-5 sm:-translate-y-7",
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
              src={imgSrc}
              alt=""
              aria-hidden="true"
              onError={handleImgError}
              className={cn(
                "w-full h-[112%] sm:h-[114%] object-cover object-top -translate-y-4 min-[380px]:-translate-y-5 sm:-translate-y-7 scale-110 filter blur-[16px]",
                imageClassName
              )}
            />
          </div>

          {/* Warm Luxury Cream Gradient Overlay matching reference mockup */}
          <div className="absolute inset-x-0 bottom-0 h-[55%] sm:h-[50%] pointer-events-none rounded-b-[18px] min-[380px]:rounded-b-[22px] sm:rounded-b-[30px] z-[6] bg-gradient-to-t from-[#EAE2D7] via-[#EDE6DC]/95 via-40% to-transparent" />

          {/* Card Content Container */}
          <div className="relative h-full flex flex-col justify-between p-1.5 min-[360px]:p-2 sm:p-4.5 pb-2 min-[360px]:pb-2.5 sm:pb-3 z-10 antialiased [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale]">
            {/* Top Row: 14% off Badge on Left, Heart on Right */}
            <div className="flex items-center justify-between w-full pt-0.5 px-0.5 sm:pt-0.5 sm:px-0.5">
              {/* 14% off Badge on Left - Reverted to original dark background & compact size */}
              <span className="px-1.5 min-[360px]:px-2 sm:px-2.5 py-[2px] sm:py-0.5 rounded-full text-[7.5px] min-[360px]:text-[8px] sm:text-[9.5px] font-semibold bg-[#2B2927]/85 backdrop-blur-md text-white shadow-xs tracking-wide shrink-0 whitespace-nowrap">
                {discountBadge}
              </span>

              {/* Floating Wishlist Heart with Sleek Black Circular Backdrop & #590B16 Heart Icon */}
              <motion.button
                type="button"
                onMouseEnter={() => {
                  setIsButtonHovered(true);
                  mouseX.set(0);
                  mouseY.set(0);
                }}
                onMouseLeave={() => {
                  setIsButtonHovered(false);
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
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
                className="w-6.5 h-6.5 min-[380px]:w-7 min-[380px]:h-7 sm:w-8.5 sm:h-8.5 rounded-full bg-black hover:bg-black/90 flex items-center justify-center text-white transition-all cursor-pointer shadow-xs shrink-0"
              >
                <Heart
                  className={cn(
                    "w-3.5 h-3.5 min-[380px]:w-3.5 min-[380px]:h-3.5 sm:w-4.5 sm:h-4.5 drop-shadow-xs transition-all duration-200",
                    isFav
                      ? "fill-[#590B16] text-[#590B16] stroke-[#590B16]"
                      : "fill-none stroke-[#590B16] text-[#590B16] stroke-[2.2] hover:scale-105"
                  )}
                />
              </motion.button>
            </div>

            {/* Bottom Section: Title, Description, Badges, Price, Button */}
            <div className="w-full">
              {/* Title & Description shifted down away from bottle base */}
              <div className="translate-y-0.5 sm:translate-y-4.5">
                <div className="flex items-center justify-between gap-1.5">
                  <Link href={href} className="hover:opacity-90 transition-opacity block group/title flex-1 min-w-0">
                    <h3 className={cn("font-serif text-[12.5px] min-[360px]:text-[13.5px] min-[440px]:text-[16px] sm:text-[19px] lg:text-[21px] font-bold text-[#0A0A0A] tracking-[-0.01em] leading-[1.15] truncate transition-colors group-hover/title:text-black/80", titleClassName)}>
                      {title}
                    </h3>
                  </Link>
                  {subtitle && (
                    <span className="shrink-0 px-1.5 min-[380px]:px-2 sm:px-3 py-[2px] sm:py-1 rounded-full text-[7px] min-[360px]:text-[7.5px] min-[380px]:text-[8.5px] sm:text-[10.5px] font-medium bg-[#2B2927]/80 backdrop-blur-md text-white shadow-xs tracking-wide whitespace-nowrap">
                      {subtitle}
                    </span>
                  )}
                </div>
                <p className="text-[8.5px] min-[360px]:text-[9px] min-[380px]:text-[10px] sm:text-[11.5px] text-[#2C2723] font-medium leading-[1.25] sm:leading-[1.35] mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2 max-w-[270px]">
                  {overview}
                </p>
              </div>

              {/* Stars & Pricing Row: Mobile & Tablet (sm/md) smoothly scaled so price never cuts off; Desktop (lg) remains large */}
              <div className="flex items-center justify-between gap-1 mt-1 sm:mt-2.5">
                {/* 5 Stars and Review Count */}
                <div className="flex items-center gap-0.5 min-[360px]:gap-0.5 md:gap-1 shrink-0">
                  <div className="flex items-center gap-[1px] min-[360px]:gap-[1.5px] md:gap-0.5 shrink-0">
                    {[1, 2, 3, 4, 5].map((starNum) => {
                      const isFilled = starNum <= Math.round(Number(rating) || 5);
                      return (
                        <svg
                          key={starNum}
                          className={cn(
                            "w-2 h-2 min-[360px]:w-2.5 min-[360px]:h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-6 lg:h-6 shrink-0 transition-colors",
                            isFilled
                              ? "fill-[#F97316] text-[#F97316] drop-shadow-[0_1px_2px_rgba(249,115,22,0.35)]"
                              : "fill-[#D1C7BA] text-[#D1C7BA]"
                          )}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      );
                    })}
                  </div>
                  {ratingCount ? (
                    <span className="text-[7px] min-[360px]:text-[7.5px] sm:text-[8.5px] md:text-[9.5px] lg:text-[12px] font-semibold text-[#5C544B] shrink-0 lg:ml-1">
                      ({ratingCount})
                    </span>
                  ) : null}
                </div>

                {/* Price Display: Side-by-side with stars, actual price on top, cut price below */}
                <div className="flex flex-col items-end justify-center shrink-0 text-right pr-0.5">
                  <span className="text-[9.5px] min-[360px]:text-[10px] min-[400px]:text-[11px] sm:text-[11.5px] md:text-[12.5px] lg:text-[15px] font-bold text-[#0A0A0A] font-sans leading-tight whitespace-nowrap">
                    {currency} {price.toLocaleString()}
                  </span>
                  <span className="text-[6.5px] min-[360px]:text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] line-through text-[#6F655B] font-sans leading-tight sm:mt-0.5 whitespace-nowrap">
                    {currency} {originalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Full-Width Luxury Red Pill Button: Add to cart with isolated hover popup */}
              <motion.button
                type="button"
                onMouseEnter={() => {
                  setIsButtonHovered(true);
                  mouseX.set(0);
                  mouseY.set(0);
                }}
                onMouseLeave={() => {
                  setIsButtonHovered(false);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onActionClick();
                }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className={cn(
                  "w-full font-semibold text-[11px] min-[380px]:text-[12px] sm:text-[13px] py-1.5 min-[380px]:py-2 sm:py-2.5 rounded-full transition-all cursor-pointer mt-1.5 sm:mt-2 flex items-center justify-center gap-1.5 sm:gap-2",
                  isAdded
                    ? "bg-[#2B5A41] text-white shadow-md border border-[#2B5A41]"
                    : "bg-[#590B16] hover:bg-[#430811] active:bg-[#30040A] text-white shadow-[0_4px_14px_rgba(89,11,22,0.28)] hover:shadow-[0_8px_24px_rgba(89,11,22,0.45)] border border-[#590B16]/30"
                )}
              >
                {isAdded ? (
                  <>
                    <Check className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] text-white stroke-[2]" />
                    <span className="text-white">Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] text-white stroke-[1.8]" />
                    <span className="text-white font-medium tracking-wide">{actionText}</span>
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
