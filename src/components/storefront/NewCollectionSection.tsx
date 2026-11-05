"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/layout/Container";

export function NewCollectionSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, amount: 0.25 });

  const [isDesktop, setIsDesktop] = React.useState(true);
  React.useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Refined luxury ease curve
  const luxuryEase = [0.19, 1, 0.22, 1] as const;

  return (
    <section
      id="new-collection"
      className="w-full bg-[#FAF7EE] overflow-hidden select-none scroll-mt-28 min-h-[100svh] md:min-h-0 flex flex-col justify-start md:block pt-6 sm:pt-8 md:pt-14 lg:pt-[clamp(36px,5vw,68px)] pb-8 sm:pb-10 md:pb-24 lg:pb-[clamp(36px,5vw,68px)]"
    >
      <Container size="wide" className="mt-3 mb-auto sm:my-auto md:my-0">
        <div
          ref={contentRef}
          className="relative w-full flex flex-col items-center lg:block gap-5 sm:gap-7 md:gap-10 lg:gap-0 lg:min-h-[clamp(360px,52vw,660px)]"
        >
          {/* ============ TYPOGRAPHY — left side on desktop, upper on mobile ============ */}
          <div className="order-1 lg:order-none relative lg:absolute lg:left-0 z-10 w-full lg:w-[65%] lg:top-[clamp(30px,5vw,70px)] px-2 sm:px-4 mt-5 min-[360px]:mt-7 sm:mt-4 md:mt-0 md:pl-2 md:pr-4 md:-translate-x-8 lg:translate-x-0 lg:px-0">
            {/* ROW 1: NEW + Star Badge — Step 2 after pictures (slides in smoothly with soft blur) */}
            <motion.div
              initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{
                once: true,
                amount: 0.25,
                margin: isDesktop ? "0px 0px -100px 0px" : "0px 0px -40px 0px",
              }}
              transition={{
                duration: 1.05,
                delay: isDesktop ? 0.22 : 0.06,
                ease: luxuryEase,
              }}
              className="flex items-center gap-2 sm:gap-3 lg:gap-[clamp(8px,1.5vw,20px)] pl-0 sm:pl-1 md:pl-3 lg:pl-[clamp(30px,4.5vw,75px)]"
              style={{ willChange: "transform, opacity, filter" }}
            >
              <h2
                className="uppercase text-[#590B16] leading-[0.88] tracking-[0.02em] font-serif text-[clamp(4.8rem,18.5vw,7.2rem)] sm:text-[clamp(5.2rem,16.5vw,7.6rem)] md:text-[clamp(4.2rem,10.5vw,6.8rem)] lg:text-[clamp(3.4rem,9.8vw,10rem)] font-bold whitespace-nowrap"
                style={{
                  fontFamily: "'Cinzel', 'Marcellus', 'Italiana', serif",
                }}
              >
                NEW
              </h2>

              {/* Gold star circle badge — animated on mobile, tablet & desktop */}
              <motion.div
                initial={{ rotate: 0 }}
                whileInView={{ rotate: [0, 45, 45, 0] }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                  duration: 2.2,
                  ease: [0.22, 1, 0.36, 1],
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                whileHover={{ rotate: 45, scale: 1.05 }}
                whileTap={{ rotate: 45, scale: 0.95 }}
                className="rounded-full border-[1.5px] md:border-2 lg:border-[2.5px] border-[#E2A84E] flex items-center justify-center bg-transparent shrink-0 cursor-pointer w-[64px] h-[64px] min-[360px]:w-[70px] min-[360px]:h-[70px] sm:w-[72px] sm:h-[72px] md:w-[60px] md:h-[60px] lg:w-[clamp(50px,6.5vw,96px)] lg:h-[clamp(50px,6.5vw,96px)] ml-3 sm:ml-4 md:ml-8 lg:ml-[clamp(48px,7.5vw,125px)]"
              >
                <svg
                  className="text-[#E2A84E] fill-current"
                  style={{ width: "58%", height: "58%" }}
                  viewBox="0 0 100 100"
                >
                  <path d="M50 0 C50 27.614 72.386 50 100 50 C72.386 50 50 72.386 50 100 C50 72.386 27.614 50 0 50 C27.614 50 50 27.614 50 0 Z" />
                </svg>
              </motion.div>
            </motion.div>

            {/* ROW 2: PERFUME */}
            <motion.h2
              initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{
                once: true,
                amount: 0.25,
                margin: isDesktop ? "0px 0px -100px 0px" : "0px 0px -40px 0px",
              }}
              transition={{
                duration: 1.05,
                delay: isDesktop ? 0.34 : 0.18,
                ease: luxuryEase,
              }}
              className="uppercase text-[#590B16] leading-[0.88] tracking-[0.02em] font-serif text-[clamp(4.8rem,18.5vw,7.2rem)] sm:text-[clamp(5.2rem,16.5vw,7.6rem)] md:text-[clamp(4.2rem,10.5vw,6.8rem)] lg:text-[clamp(3.4rem,9.8vw,10rem)] font-bold pl-3 sm:pl-5 md:pl-12 lg:pl-[clamp(180px,21.5vw,320px)] mt-5 min-[360px]:mt-6 sm:mt-7 md:mt-4 lg:mt-[clamp(24px,3.5vw,52px)] whitespace-nowrap"
              style={{
                fontFamily: "'Cinzel', 'Marcellus', 'Italiana', serif",
                willChange: "transform, opacity, filter",
              }}
            >
              PERFUME
            </motion.h2>

            {/* ROW 3: COLLECTION */}
            <motion.h2
              initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{
                once: true,
                amount: 0.25,
                margin: isDesktop ? "0px 0px -100px 0px" : "0px 0px -40px 0px",
              }}
              transition={{
                duration: 1.05,
                delay: isDesktop ? 0.46 : 0.30,
                ease: luxuryEase,
              }}
              className="uppercase text-[#590B16] leading-[0.88] tracking-[0.02em] font-serif text-[clamp(4.8rem,18.5vw,7.2rem)] sm:text-[clamp(5.2rem,16.5vw,7.6rem)] md:text-[clamp(4.2rem,10.5vw,6.8rem)] lg:text-[clamp(3.4rem,9.8vw,10rem)] font-bold pl-0 sm:pl-1 md:pl-3 lg:pl-[clamp(30px,4.5vw,75px)] mt-5 min-[360px]:mt-6 sm:mt-7 md:mt-4 lg:mt-[clamp(36px,4.8vw,75px)] whitespace-nowrap"
              style={{
                fontFamily: "'Cinzel', 'Marcellus', 'Italiana', serif",
                willChange: "transform, opacity, filter",
              }}
            >
              COLLECTION
            </motion.h2>
          </div>

          {/* ============ IMAGE COLLAGE — Silky smooth staggered floating reveal ============ */}
          <div className="order-2 lg:order-none relative lg:absolute lg:top-0 lg:right-0 z-20 mx-auto mt-6 min-[360px]:mt-8 min-[390px]:mt-10 sm:mt-8 md:mt-0 -translate-x-24 min-[360px]:-translate-x-28 min-[390px]:-translate-x-32 sm:-translate-x-24 md:translate-x-12 lg:translate-x-0 lg:mx-0 w-[370px] min-[360px]:w-[400px] min-[400px]:w-[440px] min-[440px]:w-[470px] min-[480px]:w-[500px] sm:w-[530px] md:w-[560px] lg:w-[clamp(300px,58vw,700px)] h-[370px] min-[360px]:h-[400px] min-[400px]:h-[440px] min-[440px]:h-[470px] min-[480px]:h-[500px] sm:h-[530px] md:h-[560px] lg:h-[clamp(360px,52vw,660px)]">
            {/* ── CARD 1: Top-left, Whispers Bloom Model ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              viewport={{
                once: true,
                amount: 0.25,
                margin: isDesktop ? "0px 0px -100px 0px" : "0px 0px -40px 0px",
              }}
              transition={{
                duration: 1.15,
                delay: isDesktop ? 0.10 : 0.42,
                ease: luxuryEase,
              }}
              className="absolute overflow-hidden"
              style={{
                top: "2%",
                left: "14%",
                width: "50%",
                height: "58%",
                backgroundColor: "#EFE6D8",
                zIndex: 22,
                borderRadius: "4px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                willChange: "transform, opacity, filter",
              }}
            >
              <motion.div
                initial={{ scale: 1.06 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.35, ease: luxuryEase }}
                className="w-full h-full relative"
              >
                <Image
                  src="/images/editorial/whispers_bloom_model_editorial.jpg"
                  alt="Whispers Bloom Luxury Fragrance Model"
                  fill
                  className="object-cover object-[50%_15%] transition-transform duration-700 ease-out hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 320px"
                />
              </motion.div>
            </motion.div>

            {/* ── CARD 2: Top-right, Velvet Orchid smoke bottle ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              viewport={{
                once: true,
                amount: 0.25,
                margin: isDesktop ? "0px 0px -100px 0px" : "0px 0px -40px 0px",
              }}
              transition={{
                duration: 1.15,
                delay: isDesktop ? 0.22 : 0.54,
                ease: luxuryEase,
              }}
              className="absolute overflow-hidden"
              style={{
                top: "-2%",
                right: "8%",
                width: "36%",
                height: "46%",
                backgroundColor: "#FAF0D7",
                zIndex: 21,
                borderRadius: "4px",
                boxShadow: "0 4px 22px rgba(0,0,0,0.18)",
                willChange: "transform, opacity, filter",
              }}
            >
              <motion.div
                initial={{ scale: 1.06 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.35, ease: luxuryEase }}
                className="w-full h-full relative"
              >
                <Image
                  src="/images/perfumes/velvet_orchid_smoke.png"
                  alt="Velvet Orchid Perfume Bottle with Swirling Smoke"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                  sizes="(max-width: 768px) 45vw, 280px"
                />
              </motion.div>
            </motion.div>

            {/* ── CARD 3: Bottom-left, Velvet Orchid smoke bottle ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              viewport={{
                once: true,
                amount: 0.25,
                margin: isDesktop ? "0px 0px -100px 0px" : "0px 0px -40px 0px",
              }}
              transition={{
                duration: 1.15,
                delay: isDesktop ? 0.34 : 0.66,
                ease: luxuryEase,
              }}
              className="absolute overflow-hidden"
              style={{
                bottom: "6%",
                left: "24%",
                width: "36%",
                height: "46%",
                backgroundColor: "#FAF0D7",
                zIndex: 24,
                borderRadius: "4px",
                boxShadow: "0 12px 40px rgba(0,0,0,0.28)",
                willChange: "transform, opacity, filter",
              }}
            >
              <motion.div
                initial={{ scale: 1.06 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.35, ease: luxuryEase }}
                className="w-full h-full relative"
              >
                <Image
                  src="/images/perfumes/velvet_orchid_smoke.png"
                  alt="Velvet Orchid with Swirling Smoke"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                  sizes="(max-width: 768px) 40vw, 240px"
                />
              </motion.div>
            </motion.div>

            {/* ── CARD 4: Bottom-right, Whispers Bloom Model ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              viewport={{
                once: true,
                amount: 0.25,
                margin: isDesktop ? "0px 0px -100px 0px" : "0px 0px -40px 0px",
              }}
              transition={{
                duration: 1.15,
                delay: isDesktop ? 0.46 : 0.78,
                ease: luxuryEase,
              }}
              className="absolute overflow-hidden"
              style={{
                bottom: "2%",
                right: "2%",
                width: "50%",
                height: "58%",
                backgroundColor: "#EFE6D8",
                zIndex: 23,
                borderRadius: "4px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
                willChange: "transform, opacity, filter",
              }}
            >
              <motion.div
                initial={{ scale: 1.06 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.35, ease: luxuryEase }}
                className="w-full h-full relative"
              >
                <Image
                  src="/images/editorial/whispers_bloom_model_editorial.jpg"
                  alt="Whispers Bloom Luxury Fragrance Model"
                  fill
                  className="object-cover object-[50%_15%] transition-transform duration-700 ease-out hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 320px"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
