"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";
import { Product } from "@/features/products/types";
import { signatureProducts } from "@/features/products/data/products";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const selectedVariant = product.variants?.[0];
  const price = selectedVariant ? selectedVariant.price : 11800;

  return (
    <article className="group flex flex-col h-full text-center">
      {/* Product Image Frame */}
      <Link
        href={`/perfumes/${product.slug}`}
        aria-label={`View ${product.title}`}
        className="block relative aspect-square max-h-[205px] sm:max-h-[230px] lg:max-h-[248px] w-full mx-auto overflow-hidden bg-[#ECE8E1]/40 border border-[#E6E2EA]/80 transition-all duration-500 group-hover:border-[#C5A880]/70 group-hover:shadow-md"
      >
        <Image
          src={product.images?.[0] || "/images/perfumes/oyd_royal.png"}
          alt={product.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover object-center transition-transform duration-700 ease-editorial group-hover:scale-105"
        />

        {/* Subtle glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Link>

      {/* Product Information */}
      <div className="flex flex-col items-center pt-3 sm:pt-3.5">
        {/* Title in bold clean uppercase */}
        <h3 className="font-sans font-medium text-xs sm:text-[13px] tracking-[0.14em] text-[#121735] uppercase mb-1 transition-colors duration-200 group-hover:text-navy">
          <Link href={`/perfumes/${product.slug}`}>{product.title}</Link>
        </h3>

        {/* Concentration and Size */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A7D8F] font-sans font-medium mb-1">
          EDP | 50ML
        </p>

        {/* Formatted Price */}
        <p className="font-sans text-xs sm:text-sm font-semibold text-[#121735] tracking-wide">
          Rs. {price.toLocaleString("en-US")}
        </p>
      </div>
    </article>
  );
};

export const FeaturedProducts: React.FC = () => {
  const products = signatureProducts;

  return (
    <section
      aria-label="Signature Fragrances"
      className="py-10 sm:py-12 lg:py-14 bg-[#FAF7F2] border-b border-[#E6E2EA]/80 relative cinematic-section-snap"
    >
      <Container size="wide">
        {/* Section Header with Centered Title & Subtitle, Right 'VIEW ALL ->' */}
        <motion.div
          className="relative mb-7 sm:mb-9"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          {/* Centered Heading & Subheading */}
          <div className="text-center px-4 sm:px-16">
            <motion.p
              variants={staggerItem}
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-[#7A7D8F] font-sans mb-1"
            >
              OUR SELECTION
            </motion.p>

            <motion.h2
              variants={staggerItem}
              className="font-serif text-2xl sm:text-3xl lg:text-[40px] font-normal text-[#121735] tracking-[-0.01em] leading-tight mb-2"
            >
              Signature Fragrances
            </motion.h2>

            <motion.p
              variants={staggerItem}
              className="text-[11px] sm:text-xs tracking-[0.02em] font-light text-[#6B6F80] font-sans"
            >
              Iconic scents. Unforgettable impressions.
            </motion.p>
          </div>

          {/* Right Action: VIEW ALL */}
          <motion.div
            variants={staggerItem}
            className="mt-3 sm:mt-0 flex justify-center sm:justify-end sm:absolute sm:right-0 sm:bottom-0.5"
          >
            <Link
              href="/perfumes"
              className="inline-flex items-center text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-medium text-[#121735] hover:text-navy transition-colors group"
            >
              <span>VIEW ALL</span>
              <Icons.ArrowRight
                size={12}
                className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* 5-Product Row Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 items-stretch"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          {products.map((product, idx) => (
            <motion.div key={product.id} variants={staggerItem}>
              <ProductCard product={product} priority={idx < 2} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

