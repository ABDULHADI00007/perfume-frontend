"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

export const PrivateReserveDiscovery: React.FC = () => {
  return (
    <section
      aria-label="Private Reserve Collection"
      className="relative w-full overflow-hidden border-b border-[#E6E2EA] bg-[#121735] text-white min-h-screen flex items-center py-20 lg:py-28 cinematic-section-snap"
    >
      {/* High-Resolution Panoramic Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/editorial/private-reserve-coastal.jpg"
          alt="The Private Reserve collection flacon overlooking the Mediterranean coastline"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.01] transition-transform duration-1000"
        />
        {/* Cinematic Vignette Overlay to guarantee text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C134F]/85 via-[#0C134F]/60 to-black/20 sm:w-4/5 lg:w-3/5" />
      </div>

      <Container size="wide" className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Collection Editorial Typography */}
          <motion.div
            className="lg:col-span-7 xl:col-span-6 flex flex-col items-start text-left"
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainer}
          >
            {/* Eyebrow */}
            <motion.div variants={staggerItem} className="flex flex-col space-y-1 mb-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/70 font-sans">
                FEATURED COLLECTION
              </span>
              <div className="w-10 h-[1px] bg-[#C5A880] mt-1" />
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={staggerItem}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal text-white leading-tight tracking-[-0.01em] mb-5"
            >
              The Private Reserve
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={staggerItem}
              className="text-sm sm:text-base text-white/80 font-sans font-light leading-relaxed max-w-lg mb-8"
            >
              A curated selection of rare and refined scents, created for those who appreciate the extraordinary.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={staggerItem}>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#121735] hover:bg-[#FBF9F5] active:bg-[#EFECE6] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-md group"
              >
                <span>EXPLORE COLLECTION</span>
                <Icons.ArrowRight
                  size={14}
                  className="ml-2.5 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Editorial Watermark */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 justify-end items-center pr-4">
            <div className="text-right select-none pointer-events-none drop-shadow-md">
              <p className="text-[10px] uppercase tracking-[0.28em] font-sans font-medium text-white/80">
                RARE
              </p>
              <p className="text-[10px] uppercase tracking-[0.28em] font-sans font-medium text-white/80">
                REFINED
              </p>
              <p className="text-[10px] uppercase tracking-[0.28em] font-sans font-medium text-white/80">
                UNFORGETTABLE
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
