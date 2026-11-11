"use client";

import { motion, MotionValue, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, useRef, useState } from "react";

const perfumeImages = [
  "/images/perfumes/dusk-still-life.webp",
  "/images/perfumes/suroor-still-life.webp",
  "/images/perfumes/gentle-man-still-life.webp",
  "/images/perfumes/Secret Garden Perfume in Bloom.webp",
  "/images/perfumes/Whispers Bloom Luxury Perfume Still Life.webp",
  "/images/perfumes/vivid-desire-still-life.webp",
  "/images/perfumes/Infinite Boss in Golden Stone Light.webp",
  "/images/perfumes/Eternal Blaze Citrus Floral Fragrance.webp",
  "/images/perfumes/noble-ocean-luxury.webp",
  "/images/perfumes/pulse-luxury.webp",
  "/images/perfumes/dusk-still-life.webp",
  "/images/perfumes/suroor-still-life.webp",
];

export const Skiper30 = ({ images = perfumeImages }: { images?: string[] }) => {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 900,
  });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  // Physics-based spring interpolation to eliminate discrete mouse wheel jumping & jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.1,
    restDelta: 0.0005,
  });

  const { height, width } = dimension;
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const travelScale = isMobile ? 0.46 : isTablet ? 0.52 : 1;

  const y = useTransform(smoothProgress, [0, 1], [0, height * 1.85 * travelScale]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, height * 2.85 * travelScale]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, height * 1.35 * travelScale]);
  const y4 = useTransform(smoothProgress, [0, 1], [0, height * 2.65 * travelScale]);

  useEffect(() => {
    let reqId: number;
    let lenis: Lenis | null = null;

    try {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        reqId = requestAnimationFrame(raf);
      };

      reqId = requestAnimationFrame(raf);
    } catch {
      // Graceful fallback if smooth scroll is restricted
    }

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      if (reqId) cancelAnimationFrame(reqId);
      if (lenis) lenis.destroy();
    };
  }, []);

  const headlineX = useTransform(smoothProgress, [0, 0.42], ["1%", "-28%"]);

  return (
    <section id="parallax-gallery" className="w-full bg-white text-stone-900 overflow-hidden relative border-y border-[#590B16]/10 select-none scroll-mt-20">
      {/* Giant SOULMATE SCENTS Header with exact brand dark red #3E060E */}
      <div className="pt-12 pb-6 sm:pt-24 sm:pb-12 pl-1 min-[360px]:pl-2 min-[400px]:pl-3 sm:pl-4 md:pl-6 lg:pl-8 pr-4 text-left overflow-hidden select-none relative z-10 flex flex-col items-start justify-center">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
          className="w-full overflow-visible"
        >
          <motion.h2
            id="parallax-gallery-heading"
            style={{
              x: headlineX,
              color: "#3E060E",
              willChange: "transform",
              fontFamily: "'Cinzel', 'Marcellus', serif",
            }}
            className="font-serif text-[10vw] sm:text-[11.5vw] uppercase font-bold tracking-[0.02em] leading-none whitespace-nowrap select-none"
          >
            SOULMATE SCENTS
          </motion.h2>
        </motion.div>
      </div>

      {/* Responsive Parallax Gallery Container — balanced card aspect-ratio across mobile, tablet & desktop */}
      <div
        ref={gallery}
        className="relative box-border flex h-[94vh] sm:h-[96vh] md:h-[98vh] lg:h-[175vh] w-full gap-2.5 sm:gap-3 md:gap-4 overflow-hidden px-2 sm:px-3"
      >
        <Column images={[images[0], images[1], images[2]]} y={y} colIdx={0} className="flex" />
        <Column images={[images[3], images[4], images[5]]} y={y2} colIdx={1} className="flex" />
        <Column images={[images[6], images[7], images[8]]} y={y3} colIdx={2} className="hidden sm:flex" />
        <Column images={[images[9], images[10], images[11]]} y={y4} colIdx={3} className="hidden lg:flex" />
      </div>

      <div className="pb-12 sm:pb-24" />
    </section>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
  colIdx: number;
  className?: string;
};

const Column = ({ images, y, colIdx, className = "" }: ColumnProps) => {
  return (
    <motion.div
      className={`relative flex h-full flex-1 min-w-0 flex-col gap-2.5 sm:gap-3 md:gap-4 first:-top-[25%] sm:first:-top-[35%] lg:first:-top-[45%] [&:nth-child(2)]:-top-[55%] sm:[&:nth-child(2)]:-top-[68%] lg:[&:nth-child(2)]:-top-[95%] [&:nth-child(3)]:-top-[25%] sm:[&:nth-child(3)]:-top-[35%] lg:[&:nth-child(3)]:-top-[45%] [&:nth-child(4)]:-top-[40%] sm:[&:nth-child(4)]:-top-[55%] lg:[&:nth-child(4)]:-top-[75%] ${className}`}
      style={{
        y,
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      {images.map((src, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.93, y: 35 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.95,
            delay: colIdx * 0.1 + i * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_50px_-8px_rgba(62,6,14,0.18)] border border-stone-200/70 group transition-shadow duration-700"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        >
          <Image
            src={src}
            alt="Soulmate Scents Parfumerie Flacon"
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="pointer-events-none object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
            loading="lazy"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3E060E]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Skiper30;
