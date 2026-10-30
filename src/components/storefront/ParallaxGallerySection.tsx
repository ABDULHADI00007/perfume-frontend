"use client";

import { motion, MotionValue, useScroll, useTransform, useSpring } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, useRef, useState } from "react";

const perfumeImages = [
  "/images/perfumes/collection_crimson_bloom.jpg",
  "/images/perfumes/collection_midnight_rose.jpg",
  "/images/perfumes/collection_moonlit_orchid.jpg",
  "/images/perfumes/collection_noir_essence.jpg",
  "/images/perfumes/collection_velvet_amber.jpg",
  "/images/perfumes/golden-senerity.png",
  "/images/perfumes/oud-majesty.png",
  "/images/perfumes/mediterrane_blu.png",
  "/images/perfumes/amber-rivera.png",
  "/images/perfumes/sultan-veils.png",
  "/images/perfumes/collection_blue_horizon.jpg",
  "/images/perfumes/flowers_img.png",
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

  const { height } = dimension;
  const y = useTransform(smoothProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(smoothProgress, [0, 1], [0, height * 3]);

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

  const headlineX = useTransform(smoothProgress, [0, 1], ["2%", "-6%"]);

  return (
    <section id="parallax-gallery" className="w-full bg-white text-stone-900 overflow-hidden relative border-y border-[#590B16]/10 select-none scroll-mt-20">
      {/* Giant SOULMATE SCENTS Header with exact brand color #590B16 */}
      <div className="pt-12 pb-6 sm:pt-24 sm:pb-12 px-4 text-center overflow-hidden select-none relative z-10 flex flex-col items-center justify-center">
        <motion.h2
          style={{
            x: headlineX,
            color: "color-mix(in srgb, #590B16 28%, transparent)",
            willChange: "transform",
            fontFamily: "'Cinzel', 'Marcellus', serif",
          }}
          className="font-serif text-[11vw] sm:text-[12vw] uppercase font-bold tracking-[0.02em] leading-none whitespace-nowrap select-none"
        >
          SOULMATE SCENTS
        </motion.h2>
      </div>

      {/* Responsive Parallax Gallery Container — 2 cols on mobile, 3 on tablet, 4 on desktop */}
      <div
        ref={gallery}
        className="relative box-border flex h-[140vh] sm:h-[160vh] lg:h-[175vh] w-full gap-3 sm:gap-3 md:gap-4 overflow-hidden px-2 sm:px-3"
      >
        <Column images={[images[0], images[1], images[2]]} y={y} className="flex" />
        <Column images={[images[3], images[4], images[5]]} y={y2} className="flex" />
        <Column images={[images[6], images[7], images[8]]} y={y3} className="hidden sm:flex" />
        <Column images={[images[9], images[10], images[11]]} y={y4} className="hidden lg:flex" />
      </div>

      <div className="pb-12 sm:pb-24" />
    </section>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
  className?: string;
};

const Column = ({ images, y, className = "" }: ColumnProps) => {
  return (
    <motion.div
      className={`relative -top-[45%] flex h-full flex-1 min-w-0 flex-col gap-2 sm:gap-3 md:gap-4 first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%] ${className}`}
      style={{
        y,
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] border border-stone-200/70 group"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="Soulmate Scents Parfumerie Flacon"
            className="pointer-events-none w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
            decoding="async"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      ))}
    </motion.div>
  );
};

export default Skiper30;
