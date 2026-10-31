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
        staggerChildren: 0.15,
        delayChildren: 0.05,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const cardVariant = (delay: number) => ({
    hidden: { opacity: 0, scale: 0.88, y: 24 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  });

  return (
    <section
      id="new-collection"
      className="w-full bg-white overflow-hidden select-none scroll-mt-28"
      style={{ paddingTop: "clamp(36px, 5vw, 68px)", paddingBottom: "clamp(36px, 5vw, 68px)" }}
    >
      <Container size="wide">
        <motion.div
          className="relative w-full flex flex-col items-center lg:block gap-8 sm:gap-12 lg:gap-0 lg:min-h-[clamp(360px,52vw,660px)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={containerVariants}
        >
          {/* ============ TYPOGRAPHY — left side on desktop, upper on mobile ============ */}
          <motion.div
            variants={fadeInUp}
            className="order-1 lg:order-none relative lg:absolute lg:left-0 z-10 w-full lg:w-[65%] lg:top-[clamp(30px,5vw,70px)] pl-2 sm:pl-6 lg:pl-0"
          >
            {/* ROW 1: NEW + Star Badge */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-[clamp(8px,1.5vw,20px)]">
              <h2
                className="uppercase text-[#590B16] leading-[0.88] tracking-[0.02em] font-serif text-[clamp(2.8rem,9vw,4.2rem)] sm:text-[clamp(3.6rem,8.5vw,5.5rem)] lg:text-[clamp(3.4rem,9.8vw,10rem)] font-bold"
                style={{
                  fontFamily: "'Cinzel', 'Marcellus', 'Italiana', serif",
                }}
              >
                NEW
              </h2>

              {/* Gold star circle badge */}
              <div
                className="rounded-full border-[1.5px] border-[#E2A84E] flex items-center justify-center bg-transparent shrink-0 transition-transform duration-500 hover:rotate-45 w-[34px] h-[34px] sm:w-[44px] sm:h-[44px] lg:w-[clamp(26px,3.8vw,54px)] lg:h-[clamp(26px,3.8vw,54px)]"
              >
                <svg
                  className="text-[#E2A84E] fill-current"
                  style={{ width: "52%", height: "52%" }}
                  viewBox="0 0 100 100"
                >
                  <path d="M50 0 C50 27.614 72.386 50 100 50 C72.386 50 50 72.386 50 100 C50 72.386 27.614 50 0 50 C27.614 50 50 27.614 50 0 Z" />
                </svg>
              </div>
            </div>

            {/* ROW 2: PERFUME — flush left with NEW and COLLECTION */}
            <h2
              className="uppercase text-[#590B16] leading-[0.88] tracking-[0.02em] font-serif text-[clamp(2.8rem,9vw,4.2rem)] sm:text-[clamp(3.6rem,8.5vw,5.5rem)] lg:text-[clamp(3.4rem,9.8vw,10rem)] font-bold mt-2 sm:mt-3 lg:mt-[clamp(10px,1.8vw,28px)] whitespace-nowrap"
              style={{
                fontFamily: "'Cinzel', 'Marcellus', 'Italiana', serif",
              }}
            >
              PERFUME
            </h2>

            {/* ROW 3: COLLECTION — flush left with NEW and PERFUME */}
            <h2
              className="uppercase text-[#590B16] leading-[0.88] tracking-[0.02em] font-serif text-[clamp(2.8rem,9vw,4.2rem)] sm:text-[clamp(3.6rem,8.5vw,5.5rem)] lg:text-[clamp(3.4rem,9.8vw,10rem)] font-bold mt-2 sm:mt-3 lg:mt-[clamp(10px,1.8vw,28px)] whitespace-nowrap"
              style={{
                fontFamily: "'Cinzel', 'Marcellus', 'Italiana', serif",
              }}
            >
              COLLECTION
            </h2>
          </motion.div>

          {/* ============ IMAGE COLLAGE — center-right on desktop, below on mobile ============ */}
          <motion.div
            variants={containerVariants}
            className="order-2 lg:order-none relative lg:absolute lg:top-0 lg:right-0 z-20 mx-auto lg:mx-0 w-[340px] min-[400px]:w-[370px] min-[480px]:w-[440px] sm:w-[540px] md:w-[620px] lg:w-[clamp(300px,58vw,700px)] h-[370px] min-[400px]:h-[400px] min-[480px]:h-[480px] sm:h-[580px] md:h-[660px] lg:h-[clamp(360px,52vw,660px)]"
          >
            {/* ── CARD 1: Top-left, Girl on green bg — tilted CCW ── */}
            <motion.div
              variants={cardVariant(0.08)}
              className="absolute overflow-hidden"
              style={{
                top: "0%",
                left: "14%",
                width: "50%",
                height: "60%",
                backgroundColor: "#93C591",
                transform: "rotate(-3.5deg)",
                zIndex: 22,
                borderRadius: "4px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              }}
            >
              <Image
                src="/images/editorial/new_collection_model_green.jpg"
                alt="Fragrance Model with Perfume Bottle"
                fill
                className="object-cover object-[50%_12%] transition-transform duration-700 ease-out hover:scale-105"
                sizes="(max-width: 768px) 50vw, 320px"
              />
            </motion.div>

            {/* ── CARD 2: Top-right, Tom Ford smoke bottle — tilted CW ── */}
            <motion.div
              variants={cardVariant(0.2)}
              className="absolute overflow-hidden"
              style={{
                top: "-4%",
                right: "5%",
                width: "36%",
                height: "50%",
                backgroundColor: "#FAF0D7",
                transform: "rotate(5deg)",
                zIndex: 21,
                borderRadius: "4px",
                boxShadow: "0 4px 22px rgba(0,0,0,0.18)",
              }}
            >
              <Image
                src="/images/perfumes/tom_ford_smoke.jpg"
                alt="Tom Ford Patchouli Absolu Perfume Bottle with Swirling Smoke"
                fill
                className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                sizes="(max-width: 768px) 45vw, 280px"
                priority
              />
            </motion.div>

            {/* ── CARD 3: Bottom-left, Tom Ford bottle — tilted CCW ── */}
            <motion.div
              variants={cardVariant(0.32)}
              className="absolute overflow-hidden"
              style={{
                bottom: "4%",
                left: "24%",
                width: "36%",
                height: "50%",
                backgroundColor: "#FAF0D7",
                transform: "rotate(-5deg)",
                zIndex: 24,
                borderRadius: "4px",
                boxShadow: "0 12px 40px rgba(0,0,0,0.28)",
              }}
            >
              <Image
                src="/images/perfumes/tom_ford_smoke.jpg"
                alt="Tom Ford Patchouli Absolu with Swirling Smoke"
                fill
                className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                sizes="(max-width: 768px) 40vw, 240px"
              />
            </motion.div>

            {/* ── CARD 4: Bottom-right, Girl model — tilted CW ── */}
            <motion.div
              variants={cardVariant(0.44)}
              className="absolute overflow-hidden"
              style={{
                bottom: "0%",
                right: "0%",
                width: "51%",
                height: "63%",
                backgroundColor: "#93C591",
                transform: "rotate(4.5deg)",
                zIndex: 23,
                borderRadius: "4px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
              }}
            >
              <Image
                src="/images/editorial/new_collection_model_green.jpg"
                alt="Fragrance Model with Perfume Bottle"
                fill
                className="object-cover object-[50%_20%] transition-transform duration-700 ease-out hover:scale-105"
                sizes="(max-width: 768px) 50vw, 320px"
              />
            </motion.div>

          </motion.div>

        </motion.div>
      </Container>
    </section>
  );
}
