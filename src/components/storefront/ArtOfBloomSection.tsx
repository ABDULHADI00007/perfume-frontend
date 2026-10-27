"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";

export function ArtOfBloomSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const fadeInUpImageMain = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fadeInUpImageSecondary = {
    hidden: { opacity: 0, y: 100, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.0,
        delay: 0.15,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fadeInUpTitle = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fadeInUpText = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.25,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="w-full bg-white pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-24 lg:pb-28 overflow-hidden select-none">
      <Container size="wide">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {/* Left Column: Overlapping Composite Cards */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start pl-2 sm:pl-6 lg:pl-10">
            <div className="relative w-[330px] sm:w-[440px] lg:w-[500px] h-[410px] sm:h-[520px] lg:h-[590px]">
              {/* Main Black Perfume Image - Takes full space */}
              <motion.div
                variants={fadeInUpImageMain}
                className="absolute inset-0 overflow-hidden shadow-2xl"
              >
                <Image
                  src="/images/perfumes/d7fc0e4f-03da-4f7b-a7fc-9bc1a3f3e83c.png"
                  alt="Noir Essence - Soulmate Scents"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                  sizes="(max-width: 768px) 330px, 500px"
                  priority
                />
              </motion.div>

              {/* Overlapping Flower Secondary Card (Positioned further RIGHT and BOTTOM) */}
              <motion.div
                variants={fadeInUpImageSecondary}
                className="absolute bottom-[-4%] -right-36 sm:-right-56 lg:-right-64 z-10 w-[190px] sm:w-[250px] lg:w-[280px] h-[240px] sm:h-[310px] lg:h-[350px] shadow-2xl overflow-hidden"
              >
                <Image
                  src="/images/perfumes/ea2ce943-14bd-4b9a-9621-5312369aa7a8.png"
                  alt="Botanical Flower Bloom"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                  sizes="(max-width: 768px) 190px, 280px"
                />
              </motion.div>
            </div>
          </div>

          {/* Right Column: Exact Reference Typography */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 pt-0 sm:pt-0 lg:pt-0 -mt-1 lg:-mt-2 pl-2 sm:pl-4 lg:pl-2 lg:-ml-4 xl:-ml-6 z-20">
            <motion.h2
              variants={fadeInUpTitle}
              className="font-cinzel uppercase text-6xl sm:text-8xl lg:text-[98px] xl:text-[110px] font-normal text-[#4A0A13] leading-[0.84] tracking-[0.06em]"
              style={{ fontFamily: "'Cinzel', 'Marcellus', 'Italiana', serif" }}
            >
              <span className="block">THE ART</span>
              <span className="block pl-14 sm:pl-28 lg:pl-36 font-normal -mt-1 sm:-mt-3 lg:-mt-5">
                OF SCENT
              </span>
            </motion.h2>

            <motion.div
              variants={fadeInUpText}
              className="pl-32 sm:pl-56 lg:pl-[270px] pt-1 sm:pt-2 lg:pt-3"
            >
              <p className="text-sm sm:text-base lg:text-[16px] xl:text-[17px] text-[#4A0A13]/85 font-sans leading-relaxed max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] font-normal">
                Born where rare botanicals meet pure passion, this fragrance unfolds in layers of floral depth, warm woods, and lasting elegance.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

