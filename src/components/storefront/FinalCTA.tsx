"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

export const FinalCTA: React.FC = () => {
  return (
    <section
      aria-label="Final Call to Action"
      className="relative w-full overflow-hidden bg-[#0A0D1F] text-white py-24 sm:py-32 flex flex-col justify-between min-h-[460px] sm:min-h-[520px] cinematic-section-snap"
    >
      {/* Background Liquid Silk Ribbons Texture */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <Image
          src="/images/editorial/closing-waves.jpg"
          alt="Cinematic abstract dark luxury silk ribbons"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <Container size="narrow" className="relative z-10 w-full my-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="flex flex-col items-center"
        >
          {/* Main Headline */}
          <motion.h2
            variants={staggerItem}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-tight tracking-[-0.01em] mb-8 max-w-2xl"
          >
            Find the Scent That Stays With You
          </motion.h2>

          {/* Single Refined CTA */}
          <motion.div variants={staggerItem}>
            <Link
              href="/perfumes"
              className="inline-flex items-center justify-center px-10 py-3.5 border border-white/80 hover:border-white bg-transparent hover:bg-white hover:text-[#0C134F] text-white text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 group"
            >
              <span>EXPLORE NOW</span>
              <Icons.ArrowRight
                size={14}
                className="ml-2.5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>
      </Container>

      {/* Discrete Bottom Transition Bar */}
      <div className="relative z-10 w-full pt-12">
        <Container size="wide">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-white/10 text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-white/40 font-sans font-medium">
            <span className="font-serif text-xs sm:text-sm tracking-[0.2em] text-white/70">
              MAISON DE PARFUM
            </span>
            <span>SCENTS · STORIES · A BRIGHTER TOMORROW</span>
          </div>
        </Container>
      </div>
    </section>
  );
};
