"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Icons } from "@/components/ui/icons";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

const newArrivals = [
  {
    id: "iris-de-paris",
    slug: "ciel",
    name: "Ciel",
    family: "Citrus Floral",
    concentration: "29% Extrait",
    price: "PKR 19,000",
    image: "/images/perfumes/cirtus-revrie.png",
    isNew: true,
  },
  {
    id: "ambre-sauvage",
    slug: "rose-eternelle",
    name: "Rose Éternelle",
    family: "Fruity Floral",
    concentration: "31% Extrait",
    price: "PKR 21,500",
    image: "/images/perfumes/whisper-blosem.png",
    isNew: true,
  },
  {
    id: "vetiver-mysterieux",
    slug: "ombre-dor",
    name: "Ombre d'Or",
    family: "Golden Amber",
    concentration: "30% Extrait",
    price: "PKR 17,500",
    image: "/images/perfumes/golden-senerity.png",
    isNew: true,
  },
];

export const NewArrivals: React.FC = () => {
  return (
    <section
      aria-label="New Arrivals"
      className="py-20 sm:py-28 bg-surface border-b border-border/60"
    >
      <Container size="wide">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          <div className="max-w-xl">
            <motion.div variants={staggerItem} className="inline-flex items-center space-x-3 mb-3">
              <span className="w-6 h-[1px] bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-foreground-muted">
                Latest from the Atelier
              </span>
            </motion.div>
            <motion.h2
              variants={staggerItem}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground leading-tight tracking-tight"
            >
              New Arrivals
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="mt-3 text-sm sm:text-base text-foreground-muted font-sans font-light leading-relaxed"
            >
              The newest extraits to emerge from our Grasse atelier this season.
            </motion.p>
          </div>

          <motion.div variants={staggerItem} className="hidden sm:block">
            <Link
              href="/perfumes"
              className="inline-flex items-center justify-center font-sans font-medium uppercase px-6 py-3 text-xs tracking-[0.18em] bg-transparent text-foreground border border-border-strong hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 ease-luxury group"
            >
              Explore All
              <Icons.ArrowRight size={14} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Asymmetric editorial layout — 1 large + 2 smaller */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          {/* Large Feature Card */}
          <motion.div variants={staggerItem} className="md:col-span-7 group">
            <Link href={`/perfumes/${newArrivals[0].slug}`} className="block">
              <div className="relative overflow-hidden border border-border bg-surface-subtle group-hover:border-champagne transition-colors duration-300">
                <OptimizedImage
                  src={newArrivals[0].image}
                  alt={newArrivals[0].name}
                  aspectRatio="16/9"
                  priority={true}
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                {/* New Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em] bg-secondary text-secondary-foreground font-sans">
                    New Arrival
                  </span>
                </div>
              </div>
              <div className="pt-4 space-y-1.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-foreground-subtle font-sans">{newArrivals[0].family}</p>
                <h3 className="font-serif text-xl sm:text-2xl text-foreground font-normal group-hover:text-primary transition-colors">
                  {newArrivals[0].name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base text-foreground-muted">{newArrivals[0].price}</span>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-accent font-medium font-sans">{newArrivals[0].concentration}</span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Stacked Smaller Cards */}
          <div className="md:col-span-5 flex flex-col gap-6 lg:gap-8">
            {newArrivals.slice(1).map((product) => (
              <motion.div key={product.id} variants={staggerItem} className="group">
                <Link href={`/perfumes/${product.slug}`} className="flex gap-4 sm:gap-5">
                  <div className="relative w-32 sm:w-36 flex-shrink-0 overflow-hidden border border-border bg-surface-subtle group-hover:border-champagne transition-colors duration-300">
                    <OptimizedImage
                      src={product.image}
                      alt={product.name}
                      aspectRatio="3/4"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-[0.14em] bg-secondary text-secondary-foreground font-sans">
                        New
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center space-y-1.5 flex-1 py-2">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-foreground-subtle font-sans">{product.family}</p>
                    <h3 className="font-serif text-lg text-foreground font-normal group-hover:text-primary transition-colors leading-snug">
                      {product.name}
                    </h3>
                    <div className="space-y-1">
                      <span className="block font-serif text-sm text-foreground-muted">{product.price}</span>
                      <span className="block text-[10px] uppercase tracking-[0.12em] text-accent font-medium font-sans">{product.concentration}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
