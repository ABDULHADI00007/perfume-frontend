"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export interface ProductGalleryProps {
  images: string[];
  title: string;
  isLimitedEdition?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  className?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  title,
  className = "",
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const displayImages =
    images && images.length > 0
      ? images
      : [
        "/images/perfumes/oyd_royal.png",
        "/images/perfumes/sultan-veils.png",
        "/images/perfumes/amber-rivera.png",
        "/images/perfumes/noir_external.png",
      ];

  const currentImage = displayImages[selectedImageIndex] || displayImages[0];

  const handlePrevImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  }, [displayImages.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  }, [displayImages.length]);

  useEffect(() => {
    if (!isZoomOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsZoomOpen(false);
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };

    const origBodyOverflow = document.body.style.overflow;
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = origBodyOverflow;
      document.documentElement.style.overflow = origHtmlOverflow;
      document.body.style.touchAction = origBodyTouchAction;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isZoomOpen, handlePrevImage, handleNextImage]);

  return (
    <div className={`flex flex-col sm:flex-row gap-4 items-start w-full ${className}`}>
      {/* Thumbnails Strip (Left Column on Desktop, Bottom Row on Mobile) */}
      <div className="flex sm:flex-col gap-2.5 sm:gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-y-auto max-h-[580px] py-1 scrollbar-none flex-shrink-0 w-full sm:w-auto">
          {displayImages.map((img, idx) => {
            const isSelected = selectedImageIndex === idx;
            const isVideoThumb = idx === displayImages.length - 1 && displayImages.length > 3;

            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                aria-label={`Select view ${idx + 1} for ${title}`}
                className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden transition-all duration-200 flex-shrink-0 bg-[#0D1424] border-none outline-none focus:outline-none focus:ring-0 ${isSelected
                  ? "scale-95 shadow-md opacity-100"
                  : "opacity-60 hover:opacity-100"
                  }`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 56px, 80px"
                  className="object-cover object-center"
                />
                {isVideoThumb && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white/90 text-black flex items-center justify-center pl-0.5">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

      {/* Primary Flacon Display Area (Top on Mobile, Right Column on Desktop) */}
      <div className="relative order-1 sm:order-2 sm:flex-1 w-full aspect-[4/4.5] sm:aspect-auto sm:h-[560px] lg:h-[580px] rounded-2xl overflow-hidden bg-[#0F1524] shadow-lg group border-none outline-none ring-0">
        {/* Fullscreen Expand Icon Button (Top-Right) */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          aria-label={`Enlarge image for ${title}`}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-all duration-200 outline-none focus:outline-none cursor-pointer"
          title="Expand image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Main Image Trigger */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="w-full h-full block cursor-zoom-in relative border-none outline-none focus:outline-none focus:ring-0 select-none p-2 sm:p-0"
          aria-label="Enlarge showcase image"
        >
          <Image
            src={currentImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 50vw"
            className="object-contain sm:object-cover sm:object-[center_20%] w-full h-full transition-transform duration-700 ease-out"
          />
        </button>

        {/* Bottom Left Watermark Text Overlay */}
        <div className="absolute bottom-5 left-5 z-10 pointer-events-none">
          <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.28em] text-white/90 drop-shadow-md">
            A FRAGRANCE BEYOND TIME
          </span>
        </div>
      </div>

      {/* 21st.dev ANIMATED MINIMALIST LIGHTBOX MODAL (PORTAL) */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {isZoomOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[99999] bg-white w-screen h-screen overflow-hidden flex items-center justify-center p-4 sm:p-8 select-none"
                style={{ overscrollBehavior: "none" }}
                role="dialog"
                aria-modal="true"
                aria-label={`${title} image preview`}
                onClick={() => setIsZoomOpen(false)}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {/* Top-Right Close Button (✕) */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomOpen(false);
                  }}
                  className="absolute top-5 right-5 sm:top-8 sm:right-8 z-[100000] p-2.5 rounded-full text-stone-600 hover:text-black hover:bg-stone-100 transition-colors cursor-pointer outline-none"
                  aria-label="Close preview"
                >
                  <X className="w-6 h-6 sm:w-7 sm:h-7" />
                </motion.button>

                {/* Previous Arrow Button (‹) - Always visible */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-[100000] p-3 sm:p-4 rounded-full text-stone-700 hover:text-black hover:bg-stone-100/90 transition-all cursor-pointer outline-none select-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.75]" />
                </motion.button>

                {/* Central Showcase Image */}
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{ type: "spring", damping: 28, stiffness: 320 }}
                  className="relative w-full max-w-4xl h-[74vh] sm:h-[80vh] max-h-[80vh] flex items-center justify-center overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImageIndex}
                      initial={{ opacity: 0.75, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.75, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      <Image
                        src={currentImage}
                        alt={title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 95vw, 1200px"
                        className="object-contain pointer-events-none"
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Next Arrow Button (›) - Always visible */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-[100000] p-3 sm:p-4 rounded-full text-stone-700 hover:text-black hover:bg-stone-100/90 transition-all cursor-pointer outline-none select-none"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.75]" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
