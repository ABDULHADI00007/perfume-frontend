"use client";

import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

const testimonials = [
  {
    id: 1,
    quote:
      "Santal Impérial has become my signature. It stays close to skin, evolving throughout the day into something completely personal. Nothing from a department counter comes close.",
    author: "Sophia L.",
    location: "London",
    product: "Santal Impérial",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "The Discovery Set changed how I understand fragrance. Being able to wear each extrait across a week revealed nuances I had never experienced before. A true olfactory education.",
    author: "Alexandre M.",
    location: "Paris",
    product: "Discovery Set",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "Oud Royale is unlike any oud I have worn. There is a restraint to it — a quietude — that makes it feel both ancient and completely modern. Extraordinary.",
    author: "Nadia R.",
    location: "Dubai",
    product: "Oud Royale",
    rating: 5,
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section
      aria-label="Client Testimonials"
      className="py-20 sm:py-28 bg-surface-subtle border-b border-border/60"
    >
      <Container size="wide">
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-18"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          <motion.div variants={staggerItem} className="inline-flex items-center justify-center space-x-3 mb-4">
            <span className="w-6 h-[1px] bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-foreground-muted">
              Client Correspondence
            </span>
            <span className="w-6 h-[1px] bg-accent" />
          </motion.div>
          <motion.h2
            variants={staggerItem}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground leading-tight tracking-tight"
          >
            Voices of the Salon
          </motion.h2>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          {testimonials.map((item) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              className="flex flex-col justify-between p-8 bg-surface border border-border/70 hover:border-champagne/50 hover:shadow-card transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex items-center space-x-0.5 mb-6">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <span key={i} className="text-accent text-sm" aria-hidden="true">★</span>
                ))}
              </div>

              {/* Quote Mark */}
              <div className="mb-4">
                <span className="font-serif text-5xl text-accent/30 leading-none select-none" aria-hidden="true">
                  &ldquo;
                </span>
              </div>

              {/* Quote */}
              <blockquote className="font-serif text-lg sm:text-xl text-foreground font-normal leading-relaxed italic flex-1 mb-8 -mt-6">
                {item.quote}
              </blockquote>

              {/* Author */}
              <div className="pt-6 border-t border-border/60 flex items-center justify-between">
                <div>
                  <p className="text-sm font-sans font-medium text-foreground tracking-wide">
                    {item.author}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-foreground-muted font-sans mt-0.5">
                    {item.location}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-accent font-medium font-sans">
                  {item.product}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};
