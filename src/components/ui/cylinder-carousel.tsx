"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CarouselImage {
  src: string;
  alt?: string;
  title?: string;
}

export interface CylinderCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: CarouselImage[];
  containerClassName?: string;
  cardClassName?: string;
  animationDuration?: number; // in seconds
  cardWidth?: number | string; // in pixels or CSS value
  cardAspectRatio?: string; // e.g. "7/10"
  perspective?: string; // e.g. "50em"
  maskGradient?: string;
}

export const CylinderCarousel = React.forwardRef<HTMLDivElement, CylinderCarouselProps>(
  (
    {
      images,
      className,
      containerClassName,
      cardClassName,
      animationDuration = 28,
      cardWidth = 360,
      cardAspectRatio = "7/10",
      perspective = "52em",
      maskGradient = "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)",
      ...props
    },
    ref
  ) => {
    const N = images.length;
    const widthVal = typeof cardWidth === "number" ? `${cardWidth}px` : cardWidth;

    const customStyle = {
      "--n": N,
      "--w": widthVal,
      "--ba": `calc(1turn / var(--n))`,
      "--anim-dur": `${animationDuration}s`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-full min-h-[500px] grid place-items-center overflow-hidden select-none",
          className
        )}
        style={{
          perspective,
          maskImage: maskGradient,
          WebkitMaskImage: maskGradient,
        }}
        {...props}
      >
        <div
          className={cn(
            "grid place-items-center [transform-style:preserve-3d] motion-reduce:!animate-[ry_128s_linear_infinite]",
            containerClassName
          )}
          style={{
            ...customStyle,
            animation: "ry var(--anim-dur) linear infinite",
          }}
        >
          {/* Inline keyframes for continuous 3D rotation */}
          <style>
            {`
              @keyframes ry {
                to { transform: rotateY(1turn); }
              }
            `}
          </style>

          {images.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt || `Carousel image ${i}`}
              className={cn(
                "[grid-area:1/1] object-cover rounded-2xl [backface-visibility:hidden] shadow-2xl transition-all duration-300",
                cardClassName
              )}
              style={{
                width: "var(--w)",
                aspectRatio: cardAspectRatio,
                "--i": i,
                transform:
                  "rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 0.5em) / tan(0.5 * var(--ba))))",
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    );
  }
);

CylinderCarousel.displayName = "CylinderCarousel";
export default CylinderCarousel;
