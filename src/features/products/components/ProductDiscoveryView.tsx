"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { filterAndSortProducts, FilterOptions } from "../utils";
import { useCart } from "@/features/cart/hooks/useCart";
import { Container } from "@/components/layout/Container";
import { ProductCatalogSkeleton } from "./ProductCatalogSkeleton";

export interface ProductDiscoveryViewProps {
  initialProducts: Product[];
  title?: string;
  subtitle?: string;
  fixedCollectionId?: string;
  itemsPerPage?: number;
}

export const ProductDiscoveryView: React.FC<ProductDiscoveryViewProps> = ({
  initialProducts,
  title = "Luxury Perfumes & Extraits",
  subtitle = "Soulmate Scents crafts high-concentration Eau de Parfum fragrances using imported oils for 10 to 14 hours of lasting wear across Pakistan.",
  itemsPerPage = 16,
}) => {
  const { addItem } = useCart();
  const isInitialLoading = initialProducts.length === 0;

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

  const isPremiumProduct = (product: Product): boolean => {
    // 1. Dynamic category check
    const catSlug = (product.categorySlug || "").toLowerCase();
    const catName = (product.categoryName || "").toLowerCase();
    const catId = (product.categoryId || "").toLowerCase();
    if (catSlug.includes("premium") || catName.includes("premium") || catId.includes("premium")) {
      return true;
    }
    if (catSlug.includes("gold") || catName.includes("gold") || catId.includes("gold")) {
      return false;
    }

    // 2. Fallback to slug / title matches for static catalog items
    const slug = (product.slug || "").toLowerCase();
    const id = product.id || "";
    const title = (product.title || "").toLowerCase();
    return (
      id === "prod-01" ||
      id === "prod-02" ||
      id === "prod-03" ||
      id === "prod-04" ||
      id === "prod-05" ||
      slug === "elite-fusion" ||
      slug === "crown-legacy" ||
      slug === "sultans-veil" ||
      slug === "blue-horizon" ||
      slug === "velvet-orchid" ||
      title.includes("elite fusion") ||
      title.includes("crown legacy") ||
      title.includes("sultan") ||
      title.includes("blue horizon") ||
      title.includes("velvet orchid")
    );
  };

  const { products } = useMemo(() => {
    let filtered = initialProducts;
    if (activeCategory === "men") {
      filtered = filtered.filter((p) => (p.gender || "").toLowerCase() === "men");
    } else if (activeCategory === "women") {
      filtered = filtered.filter((p) => (p.gender || "").toLowerCase() === "women");
    } else if (activeCategory === "unisex") {
      filtered = filtered.filter((p) => (p.gender || "").toLowerCase() === "unisex");
    } else if (activeCategory === "bestsellers") {
      filtered = filtered.filter((p) => p.isBestSeller);
    } else if (activeCategory === "premium") {
      filtered = filtered.filter((p) => isPremiumProduct(p));
    } else if (activeCategory === "gold") {
      filtered = filtered.filter((p) => !isPremiumProduct(p));
    }

    return filterAndSortProducts(filtered, filterOptions);
  }, [initialProducts, activeCategory, filterOptions]);

  if (isInitialLoading) {
    return <ProductCatalogSkeleton cardCount={itemsPerPage} />;
  }

  return (
    <div className="w-full font-sans">
      {/* PRODUCT GRID & FILTERS SECTION */}
      <Container size="wide" className="pt-4 sm:pt-6 pb-10 sm:pb-12 px-3 sm:px-6 lg:px-8">
        {/* BREADCRUMB & PAGE TITLE (SINGLE H1 FOR SEO/AEO/GEO CLARITY) */}
        <header className="mb-5 sm:mb-7 border-b border-[#EADECF]/70 pb-4 sm:pb-5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-stone-500 mb-2">
            <Link href="/" className="hover:text-[#590B16] transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#590B16] font-semibold">Perfumes</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <h1
                id="catalog-heading"
                className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-[#0D1424]"
              >
                {title}
              </h1>
              <p className="speakable-intro text-xs sm:text-sm text-stone-600 font-sans mt-1.5 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            </div>
            <div className="text-[11px] text-stone-500 font-sans shrink-0">
              Collection Updated{" "}
              <time dateTime="2026-11-11" className="font-medium text-stone-700">
                Nov 2026
              </time>
            </div>
          </div>
        </header>

        {/* CIRCULAR CATEGORY FILTER ICONS ROW */}
        <div className="w-full mb-6 sm:mb-10 overflow-x-auto scrollbar-none py-1 sm:py-2 relative">
          <div className="flex items-center justify-start lg:justify-between gap-4 min-[380px]:gap-6 sm:gap-10 lg:gap-14 min-w-max px-1">
            {/* 1. All Perfumes */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
              }}
              className="flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 min-[380px]:w-16 min-[380px]:h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === "all"
                    ? "bg-[#FBD0D5] text-[#590B16] shadow-sm scale-105 border border-[#590B16]/25"
                    : "bg-[#F0ECE5] text-[#121A2D] hover:bg-[#FDE2E5] hover:text-[#590B16]"
                  }`}
              >
                {/* Flower Bouquet Icon */}
                <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-7m0 0a3 3 0 100-6 3 3 0 000 6zm0 0c-2.5 0-4.5-1.5-4.5-4s2-3.5 4.5-3.5 4.5 1 4.5 3.5-2 4-4.5 4z" />
                  <circle cx="12" cy="7" r="1.5" fill="currentColor" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 16c-1.5 1.5-3 1.5-4 1m10-1c1.5 1.5 3 1.5 4 1" />
                </svg>
              </div>
              <span
                className={`text-[11px] min-[380px]:text-xs font-sans tracking-tight transition-colors ${activeCategory === "all" ? "text-[#590B16] font-bold" : "text-[#4A4E5A] font-medium group-hover:text-[#590B16]"
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
              className="flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 min-[380px]:w-16 min-[380px]:h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === "men"
                    ? "bg-[#FBD0D5] text-[#590B16] shadow-sm scale-105 border border-[#590B16]/25"
                    : "bg-[#F0ECE5] text-[#121A2D] hover:bg-[#FDE2E5] hover:text-[#590B16]"
                  }`}
              >
                {/* Necktie Icon */}
                <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2 2-2 2-2-2 2-2zm-2 4h4l1.5 12-3.5 2-3.5-2L10 7z" />
                </svg>
              </div>
              <span
                className={`text-[11px] min-[380px]:text-xs font-sans tracking-tight transition-colors ${activeCategory === "men" ? "text-[#590B16] font-bold" : "text-[#4A4E5A] font-medium group-hover:text-[#590B16]"
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
              className="flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 min-[380px]:w-16 min-[380px]:h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === "women"
                    ? "bg-[#FBD0D5] text-[#590B16] shadow-sm scale-105 border border-[#590B16]/25"
                    : "bg-[#F0ECE5] text-[#121A2D] hover:bg-[#FDE2E5] hover:text-[#590B16]"
                  }`}
              >
                {/* Lotus Flower Icon */}
                <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4c-3 4-7 7-7 12a7 7 0 0014 0c0-5-4-8-7-12z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.5 3-4 5-4 8a4 4 0 008 0c0-3-2.5-5-4-8z" />
                </svg>
              </div>
              <span
                className={`text-[11px] min-[380px]:text-xs font-sans tracking-tight transition-colors ${activeCategory === "women" ? "text-[#590B16] font-bold" : "text-[#4A4E5A] font-medium group-hover:text-[#590B16]"
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
              className="flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 min-[380px]:w-16 min-[380px]:h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === "unisex"
                    ? "bg-[#FBD0D5] text-[#590B16] shadow-sm scale-105 border border-[#590B16]/25"
                    : "bg-[#F0ECE5] text-[#121A2D] hover:bg-[#FDE2E5] hover:text-[#590B16]"
                  }`}
              >
                {/* Interlocking Circles Icon */}
                <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                  <circle cx="9" cy="12" r="5" />
                  <circle cx="15" cy="12" r="5" />
                </svg>
              </div>
              <span
                className={`text-[11px] min-[380px]:text-xs font-sans tracking-tight transition-colors ${activeCategory === "unisex" ? "text-[#590B16] font-bold" : "text-[#4A4E5A] font-medium group-hover:text-[#590B16]"
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
              className="flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 min-[380px]:w-16 min-[380px]:h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === "bestsellers"
                    ? "bg-[#FBD0D5] text-[#590B16] shadow-sm scale-105 border border-[#590B16]/25"
                    : "bg-[#F0ECE5] text-[#121A2D] hover:bg-[#FDE2E5] hover:text-[#590B16]"
                  }`}
              >
                {/* Star Icon */}
                <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span
                className={`text-[11px] min-[380px]:text-xs font-sans tracking-tight transition-colors ${activeCategory === "bestsellers" ? "text-[#590B16] font-bold" : "text-[#4A4E5A] font-medium group-hover:text-[#590B16]"
                  }`}
              >
                Best Sellers
              </span>
            </button>

            {/* 6. Premium Collection */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("premium");
              }}
              className="flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 min-[380px]:w-16 min-[380px]:h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === "premium"
                    ? "bg-[#FBD0D5] text-[#590B16] shadow-sm scale-105 border border-[#590B16]/25"
                    : "bg-[#F0ECE5] text-[#121A2D] hover:bg-[#FDE2E5] hover:text-[#590B16]"
                  }`}
              >
                {/* Diamond Gem Icon for Premium */}
                <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9l4-6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20M10 3l-2 6 4 12 4-12-2-6" />
                </svg>
              </div>
              <span
                className={`text-[11px] min-[380px]:text-xs font-sans tracking-tight transition-colors ${activeCategory === "premium" ? "text-[#590B16] font-bold" : "text-[#4A4E5A] font-medium group-hover:text-[#590B16]"
                  }`}
              >
                Premium
              </span>
            </button>

            {/* 7. Gold Edition */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("gold");
              }}
              className="flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 min-[380px]:w-16 min-[380px]:h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 ${activeCategory === "gold"
                    ? "bg-[#FBD0D5] text-[#590B16] shadow-sm scale-105 border border-[#590B16]/25"
                    : "bg-[#F0ECE5] text-[#121A2D] hover:bg-[#FDE2E5] hover:text-[#590B16]"
                  }`}
              >
                {/* Royal Crown Icon for Gold */}
                <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 18h16M4 18l2-10 4.5 4L12 6l1.5 6 4.5-4 2 10H4z" />
                  <circle cx="6" cy="7" r="1" fill="currentColor" />
                  <circle cx="12" cy="5" r="1" fill="currentColor" />
                  <circle cx="18" cy="7" r="1" fill="currentColor" />
                </svg>
              </div>
              <span
                className={`text-[11px] min-[380px]:text-xs font-sans tracking-tight transition-colors ${activeCategory === "gold" ? "text-[#590B16] font-bold" : "text-[#4A4E5A] font-medium group-hover:text-[#590B16]"
                  }`}
              >
                Gold Edition
              </span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <span className="text-[11px] sm:text-xs text-[#686D7A] font-sans">
            Showing <strong className="text-[#121A2D] font-semibold">{products.length}</strong> fragrances
          </span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
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
              className="px-6 py-2.5 bg-[#590B16] hover:bg-[#3E060E] active:bg-[#30040A] text-white text-xs uppercase tracking-widest font-semibold rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* OLFACTORY GUIDE & FAQ (AEO / GEO & VOICE SEARCH READINESS) */}
        <section
          aria-labelledby="perfume-faq-heading"
          className="mt-14 pt-10 border-t border-[#EADECF]/80 space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] sm:text-[11px] font-serif font-bold uppercase tracking-[0.25em] text-[#590B16] block mb-1">
                Fragrance Concierge & Specifications
              </span>
              <h2
                id="perfume-faq-heading"
                className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#0D1424]"
              >
                Frequently Asked Questions About Our Perfumes
              </h2>
            </div>
            <nav aria-label="Fragrance Quick Links" className="flex flex-wrap items-center gap-3 text-xs font-sans text-stone-600">
              <a href="#catalog-heading" className="hover:text-[#590B16] underline underline-offset-4">
                Back to Catalog
              </a>
              <span aria-hidden="true">•</span>
              <Link href="/faq" className="hover:text-[#590B16] underline underline-offset-4">
                Full FAQ
              </Link>
              <span aria-hidden="true">•</span>
              <Link href="/shipping" className="hover:text-[#590B16] underline underline-offset-4">
                Shipping
              </Link>
              <span aria-hidden="true">•</span>
              <Link href="/returns" className="hover:text-[#590B16] underline underline-offset-4">
                Returns
              </Link>
              <span aria-hidden="true">•</span>
              <Link href="/contact" className="hover:text-[#590B16] underline underline-offset-4">
                Contact
              </Link>
              <span aria-hidden="true">•</span>
              <Link href="/privacy" className="hover:text-[#590B16] underline underline-offset-4">
                Privacy
              </Link>
              <span aria-hidden="true">•</span>
              <Link href="/terms" className="hover:text-[#590B16] underline underline-offset-4">
                Terms
              </Link>
            </nav>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <article className="p-5 bg-stone-50/80 rounded-2xl border border-stone-200/70">
              <h3 id="faq-concentration" className="font-serif text-sm font-bold text-[#0D1424] mb-2">
                What concentration are Soulmate Scents perfumes?
              </h3>
              <p className="speakable-faq font-sans text-xs sm:text-sm text-stone-600 leading-relaxed">
                Soulmate Scents perfumes are crafted as Extrait de Parfum and Eau de Parfum with 25% to 30% pure aromatic oil concentration.
              </p>
            </article>

            <article className="p-5 bg-stone-50/80 rounded-2xl border border-stone-200/70">
              <h3 id="faq-longevity" className="font-serif text-sm font-bold text-[#0D1424] mb-2">
                How long do Soulmate Scents fragrances last?
              </h3>
              <p className="speakable-faq font-sans text-xs sm:text-sm text-stone-600 leading-relaxed">
                Each bottle delivers 4 to 6 hours of strong projection and stays noticeable on skin and fabric for 10 to 14 hours.
              </p>
            </article>

            <article className="p-5 bg-stone-50/80 rounded-2xl border border-stone-200/70">
              <h3 id="faq-delivery" className="font-serif text-sm font-bold text-[#0D1424] mb-2">
                How can you order perfumes across Pakistan?
              </h3>
              <p className="speakable-faq font-sans text-xs sm:text-sm text-stone-600 leading-relaxed">
                Orders ship nationwide within 24 hours with Cash on Delivery and bank transfer options in Karachi, Lahore, and Islamabad.
              </p>
            </article>
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#EADECF]/70 text-xs">
            <div>
              <dt className="font-serif font-bold uppercase tracking-wider text-[10px] text-[#590B16] mb-1">
                Oil Concentration
              </dt>
              <dd className="font-sans text-stone-700">25%–30% Pure Perfume Oils</dd>
            </div>
            <div>
              <dt className="font-serif font-bold uppercase tracking-wider text-[10px] text-[#590B16] mb-1">
                Wear Longevity
              </dt>
              <dd className="font-sans text-stone-700">10–14 Hours on Fabric</dd>
            </div>
            <div>
              <dt className="font-serif font-bold uppercase tracking-wider text-[10px] text-[#590B16] mb-1">
                Delivery Coverage
              </dt>
              <dd className="font-sans text-stone-700">All Over Pakistan (2–4 Days)</dd>
            </div>
            <div>
              <dt className="font-serif font-bold uppercase tracking-wider text-[10px] text-[#590B16] mb-1">
                Exchange Guarantee
              </dt>
              <dd className="font-sans text-stone-700">7-Day Hassle-Free Returns</dd>
            </div>
          </dl>
        </section>
      </Container>
    </div>
  );
};
