"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

export const JournalPreview: React.FC = () => {
  const articles = [
    {
      title: "THE ART OF SCENT",
      subtitle: "Discover the language of fragrance",
      image: "/images/editorial/journal-jasmine.jpg",
      alt: "White blooming Grasse jasmine flower with morning dew",
      href: "/journal",
    },
    {
      title: "PLACES THAT INSPIRE",
      subtitle: "Journeys that shape our scents",
      image: "/images/editorial/journal-coastal.jpg",
      alt: "Historic Mediterranean cliffside village bathed in golden hour sunlight",
      href: "/journal",
    },
    {
      title: "THE INGREDIENTS WITH SOUL",
      subtitle: "Nature's rarest treasures",
      image: "/images/editorial/journal-woods.jpg",
      alt: "Aged agarwood, sandalwood, and whole spices on natural linen",
      href: "/journal",
    },
  ];

  return (
    <section
      aria-label="Editorial Journal"
      className="py-16 sm:py-20 lg:py-24 bg-[#FFFFFF] border-b border-[#E6E2EA] cinematic-section-snap"
    >
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Editorial Introduction (lg:col-span-4) */}
          <motion.div
            className="lg:col-span-4 flex flex-col items-start text-left"
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainer}
          >
            {/* Eyebrow */}
            <motion.div variants={staggerItem} className="flex flex-col space-y-1 mb-4">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-[#6B6F80] font-sans">
                THE OLFACTORY JOURNAL
              </span>
              <div className="w-10 h-[1px] bg-[#C5A880]/80 mt-1" />
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={staggerItem}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#121735] leading-tight tracking-[-0.01em] mb-4"
            >
              Stories that Inspire
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={staggerItem}
              className="text-xs sm:text-sm text-[#6B6F80] font-sans font-light leading-relaxed mb-8 max-w-sm"
            >
              Discover the art of fragrance, hidden ingredients, travel inspirations and the stories behind our creations.
            </motion.p>

            {/* Action link */}
            <motion.div variants={staggerItem}>
              <Link
                href="/journal"
                className="inline-flex items-center text-xs uppercase tracking-[0.2em] font-medium text-[#121735] hover:text-navy transition-colors group py-1"
              >
                <span>EXPLORE JOURNAL</span>
                <Icons.ArrowRight
                  size={13}
                  className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: 3 Editorial Magazine Cards (lg:col-span-8) */}
          <motion.div
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 lg:gap-7 items-stretch"
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainer}
          >
            {articles.map((article) => (
              <motion.article
                key={article.title}
                variants={staggerItem}
                className="group flex flex-col h-full text-left"
              >
                {/* Article Image */}
                <Link
                  href={article.href}
                  className="block relative aspect-[4/3] w-full overflow-hidden bg-[#F4F1EA] border border-[#E6E2EA] mb-3.5 transition-all duration-300 group-hover:border-[#C5A880]/80"
                >
                  <Image
                    src={article.image}
                    alt={article.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 ease-editorial group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-navy/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </Link>

                {/* Title */}
                <h3 className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#121735] mb-1 group-hover:text-navy transition-colors">
                  <Link href={article.href}>{article.title}</Link>
                </h3>

                {/* Subtitle / Excerpt */}
                <p className="font-sans text-xs text-[#6B6F80] font-light leading-relaxed">
                  {article.subtitle}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
