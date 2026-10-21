"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { cartStore } from "@/features/cart/store/cartStore";

interface CollectionProduct {
  id: string;
  title: string;
  slug: string;
  price: string;
  numericPrice: number;
  image: string;
  notes: string;
  colDesktop: string;
}

const collectionProducts: CollectionProduct[] = [
  {
    id: "col-01",
    title: "Crimson Bloom",
    slug: "crimson-bloom",
    price: "$495.00",
    numericPrice: 13500,
    image: "/images/perfumes/collection_crimson_bloom.jpg",
    notes: "Centifolia Scarlet Rose · Pink Pepper · Crystalline Amber",
    colDesktop: "lg:col-start-1 lg:row-start-1",
  },
  {
    id: "col-02",
    title: "Midnight Rose",
    slug: "midnight-rose",
    price: "$495.00",
    numericPrice: 13500,
    image: "/images/perfumes/collection_midnight_rose.jpg",
    notes: "Nocturnal Damask Rose · Smoked Plum · Bourbon Vanilla",
    colDesktop: "lg:col-start-3 lg:row-start-1",
  },
  {
    id: "col-03",
    title: "Velvet Amber",
    slug: "velvet-amber",
    price: "$495.00",
    numericPrice: 13500,
    image: "/images/perfumes/collection_velvet_amber.jpg",
    notes: "Molten Liquid Amber · Cinnamon Bark · Smoked Labdanum",
    colDesktop: "lg:col-start-4 lg:row-start-1",
  },
  {
    id: "col-04",
    title: "Moonlit Orchid",
    slug: "moonlit-orchid",
    price: "$495.00",
    numericPrice: 13500,
    image: "/images/perfumes/collection_moonlit_orchid.jpg",
    notes: "Night-Blooming Black Orchid · Tuberose · Dark Patchouli",
    colDesktop: "lg:col-start-2 lg:row-start-2",
  },
  {
    id: "col-05",
    title: "Noir Essence",
    slug: "noir-essence",
    price: "$495.00",
    numericPrice: 13500,
    image: "/images/perfumes/collection_noir_essence.jpg",
    notes: "Cambodian Agarwood · Russian Leather · Royal Saffron",
    colDesktop: "lg:col-start-4 lg:row-start-2",
  },
];

export function DiscoverCollectionSection() {
  const [quickViewProduct, setQuickViewProduct] = useState<CollectionProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleQuickAdd = (product: CollectionProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cartStore.addItem({
      id: `cart-${product.id}`,
      productId: product.id,
      variantId: `var-${product.id}`,
      title: product.title,
      size: "100ml",
      price: product.numericPrice,
      quantity: 1,
      image: product.image,
      sku: `SS-${product.id}`,
    });

    setToastMessage(`Added ${product.title} to bag`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <section className="w-full bg-[#FAF7EE] pt-6 sm:pt-8 lg:pt-10 pb-12 sm:pb-16 lg:pb-20 overflow-hidden select-none border-y border-[#ECE5D8]/70">
      <Container size="wide">
        {/* ================= TOP EDITORIAL HEADER ================= */}
        <div className="w-full mb-6 sm:mb-7 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-left select-none"
          >
            <h2
              className="text-[#590B16] font-normal uppercase leading-[1.02] tracking-[0.02em]"
              style={{
                fontFamily: "'Cinzel', 'Marcellus', 'Italiana', serif",
                fontSize: "clamp(1.85rem, 3.2vw, 3rem)",
              }}
            >
              DISCOVER THE
              <br />
              COLLECTION
            </h2>

            {/* Subtle luxury accent line */}
            <div className="w-16 h-[1.5px] bg-[#590B16]/30 mt-3" />
          </motion.div>
        </div>

        {/* ================= ASYMMETRICAL EDITORIAL MASONRY GRID ================= */}
        {/* On desktop: 4 columns x 2 rows with negative space layout matching reference perfectly */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-x-8 lg:gap-y-12">
          {collectionProducts.map((product, idx) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.85,
                delay: idx * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group flex flex-col ${product.colDesktop}`}
            >
              {/* Product Card Canvas (Crisp pure white box with shimmer & lift) */}
              <Link
                href={`/perfumes/${product.slug}`}
                className="relative w-full aspect-[4/4.3] bg-white rounded-none overflow-hidden flex items-center justify-center p-4 sm:p-5 lg:p-6 transition-all duration-700 shadow-[0_2px_12px_rgba(89,11,22,0.03)] group-hover:shadow-[0_22px_44px_rgba(89,11,22,0.12)] group-hover:-translate-y-2"
                aria-label={`Explore ${product.title}`}
              >
                {/* Diagonal Glass Reflection Sheen Sweep on Hover */}
                <div className="absolute inset-0 -translate-x-[120%] group-hover:translate-x-[120%] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none z-20" />

                {/* Perfume Bottle Image with Floating Zoom Animation */}
                <div className="relative w-full h-full flex items-center justify-center z-10">
                  <motion.div
                    className="relative w-full h-full"
                    style={{ position: "relative", width: "100%", height: "100%" }}
                    whileHover={{ scale: 1.07, y: -4 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-2 drop-shadow-[0_8px_16px_rgba(89,11,22,0.06)] group-hover:drop-shadow-[0_16px_28px_rgba(89,11,22,0.14)] transition-all duration-700"
                    />
                  </motion.div>
                </div>

                {/* Hover Quick Action Buttons with Smooth Slide-Up Reveal */}
                <div className="absolute inset-x-0 bottom-4 px-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-3 group-hover:translate-y-0 z-30">
                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className="flex-1 py-2 px-3 bg-[#590B16] text-[#FAF7EE] text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-medium transition-all duration-300 hover:bg-[#42060F] hover:shadow-md active:scale-95 text-center"
                  >
                    Quick Add
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                    className="py-2 px-3 bg-white/95 backdrop-blur-sm text-[#590B16] border border-[#590B16]/30 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] font-medium transition-all duration-300 hover:bg-white hover:border-[#590B16] active:scale-95 text-center"
                    aria-label={`Quick details for ${product.title}`}
                  >
                    Details
                  </button>
                </div>
              </Link>

              {/* Text Details below the white box */}
              <div className="mt-2.5 sm:mt-3 text-left transition-transform duration-300 group-hover:translate-x-1">
                <Link href={`/perfumes/${product.slug}`}>
                  <h3 className="text-[#590B16] text-[13.5px] sm:text-[14.5px] font-medium tracking-[0.01em] font-serif hover:text-[#42060F] transition-colors">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-[#590B16]/75 text-xs sm:text-[13px] font-normal tracking-wide mt-0.5">
                  {product.price}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>

      {/* ================= QUICK VIEW MODAL ================= */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl bg-[#FAF7EE] border border-[#ECE5D8] p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row gap-8 items-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 text-[#590B16] hover:opacity-70 p-2 text-xl font-light"
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Product Image Frame */}
              <div
                className="relative w-full md:w-1/2 aspect-square min-h-[260px] bg-white flex items-center justify-center p-4 shadow-sm"
                style={{ position: "relative" }}
              >
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-3"
                />
              </div>

              {/* Details Column */}
              <div className="w-full md:w-1/2 flex flex-col text-left space-y-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#590B16]/70">
                  Extrait de Parfum · 100ml
                </div>
                <h3
                  className="text-2xl sm:text-3xl text-[#590B16] font-normal"
                  style={{ fontFamily: "'Cinzel', 'Marcellus', serif" }}
                >
                  {quickViewProduct.title}
                </h3>
                <p className="text-lg font-medium text-[#590B16]">
                  {quickViewProduct.price}
                </p>
                <p className="text-xs sm:text-sm text-[#590B16]/80 leading-relaxed">
                  {quickViewProduct.notes}
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={(e) => {
                      handleQuickAdd(quickViewProduct, e);
                      setQuickViewProduct(null);
                    }}
                    className="w-full py-3 bg-[#590B16] text-[#FAF7EE] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#42060F] transition-colors"
                  >
                    Add to Bag
                  </button>
                  <Link
                    href={`/perfumes/${quickViewProduct.slug}`}
                    className="w-full py-3 text-center border border-[#590B16] text-[#590B16] text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors"
                  >
                    View Story
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= TOAST NOTIFICATION ================= */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 z-50 bg-[#590B16] text-[#FAF7EE] px-5 py-3 text-xs tracking-wider uppercase font-medium shadow-xl flex items-center gap-3"
          >
            <span>✓</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
