"use client";

import React, { useState } from "react";
import Image from "next/image";

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

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = currentImage;
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-view-${selectedImageIndex + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {/* Primary Flacon Display Area (Top on Mobile, Right Column on Desktop - Original Size with Bottom Cropping) */}
      <div className="relative order-1 sm:order-2 sm:flex-1 w-full aspect-[4/4.5] sm:aspect-auto sm:h-[560px] lg:h-[580px] rounded-2xl overflow-hidden bg-[#0F1524] shadow-lg group border-none outline-none ring-0">
        {/* Fullscreen Expand Icon Button (Top-Right) */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          aria-label={`Enlarge image for ${title}`}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-all duration-200 outline-none focus:outline-none"
          title="Expand image"
        >
          <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>

        {/* Main Image Trigger (Anchored to top: bottle cap fully visible, extra bottom marble space cropped) */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="w-full h-full block cursor-zoom-in relative border-none outline-none focus:outline-none focus:ring-0 select-none"
          aria-label="Enlarge showcase image"
        >
          <Image
            src={currentImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 50vw"
            className="object-cover object-[center_20%] w-full h-full transition-transform duration-700 ease-out"
            style={{ objectPosition: "center 20%" }}
          />
        </button>

        {/* Bottom Left Watermark Text Overlay */}
        <div className="absolute bottom-5 left-5 z-10 pointer-events-none">
          <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.28em] text-white/90 drop-shadow-md">
            A FRAGRANCE BEYOND TIME
          </span>
        </div>
      </div>

            {/* FULLSCREEN LUXURY GALLERY MODAL (Exact match to User's Reference Screenshot) */}
            {isZoomOpen && (
              <div
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
                role="dialog"
                aria-modal="true"
                aria-label={`${title} Fullscreen Gallery`}
              >
                {/* Modal Container Card */}
                <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#0B0F19] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
                  {/* Top Close Button (✕) */}
                  <button
                    type="button"
                    onClick={() => setIsZoomOpen(false)}
                    className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>

                  {/* Left Thumbnail Strip */}
                  <div className="hidden lg:flex flex-col gap-3 w-28 p-4 bg-[#070A11] border-r border-white/10 overflow-y-auto scrollbar-none flex-shrink-0">
                    {displayImages.map((img, idx) => {
                      const isSelected = selectedImageIndex === idx;
                      return (
                        <button
                          key={`modal-thumb-${idx}`}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all flex-shrink-0 border-none outline-none focus:outline-none ${isSelected
                            ? "ring-2 ring-white/50 scale-95 opacity-100"
                            : "opacity-50 hover:opacity-100"
                            }`}
                        >
                          <Image src={img} alt={`Thumb ${idx + 1}`} fill sizes="80px" className="object-cover" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Center Main Showcase Area */}
                  <div className="relative flex-1 bg-[#070A11] flex items-center justify-center p-6 min-h-[350px] sm:min-h-[500px]">
                    {/* Prev Button (‹) */}
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-4 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center text-xl transition-all backdrop-blur-md"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>

                    {/* Main Image */}
                    <div className="relative w-full h-full max-h-[72vh] aspect-square">
                      <Image
                        src={currentImage}
                        alt={title}
                        fill
                        sizes="(max-width: 1024px) 90vw, 72vh"
                        className="object-contain"
                      />
                    </div>

                    {/* Next Button (›) */}
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-4 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center text-xl transition-all backdrop-blur-md"
                      aria-label="Next image"
                    >
                      ›
                    </button>

                    {/* Counter Overlay (e.g. 1 / 4) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
                      {selectedImageIndex + 1} / {displayImages.length}
                    </div>
                  </div>

                  {/* Right Information & Action Controls Sidebar */}
                  <div className="w-full lg:w-80 bg-[#0B0F19] text-white p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          {title}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                          Eau de Parfum | 50ml
                        </p>
                      </div>

                      <p className="text-xs text-gray-300 font-sans leading-relaxed">
                        A bold and sophisticated fragrance crafted for those who lead with presence. Blending rare extracts with warm spices and amber.
                      </p>

                      <div className="w-full h-[1px] bg-white/10 my-2" />

                      {/* 4 Feature Control Actions */}
                      <div className="flex flex-col space-y-3.5 pt-1">
                        <div className="flex items-center gap-3 text-xs text-gray-300">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            🔍
                          </div>
                          <div>
                            <strong className="block text-white font-medium">Zoom In / Out</strong>
                            <span className="text-[10px] text-gray-400">Scroll to zoom</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-300">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            🔄
                          </div>
                          <div>
                            <strong className="block text-white font-medium">View Details</strong>
                            <span className="text-[10px] text-gray-400">See every detail up close</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-300">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            ⤢
                          </div>
                          <div>
                            <strong className="block text-white font-medium">Fullscreen</strong>
                            <span className="text-[10px] text-gray-400">Immersive view</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleDownloadImage}
                          className="flex items-center gap-3 text-xs text-gray-300 hover:text-white transition-colors group cursor-pointer text-left"
                        >
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/20">
                            📥
                          </div>
                          <div>
                            <strong className="block text-white font-medium">Download Image</strong>
                            <span className="text-[10px] text-gray-400">Save for reference</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Watermark Script */}
                    <div className="pt-6 border-t border-white/10 mt-6">
                      <span className="font-serif italic text-lg text-white/80 tracking-wide">
                        Details Define Luxury
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          );
};
