"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

export function NewCollectionSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-24 overflow-hidden select-none">
      <Container size="wide">
        <motion.div
          className="relative w-full flex flex-col lg:flex-row items-center justify-between min-h-[540px] lg:min-h-[620px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          {/* ==================== LEFT: TYPOGRAPHY ==================== */}
          <motion.div
            variants={fadeInUp}
            className="w-full lg:w-[50%] flex flex-col justify-center text-left z-10 space-y-0 pr-0"
          >
            {/* ROW 1: NEW + STAR BADGE */}
            <div className="flex items-center gap-4 sm:gap-6">
              <h2
                className="uppercase text-[#4A0A13] font-black leading-[0.82] tracking-tighter"
                style={{
                  fontFamily: "'Unbounded', 'Syne', 'Outfit', sans-serif",
                  fontSize: "clamp(4.2rem, 10vw, 9.5rem)",
                  fontWeight: 900,
                }}
              >
                NEW
              </h2>

              {/* Gold Sparkle Star Outline Badge */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full border border-[#E5B567] flex items-center justify-center bg-transparent shrink-0">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-[#E5B567] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>
            </div>

            {/* ROW 2: PERFUME */}
            <h2
              className="uppercase text-[#4A0A13] font-black leading-[0.82] tracking-tighter"
              style={{
                fontFamily: "'Unbounded', 'Syne', 'Outfit', sans-serif",
                fontSize: "clamp(4.2rem, 10vw, 9.5rem)",
                fontWeight: 900,
              }}
            >
              PERFUME
            </h2>

            {/* ROW 3: COLLECTION */}
            <h2
              className="uppercase text-[#4A0A13] font-black leading-[0.82] tracking-tighter whitespace-nowrap"
              style={{
                fontFamily: "'Unbounded', 'Syne', 'Outfit', sans-serif",
                fontSize: "clamp(4.2rem, 10vw, 9.5rem)",
                fontWeight: 900,
              }}
            >
              COLLECTION
            </h2>
          </motion.div>

          {/* ==================== RIGHT: 4-CARD COLLAGE WITH EXACT OVERLAPS ==================== */}
          <motion.div
            variants={fadeInUp}
            className="w-full lg:w-[58%] relative flex justify-center lg:justify-end mt-10 lg:mt-0 lg:-ml-24 z-20"
          >
            {/* Collage Container Box */}
            <div className="relative w-full max-w-[520px] sm:max-w-[600px] lg:max-w-[660px] h-[480px] sm:h-[560px] lg:h-[640px]">

              {/* 1. TOP-RIGHT: TOM FORD SMOKE BOTTLE CARD (Z-10 - Behind Top-Left Girl) */}
              <div className="absolute top-0 right-[4%] w-[38%] h-[48%] bg-[#FAF8F5] overflow-hidden shadow-sm z-10 group border border-gray-100/50">
                <Image
                  src="/images/perfumes/tom_ford_smoke.jpg"
                  alt="Tom Ford Patchouli Absolu Perfume Bottle with Swirling Smoke"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 40vw, 260px"
                  priority
                />
              </div>

              {/* 2. TOP-LEFT: GIRL MODEL GREEN CARD (Z-20 - Overlaps Top-Right Card & Text) */}
              <div className="absolute top-[6%] left-0 w-[48%] h-[54%] bg-[#93C591] overflow-hidden shadow-md z-20 group">
                <Image
                  src="/images/editorial/new_collection_model_green.jpg"
                  alt="Fragrance Model with Perfume Bottle"
                  fill
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 320px"
                />
              </div>

              {/* 3. BOTTOM-LEFT / CENTER: TOM FORD SMOKE BOTTLE CARD (Z-30 - Overlaps Top-Left Girl) */}
              <div className="absolute top-[44%] left-[10%] w-[40%] h-[49%] bg-[#EBE0C0] overflow-hidden shadow-2xl z-30 group">
                <Image
                  src="/images/perfumes/tom_ford_smoke.jpg"
                  alt="Tom Ford Patchouli Absolu with Swirling Smoke"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 40vw, 250px"
                />
              </div>

              {/* 4. BOTTOM-RIGHT: GIRL MODEL GREEN CARD (Z-40 - Overlaps Bottom-Left Tom Ford Card) */}
              <div className="absolute top-[38%] right-0 w-[50%] h-[56%] bg-[#93C591] overflow-hidden shadow-xl z-40 group">
                <Image
                  src="/images/editorial/new_collection_model_green.jpg"
                  alt="Fragrance Model with Perfume Bottle"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 320px"
                />
              </div>

            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
