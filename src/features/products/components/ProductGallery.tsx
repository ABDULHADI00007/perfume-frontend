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
        "/images/perfumes/Crown Legacy_ Regal Golden Perfume Still Life.png",
        "/images/perfumes/Sultan’s Veil by Lanternlight.png",
        "/images/perfumes/Infinite Boss in Golden Stone Light.png",
        "/images/perfumes/collection_sultans_veil.jpg",
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
    <div className={`flex flex-col lg:flex-row gap-3.5 sm:gap-4 items-start w-full ${className}`}>
      {/* Thumbnails Strip (Left Column on Desktop, Bottom Row on Mobile & Tablet) */}
      <div className="flex lg:flex-col gap-2.5 sm:gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-y-auto max-h-[580px] py-1 scrollbar-none flex-shrink-0 w-full lg:w-auto">
        {displayImages.map((img, idx) => {
          const isSelected = selectedImageIndex === idx;
          const isVideoThumb = idx === displayImages.length - 1 && displayImages.length > 3;

          return (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setSelectedImageIndex(idx)}
              aria-label={`Select view ${idx + 1} for ${title}`}
              className={`relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden transition-all duration-200 flex-shrink-0 bg-[#FAF7EE] border border-stone-200/60 outline-none focus:outline-none ${isSelected
                ? "scale-95 shadow-md opacity-100 ring-2 ring-[#590B16]"
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

      {/* Primary Flacon Display Area (Top on Mobile & Tablet, Right Column on Desktop) */}
      <div className="relative order-1 lg:order-2 flex-1 w-full aspect-[4/5] sm:aspect-[4/4.5] md:aspect-[4/5] lg:aspect-auto lg:h-[580px] rounded-2xl overflow-hidden bg-[#FAF7EE] shadow-sm group border border-stone-200/60 outline-none ring-0">
        {/* Fullscreen Expand Icon Button (Top-Right) */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsZoomOpen(true)}
          aria-label={`Enlarge image for ${title}`}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-all duration-200 outline-none focus:outline-none cursor-pointer"
          title="Expand image"
        >
          <Maximize2 className="w-4 h-4" />
        </motion.button>

        {/* On-Card Navigation Arrows for Mobile and Tablet View */}
        {displayImages.length > 1 && (
          <>
            <div className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 z-20 pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center justify-center active:scale-90 transition-transform cursor-pointer border border-stone-200/70"
                aria-label="Previous view"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>
            <div className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-[0_2px_12px_rgba(0,0,0,0.15)] flex items-center justify-center active:scale-90 transition-transform cursor-pointer border border-stone-200/70"
                aria-label="Next view"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>
          </>
        )}

        {/* Main Image Trigger */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.15 }}
          onClick={() => setIsZoomOpen(true)}
          className="w-full h-full block cursor-zoom-in relative border-none outline-none focus:outline-none focus:ring-0 select-none p-0"
          aria-label="Enlarge showcase image"
        >
          <Image
            src={currentImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 50vw"
            className="object-cover object-center sm:object-[center_20%] w-full h-full transition-transform duration-700 ease-out"
          />
        </motion.button>

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
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ scale: 1.12, rotate: 90 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomOpen(false);
                  }}
                  className="absolute top-4 right-4 sm:top-7 sm:right-7 z-[100000] p-3 rounded-full text-stone-600 hover:text-black hover:bg-stone-100 transition-colors cursor-pointer outline-none"
                  aria-label="Close preview"
                >
                  <X className="w-6 h-6 sm:w-7 sm:h-7" />
                </motion.button>

                {/* Previous Arrow Button (‹) - Rock-solid vertical center, never jumps */}
                <div className="fixed sm:absolute left-2 sm:left-5 md:left-8 top-1/2 -translate-y-1/2 z-[100000] pointer-events-auto">
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white text-stone-800 hover:text-black shadow-[0_4px_24px_rgba(0,0,0,0.16)] border border-stone-200/80 transition-shadow duration-150 cursor-pointer outline-none flex items-center justify-center"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2]" />
                  </motion.button>
                </div>

                {/* Central Showcase Image with Smooth Scale Zoom Animation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.65, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.75, y: 12 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 180,
                    mass: 0.6,
                  }}
                  className="relative w-full max-w-4xl h-[70vh] sm:h-[80vh] max-h-[82vh] flex items-center justify-center overflow-hidden px-8 sm:px-16"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      <Image
                        src={currentImage}
                        alt={title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 90vw, 1100px"
                        className="object-contain pointer-events-none select-none"
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Next Arrow Button (›) - Rock-solid vertical center, never jumps */}
                <div className="fixed sm:absolute right-2 sm:right-5 md:right-8 top-1/2 -translate-y-1/2 z-[100000] pointer-events-auto">
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white text-stone-800 hover:text-black shadow-[0_4px_24px_rgba(0,0,0,0.16)] border border-stone-200/80 transition-shadow duration-150 cursor-pointer outline-none flex items-center justify-center"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2]" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
