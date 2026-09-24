"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

export type AspectRatio = "3/4" | "1/1" | "16/9" | "4/5" | "auto";

export interface OptimizedImageProps
  extends Omit<ImageProps, "onLoad" | "onError"> {
  aspectRatio?: AspectRatio;
  containerClassName?: string;
  fallbackSrc?: string;
}

const aspectClasses: Record<AspectRatio, string> = {
  "3/4": "aspect-[3/4]",
  "1/1": "aspect-square",
  "16/9": "aspect-[16/9]",
  "4/5": "aspect-[4/5]",
  auto: "",
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  aspectRatio = "3/4",
  containerClassName = "",
  className = "",
  fallbackSrc = "/images/perfumes/oyd_royal.png",
  fill = true,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);

  const isFill = fill || aspectRatio !== "auto";

  return (
    <div
      className={`relative overflow-hidden bg-surface-subtle ${
        aspectClasses[aspectRatio]
      } ${containerClassName}`}
    >
      {/* Loading shimmer background */}
      {isLoading && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-surface-subtle/80 z-0"
        />
      )}

      <Image
        src={imgSrc || fallbackSrc}
        alt={alt}
        fill={isFill}
        sizes={sizes}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          if (fallbackSrc && imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
          }
        }}
        className={`transition-all duration-500 ease-luxury object-cover ${
          isLoading ? "scale-105 blur-sm opacity-0" : "scale-100 blur-0 opacity-100"
        } ${className}`}
        {...props}
      />
    </div>
  );
};
