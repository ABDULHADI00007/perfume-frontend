"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function PerfumeJesminaSection() {
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

  const fadeInUpBox = {
    hidden: { opacity: 0, y: 60 },
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
    <section className="w-full bg-white py-2 sm:py-3 lg:py-5 overflow-hidden select-none">
      {/* Expanded grid container with reduced side padding */}
      <div className="w-full max-w-[1640px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 overflow-visible">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >

            {/* ==================== ROW 1 ==================== */}

            {/* BOX 1 (Top Left): Green foliage background & perfume */}
            <motion.div
              variants={fadeInUpBox}
              className="relative h-[240px] sm:h-[280px] md:h-[310px] lg:h-[345px] xl:h-[365px] w-full overflow-hidden group bg-[#0F2213]"
            >
              <Image
                src="/images/perfumes/7573c421-ba5f-4f34-9ec7-0fbb3f45fafc.png"
                alt="Soulmate Scents Bleu Intense"
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </motion.div>

            {/* BOX 2 (Top Middle): PERFUME JESMINA Typography & Rotating Badge */}
            <motion.div
              variants={fadeInUpBox}
              className="relative h-[240px] sm:h-[280px] md:h-[310px] lg:h-[345px] xl:h-[365px] w-full bg-white flex flex-col items-center justify-center p-2 sm:p-3 z-20 overflow-visible"
            >
              {/* Top Rotating Circular Badge - half peeking at top edge */}
              <div className="absolute -top-6 sm:-top-7 lg:-top-8 z-30 flex items-center justify-center pointer-events-none">
                <div className="relative w-13 h-13 sm:w-15 sm:h-15 lg:w-17 lg:h-17 rounded-full border-[1.5px] border-[#8AB892]/60 bg-white p-0.5 shadow-xs">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full animate-[spin_24s_linear_infinite]"
                  >
                    <path
                      id="badgeCirclePath"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      fill="none"
                    />
                    <text className="fill-[#8AB892] text-[9.5px] font-bold tracking-[0.22em] uppercase font-['Barlow_Condensed',sans-serif]">
                      <textPath href="#badgeCirclePath" startOffset="0%">
                        SOULMATE SCENTS • EXPLORE MORE •
                      </textPath>
                    </text>
                  </svg>
                  {/* Center Badge Dot */}
                  <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-[#8AB892]" />
                </div>
              </div>

              {/* Middle Typography: PERFUME JESMINA (Overlapping Side Images) */}
              <div className="flex flex-col items-center justify-center text-center w-full z-30 select-none">
                <span
                  className="text-[#8AB892] text-lg sm:text-xl md:text-2xl lg:text-[32px] xl:text-[36px] uppercase leading-none tracking-[0.14em] mb-1"
                  style={{ fontFamily: "'Hobo BT', 'Hobo', cursive, sans-serif", fontWeight: 400 }}
                >
                  PERFUME
                </span>
                <h2
                  className="text-[#8AB892] text-4xl sm:text-5xl md:text-6xl lg:text-[76px] xl:text-[88px] uppercase leading-[0.84] tracking-[0.02em] relative text-center pointer-events-none -mx-6 sm:-mx-12 md:-mx-16 lg:-mx-22 whitespace-nowrap drop-shadow-xs"
                  style={{ fontFamily: "'Hobo BT', 'Hobo', cursive, sans-serif", fontWeight: 400 }}
                >
                  JESMINA
                </h2>
              </div>
            </motion.div>

            {/* BOX 3 (Top Right): Soulmate Scents Dark Floral Image */}
            <motion.div
              variants={fadeInUpBox}
              className="relative h-[240px] sm:h-[280px] md:h-[310px] lg:h-[345px] xl:h-[365px] w-full overflow-hidden group bg-[#0A0A0A]"
            >
              <Image
                src="/images/perfumes/886ed8fc-573b-4202-900f-1c7b8a5818b4.png"
                alt="Soulmate Scents Velvet Aura"
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </motion.div>

            {/* ==================== ROW 2 ==================== */}

            {/* BOX 4 (Bottom Left): BEST-SELING MUST - HAVES - Exact match to reference screenshot */}
            <motion.div
              variants={fadeInUpBox}
              className="relative h-[240px] sm:h-[280px] md:h-[310px] lg:h-[345px] xl:h-[365px] w-full bg-white pt-2 sm:pt-3 lg:pt-4 xl:pt-5 pb-2 pl-0 pr-3 sm:pr-4 flex flex-col justify-start items-start z-10"
            >
              {/* Heading: BEST-SELING MUST - HAVES */}
              <h3
                className="text-[#1D201E] text-2xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-[38px] uppercase leading-[0.94] tracking-normal mb-2.5 sm:mb-3"
                style={{ fontFamily: "'Hobo BT', 'Hobo', cursive, sans-serif", fontWeight: 400 }}
              >
                BEST-SELING
                <br />
                MUST - HAVES
              </h3>

              {/* 5-Line Paragraph Description - Exact Line Breaks */}
              <p className="text-[#5C6460] text-[11px] sm:text-[12px] lg:text-[13px] xl:text-[13.5px] leading-[1.42] font-sans font-normal mb-2.5 sm:mb-3 max-w-[260px] sm:max-w-[285px]">
                These fragrances evoke the rich
                <br />
                scents of the natural world, from
                <br />
                the carthy and aroma of ancient
                <br />
                forests to the warmth of sunlit
                <br />
                woods. Each composition.
              </p>

              {/* Sage Green Accent Horizontal Line */}
              <div className="w-14 sm:w-16 h-[2px] bg-[#8AB892] mb-2.5 sm:mb-3 rounded-full" />

              {/* CTA Sub-header */}
              <span
                className="text-[#1D201E] text-xs sm:text-sm lg:text-[15px] xl:text-[16px] uppercase tracking-[0.06em] mb-2 sm:mb-2.5"
                style={{ fontFamily: "'Hobo BT', 'Hobo', cursive, sans-serif", fontWeight: 400 }}
              >
                SEE NEW ARRIVALS
              </span>

              {/* Arrow Button & Dashed Circle - Touching gap */}
              <div className="flex items-center gap-1.5">
                <Link
                  href="/shop"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8AB892] text-white flex items-center justify-center shadow-xs hover:bg-[#77A680] hover:scale-105 transition-all duration-300"
                  aria-label="See new arrivals"
                >
                  <svg
                    className="w-3.5 h-3.5 stroke-[2.5]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>

                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-[1.5px] border-dashed border-[#8AB892]" />
              </div>
            </motion.div>

            {/* BOX 5 (Bottom Middle): D'ORSAY Male Model Image */}
            <motion.div
              variants={fadeInUpBox}
              className="relative h-[240px] sm:h-[280px] md:h-[310px] lg:h-[345px] xl:h-[365px] w-full overflow-hidden group bg-[#26312B]"
            >
              <Image
                src="/images/perfumes/823fece4-72fb-4ee3-8398-8d1fa6be74f0.png"
                alt="D'ORSAY Fragrance Campaign"
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>

            {/* BOX 6 (Bottom Right): Two Arch Cards & Paragraph */}
            <motion.div
              variants={fadeInUpBox}
              className="relative h-[240px] sm:h-[280px] md:h-[310px] lg:h-[345px] xl:h-[365px] w-full bg-white p-3 sm:p-4 lg:p-5 flex flex-col justify-between z-10"
            >
              {/* Top Side-by-Side Pill Arches */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1 max-h-[220px] sm:max-h-[250px]">

                {/* Arch 1 (Left): Transparent Soulmate Scents Bottle */}
                <div className="relative flex flex-col items-center justify-between rounded-t-full rounded-b-2xl border-[1.5px] border-[#8AB892]/70 bg-gradient-to-b from-[#F2F8F3]/60 via-white to-white p-1.5 pb-2 overflow-hidden shadow-xs hover:border-[#8AB892] transition-colors group">
                  {/* SVG Curved Text along top arch */}
                  <div className="w-full pt-1 flex justify-center">
                    <svg
                      className="w-[94%] h-auto max-h-[38px] overflow-visible pointer-events-none"
                      viewBox="0 0 140 70"
                    >
                      <path
                        id="arch1TextCurve"
                        d="M 12 60 A 58 58 0 0 1 128 60"
                        fill="none"
                      />
                      <text className="fill-[#8AB892] text-[8.2px] font-bold tracking-[0.14em] uppercase font-['Barlow_Condensed',sans-serif]">
                        <textPath
                          href="#arch1TextCurve"
                          startOffset="50%"
                          textAnchor="middle"
                        >
                          MIHAK PERFUME FRAGRANCE • MIHAK PERFUME
                        </textPath>
                      </text>
                    </svg>
                  </div>

                  {/* Bottle Image */}
                  <div className="relative w-full flex-1 flex items-center justify-center p-1">
                    <Image
                      src="/images/perfumes/elite_fusion_nobg.png"
                      alt="Soulmate Scents Elite Fusion"
                      width={85}
                      height={115}
                      className="object-contain max-h-[82%] w-auto drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Arch 2 (Right): Transparent Soulmate Scents Bottle */}
                <div className="relative flex flex-col items-center justify-between rounded-t-full rounded-b-2xl border-[1.5px] border-[#8AB892]/70 bg-gradient-to-b from-[#F2F8F3]/60 via-white to-white p-1.5 pb-2 overflow-hidden shadow-xs hover:border-[#8AB892] transition-colors group">
                  {/* SVG Curved Text along top arch */}
                  <div className="w-full pt-1 flex justify-center">
                    <svg
                      className="w-[94%] h-auto max-h-[38px] overflow-visible pointer-events-none"
                      viewBox="0 0 140 70"
                    >
                      <path
                        id="arch2TextCurve"
                        d="M 12 60 A 58 58 0 0 1 128 60"
                        fill="none"
                      />
                      <text className="fill-[#8AB892] text-[7.5px] font-bold tracking-[0.1em] uppercase font-['Barlow_Condensed',sans-serif]">
                        <textPath
                          href="#arch2TextCurve"
                          startOffset="50%"
                          textAnchor="middle"
                        >
                          THAT WILL CREATE A UNIQUE SCENT EXPERIENCE
                        </textPath>
                      </text>
                    </svg>
                  </div>

                  {/* Bottle Image */}
                  <div className="relative w-full flex-1 flex items-center justify-center p-1">
                    <Image
                      src="/images/perfumes/vivid_desire_nobg.png"
                      alt="Soulmate Scents Vivid Desire"
                      width={85}
                      height={115}
                      className="object-contain max-h-[82%] w-auto drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>

              </div>

              {/* Bottom Text Description */}
              <p className="text-[#5A625D] text-[10px] sm:text-[11px] lg:text-[12px] leading-relaxed font-sans mt-2 font-normal">
                These fragrances evoke the rich scents of the natural world, from
                the earthy and aroma of ancient
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>
  );
}

