"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";
import { staggerContainer, staggerItem } from "@/lib/motion";

interface HeroSlide {
  id: number;
  image: string;
  eyebrowLine1: string;
  eyebrowLine2: string;
  titleNormal: string;
  titleItalic: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  watermark: string[];
}

const slides: HeroSlide[] = [
  {
    id: 1,
    image: "/images/editorial/hero_img.png",
    eyebrowLine1: "TIMELESS SCENTS.",
    eyebrowLine2: "A MORE MEANINGFUL TOMORROW.",
    titleNormal: "More Than",
    titleItalic: "a Fragrance",
    description:
      "Crafted for those who seek depth, beauty and something real. Maison de Parfum brings timeless scents for a modern world.",
    ctaText: "EXPLORE PERFUMES",
    ctaHref: "/perfumes",
    watermark: ["SCENTS", "THAT", "STAY", "WITH YOU"],
  },
  {
    id: 2,
    image: "/images/editorial/hero_two.png",
    eyebrowLine1: "HAUTE PARFUMERIE.",
    eyebrowLine2: "ARTISANAL EXTRAITS.",
    titleNormal: "Sultan's",
    titleItalic: "Veil",
    description:
      "An enchanting symphony of rare botanicals, aged sandalwood, and precious amber resins crafted with uncompromising devotion.",
    ctaText: "DISCOVER COLLECTION",
    ctaHref: "/collections",
    watermark: ["RARE", "BOTANICALS", "AGED", "SANDALWOOD"],
  },
  {
    id: 3,
    image: "/images/editorial/hero_three.png",
    eyebrowLine1: "OLFACTORY ARTISTRY.",
    eyebrowLine2: "CRAFTED IN GRASSE.",
    titleNormal: "Essence of",
    titleItalic: "Elegance",
    description:
      "Immerse yourself in our private reserve extraits, composed with absolute precision and rare ingredients.",
    ctaText: "VIEW FRAGRANCES",
    ctaHref: "/perfumes",
    watermark: ["CRAFTED", "WITH", "PURE", "DEVOTION"],
  },
];

export const Hero: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const goToNextSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goToNextSlide();
    }, 5000); // Auto change slide every 5 seconds

    return () => clearInterval(timer);
  }, [goToNextSlide]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <section
      aria-label="Hero Introduction"
      className="relative w-full min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-60px)] lg:min-h-[calc(100vh-64px)] h-[calc(100vh-56px)] sm:h-[calc(100vh-60px)] lg:h-[calc(100vh-64px)] overflow-hidden border-b border-[#E6E2EA]/60 flex items-center py-12 sm:py-16 lg:py-20 bg-[#8B7D6B] cinematic-section-snap"
    >
      {/* Full-Width Edge-to-Edge Animated Background Images */}
      <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentSlide.image}
              alt={currentSlide.titleNormal + " " + currentSlide.titleItalic}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center lg:object-right-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Soft, natural diffusion gradient on the left so typography is razor sharp without creating a harsh white block */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FBF9F5]/85 via-[#FBF9F5]/45 to-transparent w-full sm:w-4/5 lg:w-[58%] pointer-events-none z-[1]" />

        {/* Subtle top vignette for header legibility */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#FBF9F5]/40 via-[#FBF9F5]/10 to-transparent pointer-events-none z-[1]" />
      </div>

      <Container size="wide" className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Typography */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              className="lg:col-span-7 xl:col-span-6 flex flex-col items-start text-left"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerContainer}
            >
              {/* Eyebrow */}
              <motion.div
                variants={staggerItem}
                className="flex flex-col space-y-0.5 mb-3 text-left"
              >
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-medium text-[#4A4E5E] font-sans">
                  {currentSlide.eyebrowLine1}
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-medium text-[#4A4E5E] font-sans">
                  {currentSlide.eyebrowLine2}
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={staggerItem}
                className="font-serif text-4xl sm:text-5xl lg:text-[3.8rem] xl:text-[4.2rem] text-[#0B1938] leading-[0.98] tracking-[-0.02em] mb-4 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
              >
                <span className="block font-normal">{currentSlide.titleNormal}</span>
                <span className="block italic font-normal text-[#0B1938]">
                  {currentSlide.titleItalic}
                </span>
              </motion.h1>

              {/* Thin Champagne Separator Line */}
              <motion.div
                variants={staggerItem}
                className="w-14 h-[1.5px] bg-[#C5A880] mb-4"
              />

              {/* Supporting Narrative */}
              <motion.p
                variants={staggerItem}
                className="text-sm sm:text-base text-[#3E4254] max-w-md font-sans font-normal leading-relaxed mb-6 sm:mb-7 drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]"
              >
                {currentSlide.description}
              </motion.p>

              {/* Primary CTA */}
              <motion.div variants={staggerItem}>
                <Link
                  href={currentSlide.ctaHref}
                  className="inline-flex items-center justify-center px-8 sm:px-9 py-3.5 rounded-none bg-[#0B1938] hover:bg-[#172552] active:bg-[#060D24] text-white text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 shadow-md hover:shadow-lg group"
                >
                  <span>{currentSlide.ctaText}</span>
                  <Icons.ArrowRight
                    size={14}
                    className="ml-2.5 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Spacer for 12-col grid balance on desktop */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 pointer-events-none" />
        </div>
      </Container>

      {/* Right Side Vertical Editorial Watermark on Desktop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="hidden xl:flex absolute right-12 top-28 flex-col items-start pointer-events-none select-none z-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
        >
          <div className="w-[1px] h-12 bg-white/90 mb-3" />
          <div className="text-[9.5px] uppercase tracking-[0.26em] text-white font-sans font-semibold space-y-1">
            {currentSlide.watermark.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Right Interactive Pagination Indicator */}
      <div className="flex absolute right-6 sm:right-12 bottom-6 z-20 items-center space-x-3 text-[11px] font-sans tracking-[0.2em] uppercase text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <React.Fragment key={slide.id}>
              {idx > 0 && <span className="text-white/50 select-none">—</span>}
              <button
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Go to slide 0${slide.id}`}
                className={`transition-all duration-300 cursor-pointer ${isActive
                  ? "text-white font-semibold border-b-2 border-white pb-0.5 scale-110"
                  : "text-white/70 hover:text-white pb-0.5"
                  }`}
              >
                0{slide.id}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};
