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
      className="w-full bg-white overflow-hidden select-none"
      style={{ paddingTop: "clamp(36px, 5vw, 68px)", paddingBottom: "clamp(36px, 5vw, 68px)" }}
    >
      <Container size="wide">
        <motion.div
          className="relative w-full"
          style={{ minHeight: "clamp(360px, 52vw, 660px)" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={containerVariants}
        >
          {/* ============ TYPOGRAPHY — left side, sits behind collage ============ */}
          <motion.div
            variants={fadeInUp}
            className="absolute left-0 z-10"
            style={{ width: "60%", top: "clamp(40px, 7vw, 90px)" }}
          >
            {/* ROW 1: NEW + Star Badge */}
            <div className="flex items-center" style={{ gap: "clamp(6px, 1.2vw, 18px)", paddingLeft: "clamp(10px, 2.5vw, 40px)" }}>
              <h2
                className="uppercase text-[#90C293] leading-[0.88] tracking-tight"
                style={{
                  fontFamily: "'Hobo BT', 'Hobo', cursive, sans-serif",
                  fontSize: "clamp(3.4rem, 9.8vw, 10rem)",
                  fontWeight: 400,
                }}
              >
                NEW
              </h2>

              {/* Gold star circle badge */}
              <div
                className="rounded-full border-[1.5px] border-[#E2A84E] flex items-center justify-center bg-transparent shrink-0 transition-transform duration-500 hover:rotate-45"
                style={{
                  width: "clamp(26px, 3.8vw, 54px)",
                  height: "clamp(26px, 3.8vw, 54px)",
                }}
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

            {/* ROW 2: PERFUME — indented */}
            <h2
              className="uppercase text-[#90C293] leading-[0.88] tracking-tight"
              style={{
                fontFamily: "'Hobo BT', 'Hobo', cursive, sans-serif",
                fontSize: "clamp(3.4rem, 9.8vw, 10rem)",
                fontWeight: 400,
                paddingLeft: "clamp(24px, 4.5vw, 75px)",
                marginTop: "clamp(18px, 2.8vw, 48px)",
              }}
            >
              PERFUME
            </h2>

            {/* ROW 3: COLLECTION */}
            <h2
              className="uppercase text-[#90C293] leading-[0.88] tracking-tight"
              style={{
                fontFamily: "'Hobo BT', 'Hobo', cursive, sans-serif",
                fontSize: "clamp(3.4rem, 9.8vw, 10rem)",
                fontWeight: 400,
                marginTop: "clamp(18px, 2.8vw, 48px)",
              }}
            >
              COLLECTION
            </h2>
          </motion.div>

          {/* ============ IMAGE COLLAGE — overlapping from center-right into text ============ */}
          <motion.div
            variants={containerVariants}
            className="absolute top-0 right-0 z-20"
            style={{
              width: "clamp(300px, 58vw, 700px)",
              height: "clamp(360px, 52vw, 660px)",
            }}
          >
            {/* ── CARD 1: Top-left, Girl on green bg — tilted CCW ── */}
            <motion.div
              variants={cardVariant(0.08)}
              className="absolute overflow-hidden"
              style={{
                top: "4%",
                left: "7%",
                width: "53%",
                height: "54%",
                backgroundColor: "#93C591",
                transform: "rotate(-6deg)",
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
                width: "45%",
                height: "45%",
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
                bottom: "0%",
                left: "11%",
                width: "43%",
                height: "53%",
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
                sizes="(max-width: 768px) 45vw, 270px"
              />
            </motion.div>

            {/* ── CARD 4: Bottom-right, Girl model — tilted CW ── */}
            <motion.div
              variants={cardVariant(0.44)}
              className="absolute overflow-hidden"
              style={{
                bottom: "0%",
                right: "0%",
                width: "55%",
                height: "57%",
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
                sizes="(max-width: 768px) 55vw, 340px"
              />
            </motion.div>

          </motion.div>

        </motion.div>
      </Container>
    </section>
  );
}
