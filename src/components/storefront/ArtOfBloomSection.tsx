"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Container } from "@/components/layout/Container";

export function ArtOfBloomSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: "0px 0px -60px 0px" });

  const [isDesktop, setIsDesktop] = React.useState(true);
  React.useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smooth scroll-driven parallax for both layered photo cards
  // Opposing speeds create a tangible physical 3D depth between the perfume bottle & flower card
  const mainCardY = useTransform(scrollYProgress, [0, 1], [-18, 22]);
  const secondaryCardY = useTransform(scrollYProgress, [0, 1], [38, -42]);
  const secondaryCardRotate = useTransform(scrollYProgress, [0, 1], [1.8, -1.8]);

  return (
    <section
      ref={sectionRef}
      id="art-of-scent"
      className="w-full bg-white min-h-[100svh] md:min-h-0 flex flex-col justify-start md:block pt-8 sm:pt-10 md:pt-16 lg:pt-16 pb-6 sm:pb-10 md:pb-20 lg:pb-28 scroll-mt-28 overflow-hidden select-none"
    >
      <Container size="wide" className="mt-3 mb-auto sm:my-auto md:my-0">
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 md:gap-14 lg:gap-0 items-start">
          {/* Left Column: Overlapping Composite Cards (Desktop Left, Mobile & Tablet Below) */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex justify-center lg:justify-start pl-0 sm:pl-6 lg:pl-10 pr-14 min-[360px]:pr-16 min-[400px]:pr-20 min-[480px]:pr-28 sm:pr-36 md:pr-48 lg:pr-0 pt-11 min-[360px]:pt-14 sm:pt-6 lg:pt-0">
            <div className="relative w-[270px] min-[360px]:w-[290px] min-[400px]:w-[320px] min-[480px]:w-[360px] sm:w-[400px] md:w-[440px] lg:w-[500px] h-[320px] min-[360px]:h-[350px] min-[400px]:h-[380px] min-[480px]:h-[430px] sm:h-[480px] md:h-[520px] lg:h-[590px]">
              
              {/* 1. Main Black Perfume Image - 3rd in sequence on mobile, 4th on desktop */}
              <motion.div
                style={{ y: mainCardY }}
                className="absolute inset-0"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 42, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{
                    once: true,
                    amount: isDesktop ? 0.25 : 0.2,
                    margin: isDesktop ? "0px 0px -100px 0px" : "0px 0px -40px 0px",
                  }}
                  transition={{
                    duration: 1.15,
                    delay: isDesktop ? 0.54 : 0.52,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  className="w-full h-full overflow-hidden shadow-[0_20px_55px_rgba(0,0,0,0.32)] hover:shadow-[0_28px_65px_rgba(0,0,0,0.45)] transition-shadow duration-700 relative"
                  style={{ willChange: "transform, opacity, filter" }}
                >
                  <motion.div
                    initial={{ scale: 1.08 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.35,
                      delay: isDesktop ? 0.54 : 0.52,
                      ease: [0.19, 1, 0.22, 1],
                    }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src="/images/perfumes/sultans-veil-art-of-scent.jpg"
                      alt="Sultan's Veil - Soulmate Scents"
                      fill
                      className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                      sizes="(max-width: 768px) 360px, 500px"
                      priority
                    />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* 2. Overlapping Flower Secondary Card - 3rd on desktop (black flower pic), 4th on mobile */}
              <motion.div
                style={{ y: secondaryCardY, rotate: secondaryCardRotate }}
                className="absolute bottom-[-6%] sm:bottom-[-4%] -right-14 min-[360px]:-right-16 min-[400px]:-right-20 min-[480px]:-right-28 sm:-right-36 md:-right-48 lg:-right-64 z-10 w-[155px] min-[360px]:w-[170px] min-[400px]:w-[190px] min-[480px]:w-[210px] sm:w-[230px] md:w-[250px] lg:w-[280px] h-[195px] min-[360px]:h-[215px] min-[400px]:h-[240px] min-[480px]:h-[265px] sm:h-[290px] md:h-[310px] lg:h-[350px]"
              >
                {/* Entrance Reveal with Soft Blur Dissolve & Lift */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 35, x: 20, rotate: 3, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, scale: 1, y: 0, x: 0, rotate: 0, filter: "blur(0px)" }}
                  viewport={{
                    once: true,
                    amount: isDesktop ? 0.25 : 0.2,
                    margin: isDesktop ? "0px 0px -100px 0px" : "0px 0px -40px 0px",
                  }}
                  transition={{
                    duration: 1.05,
                    delay: isDesktop ? 0.38 : 0.68,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  className="w-full h-full"
                  style={{ willChange: "transform, opacity, filter" }}
                >
                  {/* Subtle Continuous Organic Floating / Breathing Animation */}
                  <motion.div
                    animate={{
                      y: [0, -7, 0],
                      rotate: [0, 0.7, 0],
                    }}
                    transition={{
                      duration: 5.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-full h-full shadow-[0_22px_45px_rgba(0,0,0,0.28)] hover:shadow-[0_28px_60px_rgba(0,0,0,0.4)] overflow-hidden relative transition-shadow duration-700"
                  >
                    <Image
                      src="/images/perfumes/ea2ce943-14bd-4b9a-9621-5312369aa7a8.png"
                      alt="Botanical Flower Bloom"
                      fill
                      className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                      sizes="(max-width: 768px) 210px, 280px"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>

            </div>
          </div>

          {/* Right Column: Exact Reference Typography (Desktop Right, Mobile & Tablet Above) */}
          <div className="order-1 lg:order-2 lg:col-span-7 space-y-3 sm:space-y-5 md:space-y-6 pt-0 sm:pt-0 lg:pt-0 mt-4 sm:mt-0 md:-mt-2 lg:-mt-2 pl-2 sm:pl-4 lg:pl-2 lg:-ml-4 xl:-ml-6 z-20">
            <h2
              className="font-cinzel uppercase text-[clamp(3.8rem,14.8vw,5.8rem)] min-[480px]:text-6xl sm:text-7xl md:text-8xl lg:text-[98px] xl:text-[110px] font-normal text-[#4A0A13] leading-[0.88] sm:leading-[0.84] tracking-[0.05em]"
              style={{ fontFamily: "'Cinzel', 'Marcellus', 'Italiana', serif" }}
            >
              {/* Step 1: Heading text emerges FIRST */}
              <motion.span
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  amount: isDesktop ? 0.25 : 0.2,
                  margin: isDesktop ? "0px 0px -100px 0px" : "0px 0px -40px 0px",
                }}
                transition={{
                  duration: 0.85,
                  delay: 0.04,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="block whitespace-nowrap"
              >
                THE ART
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  amount: isDesktop ? 0.25 : 0.2,
                  margin: isDesktop ? "0px 0px -100px 0px" : "0px 0px -40px 0px",
                }}
                transition={{
                  duration: 0.85,
                  delay: isDesktop ? 0.14 : 0.18,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="block pl-1.5 min-[360px]:pl-3 min-[390px]:pl-5 min-[480px]:pl-16 sm:pl-24 md:pl-32 lg:pl-36 font-normal mt-2 min-[360px]:mt-2.5 sm:mt-3 md:-mt-3 lg:-mt-5 whitespace-nowrap"
              >
                OF SCENT
              </motion.span>
            </h2>

            {/* Step 2: Paragraph text emerges SECOND */}
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{
                once: true,
                amount: isDesktop ? 0.25 : 0.2,
                margin: isDesktop ? "0px 0px -100px 0px" : "0px 0px -40px 0px",
              }}
              transition={{
                duration: 0.95,
                delay: isDesktop ? 0.26 : 0.36,
                ease: [0.19, 1, 0.22, 1],
              }}
              className="pl-1.5 min-[360px]:pl-3 min-[390px]:pl-5 min-[480px]:pl-16 sm:pl-24 md:pl-32 lg:pl-36 pt-5 min-[360px]:pt-6 sm:pt-3 lg:pt-4"
            >
              <p className="text-[17px] min-[360px]:text-[18px] min-[390px]:text-[19px] sm:text-[18px] md:text-[17px] lg:text-[16px] xl:text-[17px] text-[#4A0A13]/90 font-sans leading-[1.65] sm:leading-relaxed font-normal max-w-[470px] sm:max-w-[495px] md:max-w-[520px] ml-1 min-[360px]:ml-2 sm:ml-16 md:ml-20 lg:ml-32 xl:ml-36">
                Born where rare botanicals meet pure passion, this{" "}
                <br className="hidden min-[480px]:inline" />
                fragrance unfolds in layers of floral depth, warm{" "}
                <br className="hidden min-[480px]:inline" />
                woods, and lasting elegance.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

