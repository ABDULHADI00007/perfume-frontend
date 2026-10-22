"use client";

import React, { useState, useMemo } from "react";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { filterAndSortProducts, FilterOptions } from "../utils";
import { useCart } from "@/features/cart/hooks/useCart";
import { Container } from "@/components/layout/Container";

export interface ProductDiscoveryViewProps {
  initialProducts: Product[];
  title?: string;
  subtitle?: string;
  fixedCollectionId?: string;
  itemsPerPage?: number;
}

export const ProductDiscoveryView: React.FC<ProductDiscoveryViewProps> = ({
  initialProducts,
  itemsPerPage = 16,
}) => {
  const { addItem } = useCart();

  // Active Category State
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Compute filtered & sorted products
  const filterOptions: FilterOptions = useMemo(
    () => ({
      gender: "all",
      collection: "all",
      sort: "featured",
      page: 1,
      limit: itemsPerPage,
    }),
    [itemsPerPage]
  );

  const { products } = useMemo(() => {
    let filtered = [...initialProducts];
    if (activeCategory === "men") filtered = filtered.filter((p) => p.gender === "men");
    else if (activeCategory === "women") filtered = filtered.filter((p) => p.gender === "women");
    else if (activeCategory === "unisex") filtered = filtered.filter((p) => p.gender === "unisex");
    else if (activeCategory === "bestsellers") filtered = filtered.filter((p) => p.isBestSeller);
    else if (activeCategory === "new") filtered = filtered.filter((p) => p.isNewArrival);

    return filterAndSortProducts(filtered, filterOptions);
  }, [initialProducts, activeCategory, filterOptions]);

  return (
    <div className="w-full font-sans">
      {/* PRODUCT GRID & FILTERS SECTION */}
      <Container size="wide" className="pt-8 pb-12">
        {/* CIRCULAR CATEGORY FILTER ICONS ROW */}
        <div className="w-full mb-10 overflow-x-auto scrollbar-none py-2 relative">
          <div className="flex items-center justify-start lg:justify-between gap-8 sm:gap-12 lg:gap-14 min-w-max">
            {/* 1. All Perfumes */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
              }}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === "all"
                    ? "bg-[#E5D7FA] text-[#121A2D] shadow-sm scale-105"
                    : "bg-[#F0ECE5] text-[#121A2D] hover:bg-[#E7E2D8]"
                  }`}
              >
                {/* Flower Bouquet Icon */}
                <svg className="w-7 h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-7m0 0a3 3 0 100-6 3 3 0 000 6zm0 0c-2.5 0-4.5-1.5-4.5-4s2-3.5 4.5-3.5 4.5 1 4.5 3.5-2 4-4.5 4z" />
                  <circle cx="12" cy="7" r="1.5" fill="currentColor" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 16c-1.5 1.5-3 1.5-4 1m10-1c1.5 1.5 3 1.5 4 1" />
                </svg>
              </div>
              <span
                className={`text-xs font-sans tracking-tight ${activeCategory === "all" ? "text-[#121A2D] font-bold" : "text-[#4A4E5A] font-medium"
                  }`}
              >
                All Perfumes
              </span>
            </button>

            {/* 2. Men */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("men");
              }}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === "men"
                    ? "bg-[#E5D7FA] text-[#121A2D] shadow-sm scale-105"
                    : "bg-[#F0ECE5] text-[#121A2D] hover:bg-[#E7E2D8]"
                  }`}
              >
                {/* Necktie Icon */}
                <svg className="w-7 h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2 2-2 2-2-2 2-2zm-2 4h4l1.5 12-3.5 2-3.5-2L10 7z" />
                </svg>
              </div>
              <span
                className={`text-xs font-sans tracking-tight ${activeCategory === "men" ? "text-[#121A2D] font-bold" : "text-[#4A4E5A] font-medium"
                  }`}
              >
                Men
              </span>
            </button>

            {/* 3. Women */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("women");
              }}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === "women"
                    ? "bg-[#E5D7FA] text-[#121A2D] shadow-sm scale-105"
                    : "bg-[#F0ECE5] text-[#121A2D] hover:bg-[#E7E2D8]"
                  }`}
              >
                {/* Lotus Flower Icon */}
                <svg className="w-7 h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4c-3 4-7 7-7 12a7 7 0 0014 0c0-5-4-8-7-12z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.5 3-4 5-4 8a4 4 0 008 0c0-3-2.5-5-4-8z" />
                </svg>
              </div>
              <span
                className={`text-xs font-sans tracking-tight ${activeCategory === "women" ? "text-[#121A2D] font-bold" : "text-[#4A4E5A] font-medium"
                  }`}
              >
                Women
              </span>
            </button>

            {/* 4. Unisex */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("unisex");
              }}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === "unisex"
                    ? "bg-[#E5D7FA] text-[#121A2D] shadow-sm scale-105"
                    : "bg-[#F0ECE5] text-[#121A2D] hover:bg-[#E7E2D8]"
                  }`}
              >
                {/* Interlocking Circles Icon */}
                <svg className="w-7 h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                  <circle cx="9" cy="12" r="5" />
                  <circle cx="15" cy="12" r="5" />
                </svg>
              </div>
              <span
                className={`text-xs font-sans tracking-tight ${activeCategory === "unisex" ? "text-[#121A2D] font-bold" : "text-[#4A4E5A] font-medium"
                  }`}
              >
                Unisex
              </span>
            </button>

            {/* 5. Best Sellers */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("bestsellers");
              }}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === "bestsellers"
                    ? "bg-[#E5D7FA] text-[#121A2D] shadow-sm scale-105"
                    : "bg-[#F0ECE5] text-[#121A2D] hover:bg-[#E7E2D8]"
                  }`}
              >
                {/* Star Icon */}
                <svg className="w-7 h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span
                className={`text-xs font-sans tracking-tight ${activeCategory === "bestsellers" ? "text-[#121A2D] font-bold" : "text-[#4A4E5A] font-medium"
                  }`}
              >
                Best Sellers
              </span>
            </button>

            {/* 6. New Arrivals */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("new");
              }}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === "new"
                    ? "bg-[#E5D7FA] text-[#121A2D] shadow-sm scale-105"
                    : "bg-[#F0ECE5] text-[#121A2D] hover:bg-[#E7E2D8]"
                  }`}
              >
                {/* Scalloped Circle Badge Icon */}
                <svg className="w-7 h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                  <circle cx="12" cy="12" r="9" strokeDasharray="3 2" />
                  <text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none" className="uppercase font-sans">
                    NEW
                  </text>
                </svg>
              </div>
              <span
                className={`text-xs font-sans tracking-tight ${activeCategory === "new" ? "text-[#121A2D] font-bold" : "text-[#4A4E5A] font-medium"
                  }`}
              >
                New Arrivals
              </span>
            </button>

            {/* 7. Gift Sets */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("gift");
              }}
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === "gift"
                    ? "bg-[#E5D7FA] text-[#121A2D] shadow-sm scale-105"
                    : "bg-[#F0ECE5] text-[#121A2D] hover:bg-[#E7E2D8]"
                  }`}
              >
                {/* Gift Box Icon */}
                <svg className="w-7 h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v10H4V12M2 7h20v5H2zM12 7V22M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
              </div>
              <span
                className={`text-xs font-sans tracking-tight ${activeCategory === "gift" ? "text-[#121A2D] font-bold" : "text-[#4A4E5A] font-medium"
                  }`}
              >
                Gift Sets
              </span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-[#686D7A] font-sans">
            Showing <strong className="text-[#121A2D] font-semibold">{products.length}</strong> of {initialProducts.length} products
          </span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={idx < 4}
                onQuickAdd={(prod, variant) => {
                  addItem({
                    id: `${prod.id}-${variant.id}`,
                    productId: prod.id,
                    variantId: variant.id,
                    title: prod.title,
                    size: variant.size,
                    price: variant.price,
                    quantity: 1,
                    image: prod.images?.[0] || "",
                    sku: variant.sku,
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#FAF9F5] rounded-3xl border border-dashed border-gray-300">
            <h3 className="font-serif text-2xl text-[#121A2D] font-semibold mb-2">
              No Fragrances Found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
              There are no perfumes matching your currently selected filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
              }}
              className="px-6 py-2.5 bg-[#121A2D] text-white text-xs uppercase tracking-widest font-medium rounded-full"
            >
              Reset Filters
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};
