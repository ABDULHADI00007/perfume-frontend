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
    <section
      id="art-of-scent"
      className="w-full bg-white min-h-[100svh] md:min-h-0 flex flex-col justify-center md:block pt-8 sm:pt-12 md:pt-16 lg:pt-16 pb-10 sm:pb-16 md:pb-24 lg:pb-28 scroll-mt-28 overflow-hidden select-none"
    >
      <Container size="wide" className="my-auto md:my-0">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 md:gap-14 lg:gap-0 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {/* Left Column: Overlapping Composite Cards (Desktop Left, Mobile Below) */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex justify-center lg:justify-start pl-0 sm:pl-6 lg:pl-10 pr-20 min-[400px]:pr-24 min-[480px]:pr-28 sm:pr-36 md:pr-48 lg:pr-0 pt-4 sm:pt-6 lg:pt-0">
            <div className="relative w-[235px] min-[400px]:w-[255px] min-[480px]:w-[310px] sm:w-[380px] md:w-[440px] lg:w-[500px] h-[280px] min-[400px]:h-[305px] min-[480px]:h-[370px] sm:h-[450px] md:h-[520px] lg:h-[590px]">
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
                  sizes="(max-width: 768px) 300px, 500px"
                  priority
                />
              </motion.div>

              {/* Overlapping Flower Secondary Card */}
              <motion.div
                variants={fadeInUpImageSecondary}
                className="absolute bottom-[-6%] sm:bottom-[-4%] -right-20 min-[400px]:-right-24 min-[480px]:-right-28 sm:-right-36 md:-right-48 lg:-right-64 z-10 w-[135px] min-[400px]:w-[145px] min-[480px]:w-[180px] sm:w-[215px] md:w-[250px] lg:w-[280px] h-[168px] min-[400px]:h-[180px] min-[480px]:h-[225px] sm:h-[270px] md:h-[310px] lg:h-[350px] shadow-2xl overflow-hidden"
              >
                <Image
                  src="/images/perfumes/ea2ce943-14bd-4b9a-9621-5312369aa7a8.png"
                  alt="Botanical Flower Bloom"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                  sizes="(max-width: 768px) 170px, 280px"
                />
              </motion.div>
            </div>
          </div>

          {/* Right Column: Exact Reference Typography (Desktop Right, Mobile Above) */}
          <div className="order-1 lg:order-2 lg:col-span-7 space-y-4 sm:space-y-6 pt-0 sm:pt-0 lg:pt-0 -mt-1 lg:-mt-2 pl-2 sm:pl-4 lg:pl-2 lg:-ml-4 xl:-ml-6 z-20">
            <motion.h2
              variants={fadeInUpTitle}
              className="font-cinzel uppercase text-[44px] min-[390px]:text-[52px] min-[480px]:text-6xl sm:text-7xl md:text-8xl lg:text-[98px] xl:text-[110px] font-normal text-[#4A0A13] leading-[0.88] sm:leading-[0.84] tracking-[0.05em]"
              style={{ fontFamily: "'Cinzel', 'Marcellus', 'Italiana', serif" }}
            >
              <span className="block">THE ART</span>
              <span className="block pl-6 min-[390px]:pl-10 min-[480px]:pl-16 sm:pl-24 md:pl-32 lg:pl-36 font-normal -mt-1 sm:-mt-3 lg:-mt-5">
                OF SCENT
              </span>
            </motion.h2>

            <motion.div
              variants={fadeInUpText}
              className="pl-6 min-[390px]:pl-10 min-[480px]:pl-16 sm:pl-24 md:pl-32 lg:pl-36 pt-2 sm:pt-3 lg:pt-4"
            >
              <p className="text-sm min-[390px]:text-[15px] sm:text-base md:text-[17px] lg:text-[16px] xl:text-[17px] text-[#4A0A13]/85 font-sans leading-relaxed font-normal max-w-[470px] sm:max-w-[495px] md:max-w-[520px] ml-8 sm:ml-16 md:ml-20 lg:ml-32 xl:ml-36">
                Born where rare botanicals meet pure passion, this{" "}
                <br className="hidden min-[480px]:inline" />
                fragrance unfolds in layers of floral depth, warm{" "}
                <br className="hidden min-[480px]:inline" />
                woods, and lasting elegance.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

