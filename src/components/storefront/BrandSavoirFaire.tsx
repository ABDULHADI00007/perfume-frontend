"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Icons } from "@/components/ui/icons";
import { defaultViewport } from "@/lib/motion";

// Custom animation variants for left text (sliding in from left)
const textContainerVariants: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const textItemVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Custom animation variants for right image (sliding in from right)
const imageVariants: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.95,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1,
    },
  },
};

export const BrandSavoirFaire: React.FC = () => {
  return (
    <section
      aria-label="Brand Philosophy and Savoir-Faire"
      className="w-full min-h-screen bg-[#FAF7F3] border-b border-[#E6E2EA] overflow-hidden cinematic-section-snap flex flex-col justify-center"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-screen">
        {/* Left Column (Text - Animated from Left) */}
        <motion.div
          className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center pl-6 sm:pl-12 lg:pl-16 xl:pl-24 pr-6 sm:pr-12 lg:pr-14 py-16 sm:py-24 lg:py-32 xl:py-36 text-left z-10"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={textContainerVariants}
        >
          {/* Eyebrow */}
          <motion.div variants={textItemVariants} className="flex flex-col space-y-1 mb-5">
            <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.3em] font-medium text-[#6B6F80] font-sans">
              A STORY IN EVERY SCENT
            </span>
            <div className="w-12 h-[1.5px] bg-[#C5A880]/80 mt-1.5" />
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            variants={textItemVariants}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-normal text-[#121735] leading-[1.08] tracking-[-0.015em] mb-6 sm:mb-8"
          >
            Crafted with Purpose
          </motion.h2>

          {/* Supporting Story */}
          <motion.p
            variants={textItemVariants}
            className="text-base sm:text-lg text-[#555968] font-sans font-light leading-relaxed mb-8 sm:mb-10 max-w-xl"
          >
            At Maison de Parfum, we believe fragrance is more than a scent — it&apos;s a story, a memory and a connection. Our creations are inspired by places, emotions and the moments that make life extraordinary.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={textItemVariants} className="mb-12 sm:mb-16">
            <Link
              href="/perfumes"
              className="inline-flex items-center justify-center px-9 py-4 bg-navy text-white hover:bg-[#1D267D] active:bg-[#080d38] text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 group shadow-sm hover:shadow-md"
            >
              <span>EXPLORE FRAGRANCES</span>
              <Icons.ArrowRight
                size={14}
                className="ml-2.5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          {/* Bottom 3 Mini Brand Values Strip */}
          <motion.div
            variants={textItemVariants}
            className="w-full grid grid-cols-3 divide-x divide-[#E6E2EA] pt-8 border-t border-[#E6E2EA]"
          >
            <div className="pr-4 text-left">
              <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.18em] font-semibold text-[#121735] leading-tight">
                EXCEPTIONAL INGREDIENTS
              </p>
            </div>
            <div className="px-4 text-left">
              <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.18em] font-semibold text-[#121735] leading-tight">
                TIMELESS CRAFTSMANSHIP
              </p>
            </div>
            <div className="pl-4 text-left">
              <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.18em] font-semibold text-[#121735] leading-tight">
                A MORE MEANINGFUL TOMORROW
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column (Image - flowers_img.png, Animated from Right) */}
        <motion.div
          className="lg:col-span-6 xl:col-span-7 relative w-full h-[550px] lg:h-full min-h-[550px] lg:min-h-screen overflow-hidden flex items-end justify-end"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={imageVariants}
        >
          <Image
            src="/images/perfumes/flowers_img.png"
            alt="Crafted with Purpose - Flower botanicals on stone steps"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-bottom lg:object-right-bottom transition-transform duration-1000 hover:scale-105"
            priority
          />

          {/* Top-Right Editorial Watermark */}
          <div className="absolute top-8 right-8 text-right select-none pointer-events-none z-10 flex flex-col items-end">
            <div className="text-right space-y-0.5">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.24em] font-sans font-medium text-[#121735]/70">
                BEAUTY
              </p>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.24em] font-sans font-medium text-[#121735]/70">
                LIVES IN
              </p>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.24em] font-sans font-medium text-[#121735]/70">
                THE DETAILS
              </p>
            </div>
            <div className="w-[1px] h-10 bg-[#121735]/40 mt-3 mr-1" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};






