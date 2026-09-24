"use client";

import React, { useState, useMemo } from "react";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { filterAndSortProducts, FilterOptions } from "../utils";
import { useCart } from "@/features/cart/hooks/useCart";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";

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

  // Active Category & Filter States
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<FilterOptions["sort"]>("featured");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Compute filtered & sorted products
  const filterOptions: FilterOptions = useMemo(
    () => ({
      gender: selectedGender,
      collection: selectedCollection,
      sort: selectedSort,
      page: 1,
      limit: itemsPerPage,
    }),
    [selectedGender, selectedCollection, selectedSort, itemsPerPage]
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
      {/* 01 — FULL SCREEN WIDTH HERO & FILTER HEADER (Exact match to Reference Screenshot) */}
      <section className="relative w-full bg-[#FBF9F5] border-b border-[#EAE4D9] pt-10 sm:pt-14 lg:pt-16 pb-10 sm:pb-12 px-6 sm:px-12 lg:px-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          {/* Top Hero Heading & Right Slogan Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 sm:mb-16">
            {/* Left Column: Kicker, Title & Subtitle */}
            <div className="lg:col-span-8 flex flex-col items-start text-left z-10">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.24em] font-semibold text-[#8C8F9A] font-sans mb-4">
                FRAGRANCES FOR A HIGHER YOU
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#121A2D] font-normal tracking-tight mb-5 leading-[1.08]">
                Find Your Signature
              </h1>

              <p className="text-sm sm:text-base text-[#686D7A] font-sans font-normal max-w-xl leading-relaxed">
                Timeless fragrances. Modern expressions. Explore our curated collections crafted for every mood, every moment.
              </p>
            </div>

            {/* Right Column: Slogan with Line Accent */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-start pt-2 z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-8 h-[1px] bg-gray-400 hidden sm:block" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-medium text-[#686D7A]">
                  MORE THAN A SCENT
                </span>
              </div>
              <span className="text-xs sm:text-sm uppercase tracking-[0.26em] font-serif font-bold text-[#121A2D]">
                A STATE OF MIND
              </span>
            </div>
          </div>

          {/* Elegant Purple Wave Graphic Lines SVG (Positioned high in top-right, strictly above category circles) */}
          <div className="absolute right-0 top-10 w-7/12 h-44 sm:h-52 pointer-events-none hidden lg:block overflow-hidden z-0 opacity-60">
            <svg className="w-full h-full" viewBox="0 0 700 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 105 C 200 40, 450 150, 700 75" stroke="#C084FC" strokeWidth="1.2" fill="none" />
              <path d="M40 113 C 200 48, 450 158, 700 83" stroke="#D8B4FE" strokeWidth="1" fill="none" />
              <path d="M40 121 C 200 56, 450 166, 700 91" stroke="#E9D5FF" strokeWidth="0.8" fill="none" />
              <path d="M40 97 C 200 32, 450 142, 700 67" stroke="#A855F7" strokeWidth="0.9" fill="none" />
              <path d="M40 89 C 200 24, 450 134, 700 59" stroke="#DDD0F5" strokeWidth="0.7" fill="none" />
              <path d="M40 129 C 200 64, 450 174, 700 99" stroke="#F3EFEA" strokeWidth="0.6" fill="none" />
            </svg>
          </div>

          {/* 02 — CIRCULAR CATEGORY FILTER ICONS ROW (Exact match to Reference Screenshot with Generous Spacing) */}
          <div className="w-full mb-12 sm:mb-14 overflow-x-auto scrollbar-none py-3 z-10 relative">
            <div className="flex items-center justify-start lg:justify-between gap-8 sm:gap-12 lg:gap-14 min-w-max">
              {/* 1. All Perfumes */}
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setSelectedGender("all");
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
                  setSelectedGender("men");
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
                  setSelectedGender("women");
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
                  setSelectedGender("unisex");
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

          {/* 03 — FILTER & SORT TOOLBAR (Exact match to Reference Screenshot) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            {/* Left Side: White Pill Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className="px-5 py-2.5 bg-white rounded-full border border-[#4E4473] text-xs font-semibold text-[#121A2D] flex items-center gap-2 shadow-2xs hover:bg-gray-50 transition-colors"
              >
                <Icons.Filter size={14} className="text-[#121A2D]" />
                <span>Filter</span>
              </button>

              {/* Gender v */}
              <button
                type="button"
                onClick={() =>
                  setSelectedGender((prev) => (prev === "men" ? "women" : prev === "women" ? "unisex" : prev === "unisex" ? "all" : "men"))
                }
                className="px-4 py-2.5 bg-white rounded-full border border-gray-200 text-xs font-medium text-[#121A2D] flex items-center gap-1.5 shadow-2xs hover:bg-gray-50 transition-colors"
              >
                <span>Gender</span>
                <span className="text-[10px] text-gray-500">∨</span>
              </button>

              {/* Collection v */}
              <button
                type="button"
                onClick={() =>
                  setSelectedCollection((prev) => (prev === "col-platinum" ? "all" : "col-platinum"))
                }
                className="px-4 py-2.5 bg-white rounded-full border border-gray-200 text-xs font-medium text-[#121A2D] flex items-center gap-1.5 shadow-2xs hover:bg-gray-50 transition-colors"
              >
                <span>Collection</span>
                <span className="text-[10px] text-gray-500">∨</span>
              </button>

              {/* Price v */}
              <button
                type="button"
                className="px-4 py-2.5 bg-white rounded-full border border-gray-200 text-xs font-medium text-[#121A2D] flex items-center gap-1.5 shadow-2xs hover:bg-gray-50 transition-colors"
              >
                <span>Price</span>
                <span className="text-[10px] text-gray-500">∨</span>
              </button>

              {/* Fragrance Family v */}
              <button
                type="button"
                className="px-4 py-2.5 bg-white rounded-full border border-gray-200 text-xs font-medium text-[#121A2D] flex items-center gap-1.5 shadow-2xs hover:bg-gray-50 transition-colors"
              >
                <span>Fragrance Family</span>
                <span className="text-[10px] text-gray-500">∨</span>
              </button>
            </div>

            {/* Right Side: Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#686D7A] font-sans">Sort by:</span>
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value as FilterOptions["sort"])}
                  className="appearance-none px-5 py-2.5 bg-white rounded-full border border-gray-200 text-xs font-semibold text-[#121A2D] pr-8 focus:outline-none cursor-pointer shadow-2xs"
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Alphabetical (A–Z)</option>
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 pointer-events-none">
                  ∨
                </span>
              </div>
            </div>
          </div>

          {/* Expandable Quick Filter Drawer */}
          {isFilterOpen && (
            <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-200 flex flex-wrap gap-4 items-center justify-between shadow-xs">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-semibold text-[#121A2D]">Active Filters:</span>
                <span className="bg-[#FAF9F5] px-3 py-1 rounded-full border border-gray-200 text-gray-700">
                  Gender: {selectedGender}
                </span>
                <span className="bg-[#FAF9F5] px-3 py-1 rounded-full border border-gray-200 text-gray-700">
                  Collection: {selectedCollection}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setSelectedGender("all");
                  setSelectedCollection("all");
                }}
                className="text-xs text-red-600 font-medium underline"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 03 — PRODUCT GRID SECTION (In Centered Container below Hero) */}
      <Container size="wide" className="py-10">
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
                setSelectedGender("all");
                setSelectedCollection("all");
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
