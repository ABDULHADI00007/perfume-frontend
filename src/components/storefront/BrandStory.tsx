"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

export const BrandStory: React.FC = () => {
  const pillars = [
    {
      num: "01",
      title: "Artisanal Distillation",
      description:
        "Slow, low-temperature extraction preserving the volatile aromatic fractions of delicate florals and precious woods.",
    },
    {
      num: "02",
      title: "Rare Botanicals",
      description:
        "Single-origin sandalwood, Grasse jasmine, and aged Cambodian oud harvested with respect for environmental cycles.",
    },
    {
      num: "03",
      title: "Timeless Sillage",
      description:
        "Formulated at high pure oil concentrations to interact intimately with natural skin chemistry throughout the day.",
    },
  ];

  return (
    <section 
      aria-label="Brand Philosophy" 
      className="py-12 sm:py-16 lg:py-20 bg-surface border-b border-border/70 overflow-hidden"
    >
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Editorial Content (Left: 7 cols) */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-start text-left"
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainer}
          >
            {/* Eyebrow */}
            <motion.div variants={staggerItem} className="inline-flex items-center space-x-3 mb-6">
              <span className="w-8 h-[1px] bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-foreground-muted font-sans">
                The Philosophy of Maison de Parfum
              </span>
            </motion.div>

            {/* Large Poetic Editorial Quote */}
            <motion.blockquote 
              variants={staggerItem}
              className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-foreground font-normal leading-snug tracking-tight mb-8 max-w-2xl"
            >
              &ldquo;An exploration of stillness, nuance, and memory—crafted without compromise for the discerning individual.&rdquo;
            </motion.blockquote>

            {/* Supporting Narrative */}
            <motion.p 
              variants={staggerItem}
              className="text-base sm:text-lg text-foreground-muted font-sans font-light leading-relaxed mb-12 max-w-xl"
            >
              Rooted in the timeless disciplines of haute perfumery, Maison de Parfum approaches fragrance as an architectural discipline. We compose complex olfactory structures that unfurl slowly over time, leaving an indelible imprint.
            </motion.p>

            {/* Minimalist Editorial Pillars Sequence (Not generic cards!) */}
            <motion.div 
              variants={staggerItem}
              className="w-full border-t border-border/80 divide-y divide-border/60"
            >
              {pillars.map((pillar) => (
                <div key={pillar.num} className="py-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                  <span className="font-serif text-lg text-accent font-normal sm:w-10 flex-shrink-0">
                    {pillar.num}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-foreground font-normal mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-foreground-muted font-sans font-light leading-relaxed max-w-lg">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Editorial Visual Moment (Right: 5 cols) */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={defaultViewport}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Subtle double architectural border frame */}
              <div className="absolute -inset-4 sm:-inset-6 bg-background border border-border/70 -z-10" />
              
              <div className="bg-background p-4 sm:p-6 border border-border">
                <OptimizedImage
                  src="/images/perfumes/whisper-blosem.png"
                  alt="Maison de Parfum formulation and extraction craftsmanship"
                  aspectRatio="3/4"
                  className="w-full h-auto object-cover bg-surface-subtle/40"
                />
                <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-foreground-muted font-sans">
                  <span>Atelier de Création</span>
                  <span className="text-accent font-medium">Paris, France</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
};
