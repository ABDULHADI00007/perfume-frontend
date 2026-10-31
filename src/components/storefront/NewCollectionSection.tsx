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
      className="w-full bg-[#FAF7EE] overflow-hidden select-none scroll-mt-28 min-h-[100svh] md:min-h-0 flex flex-col justify-start md:block pt-6 sm:pt-8 md:pt-14 lg:pt-[clamp(36px,5vw,68px)] pb-8 sm:pb-10 md:pb-24 lg:pb-[clamp(36px,5vw,68px)]"
    >
      <Container size="wide" className="mt-3 mb-auto sm:my-auto md:my-0">
        <motion.div
          className="relative w-full flex flex-col items-center lg:block gap-5 sm:gap-7 md:gap-10 lg:gap-0 lg:min-h-[clamp(360px,52vw,660px)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={containerVariants}
        >
          {/* ============ TYPOGRAPHY — left side on desktop, upper on mobile ============ */}
          <motion.div
            variants={fadeInUp}
            className="order-1 lg:order-none relative lg:absolute lg:left-0 z-10 w-full lg:w-[65%] lg:top-[clamp(30px,5vw,70px)] px-2 sm:px-4 mt-1 sm:mt-0 md:pl-2 md:pr-4 md:-translate-x-8 lg:translate-x-0 lg:px-0"
          >
            {/* ROW 1: NEW + Star Badge — aligned with COLLECTION */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-[clamp(8px,1.5vw,20px)] pl-0 sm:pl-1 md:pl-3 lg:pl-[clamp(30px,4.5vw,75px)]">
              <h2
                className="uppercase text-[#590B16] leading-[0.88] tracking-[0.02em] font-serif text-[clamp(4.2rem,16vw,6.2rem)] sm:text-[clamp(4.5rem,14.5vw,6.5rem)] md:text-[clamp(4.2rem,10.5vw,6.8rem)] lg:text-[clamp(3.4rem,9.8vw,10rem)] font-bold whitespace-nowrap"
                style={{
                  fontFamily: "'Cinzel', 'Marcellus', 'Italiana', serif",
                }}
              >
                NEW
              </h2>

              {/* Gold star circle badge — enlarged on desktop, refined on mobile, bold on tablet */}
              <div
                className="rounded-full border-[1.5px] md:border-2 lg:border-[2.5px] border-[#E2A84E] flex items-center justify-center bg-transparent shrink-0 transition-transform duration-500 hover:rotate-45 w-[58px] h-[58px] sm:w-[62px] sm:h-[62px] md:w-[60px] md:h-[60px] lg:w-[clamp(50px,6.5vw,96px)] lg:h-[clamp(50px,6.5vw,96px)] ml-3 sm:ml-4 md:ml-8 lg:ml-[clamp(48px,7.5vw,125px)]"
              >
                <svg
                  className="text-[#E2A84E] fill-current"
                  style={{ width: "58%", height: "58%" }}
                  viewBox="0 0 100 100"
                >
                  <path d="M50 0 C50 27.614 72.386 50 100 50 C72.386 50 50 72.386 50 100 C50 72.386 27.614 50 0 50 C27.614 50 50 27.614 50 0 Z" />
                </svg>
              </div>
            </div>

            {/* ROW 2: PERFUME — desktop indent preserved, tablet prominent */}
            <h2
              className="uppercase text-[#590B16] leading-[0.88] tracking-[0.02em] font-serif text-[clamp(4.2rem,16vw,6.2rem)] sm:text-[clamp(4.5rem,14.5vw,6.5rem)] md:text-[clamp(4.2rem,10.5vw,6.8rem)] lg:text-[clamp(3.4rem,9.8vw,10rem)] font-bold pl-3 sm:pl-5 md:pl-12 lg:pl-[clamp(180px,21.5vw,320px)] mt-2 min-[360px]:mt-2.5 sm:mt-3 md:mt-4 lg:mt-[clamp(24px,3.5vw,52px)] whitespace-nowrap"
              style={{
                fontFamily: "'Cinzel', 'Marcellus', 'Italiana', serif",
              }}
            >
              PERFUME
            </h2>

            {/* ROW 3: COLLECTION — desktop indent & margin preserved, tablet prominent */}
            <h2
              className="uppercase text-[#590B16] leading-[0.88] tracking-[0.02em] font-serif text-[clamp(4.2rem,16vw,6.2rem)] sm:text-[clamp(4.5rem,14.5vw,6.5rem)] md:text-[clamp(4.2rem,10.5vw,6.8rem)] lg:text-[clamp(3.4rem,9.8vw,10rem)] font-bold pl-0 sm:pl-1 md:pl-3 lg:pl-[clamp(30px,4.5vw,75px)] mt-2 min-[360px]:mt-2.5 sm:mt-3 md:mt-4 lg:mt-[clamp(36px,4.8vw,75px)] whitespace-nowrap"
              style={{
                fontFamily: "'Cinzel', 'Marcellus', 'Italiana', serif",
              }}
            >
              COLLECTION
            </h2>
          </motion.div>

          {/* ============ IMAGE COLLAGE — center-right on desktop, scaled for mobile/tablet ============ */}
          <motion.div
            variants={containerVariants}
            className="order-2 lg:order-none relative lg:absolute lg:top-0 lg:right-0 z-20 mx-auto mt-8 min-[360px]:mt-10 sm:mt-8 md:mt-0 -translate-x-16 min-[360px]:-translate-x-20 min-[390px]:-translate-x-24 sm:-translate-x-16 md:translate-x-12 lg:translate-x-0 lg:mx-0 w-[370px] min-[360px]:w-[395px] min-[390px]:w-[425px] min-[420px]:w-[445px] min-[480px]:w-[475px] sm:w-[520px] md:w-[560px] lg:w-[clamp(300px,58vw,700px)] h-[370px] min-[360px]:h-[395px] min-[390px]:h-[425px] min-[420px]:h-[445px] min-[480px]:h-[475px] sm:h-[520px] md:h-[560px] lg:h-[clamp(360px,52vw,660px)]"
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
                right: "6%",
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
