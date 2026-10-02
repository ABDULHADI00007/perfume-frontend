"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

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
    <section className="w-full bg-white py-4 sm:py-6 lg:py-8 overflow-hidden select-none">
      <Container size="wide">
        {/* Main 3x2 Grid Container */}
        <div className="w-full overflow-visible">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
          >

            {/* ==================== ROW 1 ==================== */}

            {/* BOX 1 (Top Left): Soulmate Scents Blue Leaf Image */}
            <motion.div
              variants={fadeInUpBox}
              className="relative h-[220px] sm:h-[270px] md:h-[290px] lg:h-[320px] xl:h-[340px] w-full overflow-hidden group bg-[#0F2213]"
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

            {/* BOX 2 (Top Middle): PERFUME SOULMATE SCENTS Typography & Rotating Badge */}
            <motion.div
              variants={fadeInUpBox}
              className="relative h-[220px] sm:h-[270px] md:h-[290px] lg:h-[320px] xl:h-[340px] w-full bg-white flex flex-col items-center justify-center p-2 sm:p-3 z-20 overflow-visible"
            >
              {/* Top Rotating Circular Badge */}
              <div className="absolute top-1 sm:top-2.5 z-30 flex items-center justify-center">
                <div className="relative w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full animate-[spin_22s_linear_infinite]"
                  >
                    <path
                      id="badgeCirclePath"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      fill="none"
                    />
                    <text className="fill-[#4A0A13] text-[9.2px] font-extrabold tracking-[0.22em] uppercase font-['Barlow_Condensed']">
                      <textPath href="#badgeCirclePath" startOffset="0%">
                        SOULMATE SCENTS • EXPLORE MORE •
                      </textPath>
                    </text>
                  </svg>
                  {/* Center Badge Dot */}
                  <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-[#4A0A13]" />
                </div>
              </div>

              {/* Middle Typography: PERFUME SOULMATE SCENTS (Overlapping Side Images) */}
              <div className="flex flex-col items-center justify-center text-center mt-5 sm:mt-7 lg:mt-8 w-full z-30">
                <span
                  className="text-[#4A0A13] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold uppercase leading-none tracking-[0.18em] mb-1"
                  style={{ fontFamily: "'Barlow Condensed', 'Outfit', sans-serif" }}
                >
                  PERFUME
                </span>
                <h2
                  className="text-[#4A0A13] text-4xl sm:text-5xl md:text-6xl lg:text-[85px] xl:text-[102px] font-black uppercase leading-[0.84] tracking-[0.06em] relative text-center pointer-events-none -mx-16 md:-mx-28 lg:-mx-44 whitespace-nowrap drop-shadow-sm"
                  style={{ fontFamily: "'Barlow Condensed', 'Outfit', sans-serif" }}
                >
                  SOULMATE SCENTS
                </h2>
              </div>
            </motion.div>

            {/* BOX 3 (Top Right): Soulmate Scents Velvet Aura Dark Flower Image */}
            <motion.div
              variants={fadeInUpBox}
              className="relative h-[220px] sm:h-[270px] md:h-[290px] lg:h-[320px] xl:h-[340px] w-full overflow-hidden group bg-[#0A0A0A]"
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

            {/* BOX 4 (Bottom Left): BEST-SELING MUST - HAVES */}
            <motion.div
              variants={fadeInUpBox}
              className="relative h-[220px] sm:h-[270px] md:h-[290px] lg:h-[320px] xl:h-[340px] w-full bg-white p-4 sm:p-6 lg:p-7 flex flex-col justify-center items-start z-10 border-t border-gray-200/50 md:border-t-0"
            >
              <h3
                className="text-[#4A0A13] text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-black uppercase leading-[0.92] tracking-[0.04em] mb-2 sm:mb-3"
                style={{ fontFamily: "'Barlow Condensed', 'Oswald', sans-serif" }}
              >
                BEST-SELING
                <br />
                MUST - HAVES
              </h3>

              <p className="text-[#5A605A] text-[11px] sm:text-xs lg:text-[13px] leading-relaxed font-sans max-w-[290px] mb-3 font-normal">
                These fragrances evoke the rich scents of the natural world, from
                the carthy and aroma of ancient forests to the warmth of sunlit
                woods. Each composition.
              </p>

              {/* Burgundy Accent Line */}
              <div className="w-10 h-[2.5px] bg-[#4A0A13] mb-3 rounded-full" />

              {/* CTA Sub-header */}
              <span
                className="text-[#4A0A13] text-xs sm:text-sm lg:text-base font-extrabold uppercase tracking-[0.1em] mb-2"
                style={{ fontFamily: "'Barlow Condensed', 'Oswald', sans-serif" }}
              >
                SEE NEW ARRIVALS
              </span>

              {/* Arrow Button & Circle Outline */}
              <div className="flex items-center gap-2.5">
                <Link
                  href="/shop"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#4A0A13] text-white flex items-center justify-center shadow-md hover:bg-[#38060D] hover:scale-110 transition-all duration-300"
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

                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-dashed border-[#4A0A13]/70" />
              </div>
            </motion.div>

            {/* BOX 5 (Bottom Middle): D'ORSAY Male Model Image */}
            <motion.div
              variants={fadeInUpBox}
              className="relative h-[220px] sm:h-[270px] md:h-[290px] lg:h-[320px] xl:h-[340px] w-full overflow-hidden group bg-[#26312B]"
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
              className="relative h-[220px] sm:h-[270px] md:h-[290px] lg:h-[320px] xl:h-[340px] w-full bg-white p-3 sm:p-4 lg:p-5 flex flex-col justify-between z-10 border-t border-gray-200/50 md:border-t-0"
            >
              {/* Top Side-by-Side Pill Arches */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-0.5">

                {/* Arch 1 (Left): Transparent Soulmate Scents Bottle */}
                <div className="relative pt-6 pb-1.5 px-1.5 border border-[#4A0A13]/40 rounded-t-full bg-transparent flex flex-col items-center justify-end h-[125px] sm:h-[150px] lg:h-[170px] overflow-hidden hover:border-[#4A0A13] transition-colors">
                  {/* SVG Curved Text along top arch */}
                  <svg
                    className="absolute top-1 left-0 w-full h-12 pointer-events-none"
                    viewBox="0 0 120 60"
                  >
                    <path
                      id="arch1TextCurve"
                      d="M 12 48 A 48 48 0 0 1 108 48"
                      fill="none"
                    />
                    <text className="fill-[#4A0A13] text-[7.2px] font-extrabold tracking-[0.08em] uppercase font-['Barlow_Condensed']">
                      <textPath
                        href="#arch1TextCurve"
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        SOULMATE SCENTS FRAGRANCE • SOULMATE
                      </textPath>
                    </text>
                  </svg>
                  {/* Bottle Image */}
                  <div className="relative w-full h-[75px] sm:h-[95px] lg:h-[110px] flex items-center justify-center">
                    <Image
                      src="/images/perfumes/elite_fusion_nobg.png"
                      alt="Soulmate Scents Elite Fusion"
                      width={90}
                      height={120}
                      className="object-contain max-h-full drop-shadow-md transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Arch 2 (Right): Transparent Soulmate Scents Bottle */}
                <div className="relative pt-6 pb-1.5 px-1.5 border border-[#4A0A13]/40 rounded-t-full bg-transparent flex flex-col items-center justify-end h-[125px] sm:h-[150px] lg:h-[170px] overflow-hidden hover:border-[#4A0A13] transition-colors">
                  {/* SVG Curved Text along top arch */}
                  <svg
                    className="absolute top-1 left-0 w-full h-12 pointer-events-none"
                    viewBox="0 0 120 60"
                  >
                    <path
                      id="arch2TextCurve"
                      d="M 10 48 A 50 50 0 0 1 110 50"
                      fill="none"
                    />
                    <text className="fill-[#4A0A13] text-[6.5px] font-extrabold tracking-[0.06em] uppercase font-['Barlow_Condensed']">
                      <textPath
                        href="#arch2TextCurve"
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        THAT WILL CREATE A UNIQUE SCENT EXPERIENCE
                      </textPath>
                    </text>
                  </svg>
                  {/* Bottle Image */}
                  <div className="relative w-full h-[75px] sm:h-[95px] lg:h-[110px] flex items-center justify-center">
                    <Image
                      src="/images/perfumes/vivid_desire_nobg.png"
                      alt="Soulmate Scents Vivid Desire"
                      width={90}
                      height={120}
                      className="object-contain max-h-full drop-shadow-md transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>

              </div>

              {/* Bottom Text Description */}
              <p className="text-[#5A605A] text-[11px] sm:text-xs leading-relaxed font-sans mt-1.5 font-normal">
                These fragrances evoke the rich scents of the natural world, from
                the earthy and aroma of ancient
              </p>
            </motion.div>

          </motion.div>
        </div>
      </Container>
    </section>
  );
}
