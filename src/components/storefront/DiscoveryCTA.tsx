"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Icons } from "@/components/ui/icons";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

export const DiscoveryCTA: React.FC = () => {
  const inclusions = [
    "Five 5ml Extrait Flacons (30% Concentration)",
    "Handmade Linen Presentation Box",
    "Comprehensive Olfactory Tasting Guide",
    "Full-Value Redeemable Voucher Toward Any 100ml Flacon",
  ];

  return (
    <section 
      aria-label="Discovery Set Campaign" 
      className="py-12 sm:py-16 lg:py-20 bg-background border-b border-border/70 overflow-hidden"
    >
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Visual Showcase (Discovery Imagery: 6 cols) */}
          <motion.div 
            className="lg:col-span-6 relative"
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={defaultViewport}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Architectural frame */}
              <div className="absolute -inset-4 sm:-inset-6 bg-surface border border-border/70 -z-10" />
              
              <div className="bg-surface p-4 sm:p-6 border border-border">
                <OptimizedImage
                  src="/images/perfumes/sultan-veils.png"
                  alt="Maison de Parfum Discovery Set with 5ml extrait flacons in linen presentation box"
                  aspectRatio="16/9"
                  className="w-full h-auto object-cover bg-surface-subtle/40"
                />
                <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-foreground-muted font-sans">
                  <span>Coffret Découverte</span>
                  <span className="text-accent font-medium">5 × 5ml Flacons</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Editorial Content (6 cols) */}
          <motion.div 
            className="lg:col-span-6 flex flex-col items-start text-left"
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainer}
          >
            {/* Eyebrow */}
            <motion.div variants={staggerItem} className="inline-flex items-center space-x-3 mb-4">
              <span className="w-8 h-[1px] bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-foreground-muted font-sans">
                The Olfactory Exploration
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2 
              variants={staggerItem}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground leading-tight tracking-tight mb-6"
            >
              Discover Your Signature Scent at Home
            </motion.h2>

            {/* Concise Narrative */}
            <motion.p 
              variants={staggerItem}
              className="text-base sm:text-lg text-foreground-muted font-sans font-light leading-relaxed mb-8 max-w-xl"
            >
              Scent must be experienced on skin over time. The Maison de Parfum Discovery Set allows you to explore our five signature extraits in intimate ritual before choosing your full flacon.
            </motion.p>

            {/* Inclusions Detail List */}
            <motion.div 
              variants={staggerItem}
              className="w-full border-t border-b border-border divide-y divide-border/60 mb-10"
            >
              {inclusions.map((item) => (
                <div key={item} className="py-3 flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-foreground font-sans font-light">
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Single Strong Primary CTA */}
            <motion.div variants={staggerItem}>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center font-sans font-medium uppercase px-9 py-4 text-xs tracking-[0.2em] bg-primary text-primary-foreground hover:bg-[#080d38] active:bg-black transition-colors duration-200 group"
              >
                Acquire Discovery Set
                <Icons.ArrowRight size={14} className="ml-2.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
};
