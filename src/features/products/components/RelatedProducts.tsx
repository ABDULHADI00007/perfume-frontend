"use client";

import React from "react";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";

export interface RelatedProductsProps {
  currentProduct: Product;
  allProducts: Product[];
  className?: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProduct,
  allProducts,
  className = "",
}) => {
  // Find related products: slice up to 4 items matching reference grid
  const related = allProducts
    .filter((p) => p.id !== currentProduct.id)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section
      aria-labelledby="related-fragrances-heading"
      className={`py-12 border-t border-gray-200/80 mt-12 font-sans ${className}`}
    >
      {/* Header Row with Navigation Arrows */}
      <div className="flex items-center justify-between mb-8">
        <h2
          id="related-fragrances-heading"
          className="font-serif text-2xl sm:text-3xl font-bold text-[#0D1424] tracking-tight"
        >
          You May Also Like
        </h2>

        {/* Circular Slider Navigation Arrows */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-colors"
            aria-label="Previous products"
          >
            ‹
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-colors"
            aria-label="Next products"
          >
            ›
          </button>
        </div>
      </div>

      {/* 4-Column Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
