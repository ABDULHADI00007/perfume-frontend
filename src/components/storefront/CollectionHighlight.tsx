"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Icons } from "@/components/ui/icons";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

export const CollectionHighlight: React.FC = () => {
  const highlights = [
    { name: "Santal Impérial", family: "Woody Oriental", concentration: "30% Extrait" },
    { name: "Oud Royale", family: "Smoked Amber", concentration: "32% Extrait" },
    { name: "Fleur Blanche", family: "Solar Floral", concentration: "28% Extrait" },
  ];

  return (
    <section 
      aria-label="Private Reserve Collection" 
      className="py-12 sm:py-16 lg:py-20 bg-background border-b border-border/70 overflow-hidden"
    >
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Visual Showcase (Dominant Image: 6 cols) */}
          <motion.div 
            className="lg:col-span-6 relative order-2 lg:order-1"
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={defaultViewport}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Architectural under-frame */}
              <div className="absolute -inset-4 sm:-inset-6 bg-surface-subtle border border-border/70 -z-10" />
              
              <div className="bg-surface p-4 sm:p-6 border border-border">
                <OptimizedImage
                  src="/images/perfumes/amber-rivera.png"
                  alt="Maison de Parfum Private Reserve collection flacons"
                  aspectRatio="16/9"
                  className="w-full h-auto object-cover bg-surface-subtle/40"
                />
                <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-foreground-muted font-sans">
                  <span>Edition Limitée</span>
                  <span className="text-accent font-medium">Hand-Numbered Flacons</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Editorial Content (6 cols) */}
          <motion.div 
            className="lg:col-span-6 flex flex-col items-start text-left order-1 lg:order-2"
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem} className="inline-flex items-center space-x-3 mb-4">
              <span className="w-8 h-[1px] bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-foreground-muted font-sans">
                Exclusive Series
              </span>
            </motion.div>

            <motion.h2 
              variants={staggerItem}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground leading-tight tracking-tight mb-6"
            >
              The Private Reserve
            </motion.h2>

            <motion.p 
              variants={staggerItem}
              className="text-base sm:text-lg text-foreground-muted font-sans font-light leading-relaxed mb-8 max-w-xl"
            >
              A limited exploration of single-origin distillations and rare harvest extracts. Formulated without synthetic diluents and allowed to mature in dark glass vessels for six months prior to hand-bottling.
            </motion.p>

            {/* Scent Editions Micro Table */}
            <motion.div 
              variants={staggerItem}
              className="w-full border-t border-b border-border divide-y divide-border/60 mb-10"
            >
              {highlights.map((item) => (
                <div key={item.name} className="py-3.5 flex items-center justify-between">
                  <div>
                    <p className="font-serif text-base sm:text-lg text-foreground">{item.name}</p>
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-foreground-muted font-sans mt-0.5">
                      {item.family}
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-sans text-accent font-medium">
                    {item.concentration}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Single Strong CTA */}
            <motion.div variants={staggerItem}>
              <Link
                href="/perfumes"
                className="inline-flex items-center justify-center font-sans font-medium uppercase px-9 py-4 text-xs tracking-[0.2em] bg-primary text-primary-foreground hover:bg-[#080d38] active:bg-black transition-colors duration-200 group"
              >
                Explore The Reserve
                <Icons.ArrowRight size={14} className="ml-2.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
};
