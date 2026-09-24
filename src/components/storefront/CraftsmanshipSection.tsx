"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

export const CraftsmanshipSection: React.FC = () => {
  const architecturalTiers = [
    {
      tier: "01",
      name: "The Head Accord",
      phase: "Immediate Revelation",
      description:
        "Luminous bergamot, cardamom, and cold-pressed citrus distillates. An ethereal opening designed to awaken the senses upon skin contact.",
    },
    {
      tier: "02",
      name: "The Heart Nuance",
      phase: "4 to 8 Hours",
      description:
        "Velvety Tuscan iris, night-blooming tuberose, and damask rose. The emotional core of the extrait that blooms with body warmth.",
    },
    {
      tier: "03",
      name: "The Soul & Sillage",
      phase: "12+ Hours",
      description:
        "Aged Mysore sandalwood, fossilized amber, and smoky agarwood. Deep, resonant base notes that anchor the perfume intimately to the wearer.",
    },
  ];

  return (
    <section 
      aria-label="Fragrance Craftsmanship" 
      className="py-12 sm:py-16 lg:py-20 bg-surface border-b border-border/70"
    >
      <Container size="wide">
        {/* Editorial Section Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          <motion.div variants={staggerItem} className="inline-flex items-center justify-center space-x-3 mb-4">
            <span className="w-8 h-[1px] bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-foreground-muted font-sans">
              The Artisan&apos;s Code
            </span>
            <span className="w-8 h-[1px] bg-accent" />
          </motion.div>
          
          <motion.h2 
            variants={staggerItem}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground leading-tight tracking-tight"
          >
            Olfactory Architecture
          </motion.h2>
          
          <motion.p 
            variants={staggerItem}
            className="mt-4 text-base text-foreground-muted font-sans font-light leading-relaxed"
          >
            A master fragrance is an invisible garment that evolves across hours, composed in deliberate three-tier harmonic resonance.
          </motion.p>
        </motion.div>

        {/* Minimal Horizontal Editorial Sequence (Not generic cards!) */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-border/80 divide-y md:divide-y-0 md:divide-x divide-border/80"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          {architecturalTiers.map((tier) => (
            <motion.div
              key={tier.tier}
              variants={staggerItem}
              className="py-10 md:py-12 px-0 md:px-8 lg:px-12 flex flex-col justify-between first:md:pl-0 last:md:pr-0"
            >
              <div>
                {/* Large Numeral & Phase */}
                <div className="flex items-baseline justify-between mb-8">
                  <span className="font-serif text-4xl sm:text-5xl text-accent font-light">
                    {tier.tier}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-foreground-subtle font-sans">
                    {tier.phase}
                  </span>
                </div>

                {/* Tier Name */}
                <h3 className="font-serif text-2xl text-foreground font-normal mb-3">
                  {tier.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-foreground-muted font-sans font-light leading-relaxed">
                  {tier.description}
                </p>
              </div>

              {/* Understated bottom badge */}
              <div className="mt-10 pt-4 border-t border-border/60">
                <span className="text-[10px] uppercase tracking-[0.22em] text-foreground-subtle font-sans">
                  Slow Cold Extraction
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};
