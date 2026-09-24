"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Icons } from "@/components/ui/icons";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

const bestSellers = [
  {
    id: "no-01",
    slug: "no-01",
    name: "No. 01",
    family: "Amber Oud",
    concentration: "32% Extrait",
    price: "PKR 18,500",
    image: "/images/perfumes/oyd_royal.png",
    badge: "Best Seller",
  },
  {
    id: "rose-eternelle",
    slug: "rose-eternelle",
    name: "Rose Éternelle",
    family: "Fruity Floral",
    concentration: "28% Extrait",
    price: "PKR 22,000",
    image: "/images/perfumes/lyce_blush.png",
    badge: "No. 1",
  },
  {
    id: "ciel",
    slug: "ciel",
    name: "Ciel",
    family: "Citrus Floral",
    concentration: "28% Extrait",
    price: "PKR 16,500",
    image: "/images/perfumes/mediterrane_blu.png",
    badge: "Signature",
  },
  {
    id: "sultans-veil",
    slug: "sultans-veil",
    name: "Sultan's Veil",
    family: "Spiced Oud",
    concentration: "30% Extrait",
    price: "PKR 19,000",
    image: "/images/perfumes/sultan-veils.png",
    badge: "New",
  },
];

export const BestSellers: React.FC = () => {
  return (
    <section
      aria-label="Best Sellers"
      className="py-20 sm:py-28 bg-background border-b border-border/60"
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
                Client Favourites
              </span>
            </motion.div>
            <motion.h2
              variants={staggerItem}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground leading-tight tracking-tight"
            >
              Most Loved Fragrances
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="mt-3 text-sm sm:text-base text-foreground-muted font-sans font-light leading-relaxed"
            >
              The fragrances our clients return to, season after season.
            </motion.p>
          </div>

          <motion.div variants={staggerItem} className="hidden sm:block">
            <Link
              href="/perfumes"
              className="inline-flex items-center justify-center font-sans font-medium uppercase px-6 py-3 text-xs tracking-[0.18em] bg-transparent text-foreground border border-border-strong hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 ease-luxury group"
            >
              View All Fragrances
              <Icons.ArrowRight size={14} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          {bestSellers.map((product, idx) => (
            <motion.div
              key={product.id}
              variants={staggerItem}
              className="group"
            >
              <Link href={`/perfumes/${product.slug}`} className="block">
                {/* Image */}
                <div className="relative overflow-hidden border border-border bg-surface-subtle group-hover:border-champagne transition-colors duration-300">
                  <div className="relative aspect-[3/4]">
                    <OptimizedImage
                      src={product.image}
                      alt={product.name}
                      aspectRatio="3/4"
                      priority={idx < 2}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    />
                  </div>
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.16em] bg-primary text-primary-foreground font-sans">
                      {product.badge}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="pt-4 space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-foreground-subtle font-sans">
                    {product.family}
                  </p>
                  <h3 className="font-serif text-base sm:text-lg text-foreground font-normal group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-serif text-sm text-foreground-muted">
                      {product.price}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-accent font-medium font-sans">
                      {product.concentration}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/perfumes"
            className="inline-flex items-center justify-center w-full font-sans font-medium uppercase px-6 py-3 text-xs tracking-[0.18em] bg-transparent text-foreground border border-border-strong hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 ease-luxury"
          >
            View All Fragrances
            <Icons.ArrowRight size={14} className="ml-2" />
          </Link>
        </div>
      </Container>
    </section>
  );
};
