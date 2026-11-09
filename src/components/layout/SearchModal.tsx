"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ArrowRight, CornerDownLeft, ArrowDown, ArrowUp, Sparkles } from "lucide-react";
import { allProducts } from "@/features/products/data/products";
import { Product } from "@/features/products/types";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
}

const POPULAR_TAGS = [
  "Elite Fusion",
  "Crown Legacy",
  "Blue Horizon",
  "Vivid Desire",
  "Oud",
  "Bergamot",
  "Spicy",
];

const TYPEWRITER_PLACEHOLDERS = [
  "Search 'Elite Fusion'...",
  "Search 'Crown Legacy'...",
  "Search 'Vivid Desire'...",
  "Search by scent notes, oud, or vanilla...",
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for placeholder
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % TYPEWRITER_PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filter products live based on user query
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Return top 4 featured perfumes when search is empty
      return allProducts.slice(0, 4);
    }

    return allProducts.filter((p) => {
      const titleMatch = p.title.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      const noteSummaryMatch = p.notesSummary?.toLowerCase().includes(q);
      const familyMatch = p.olfactoryFamily?.toLowerCase().includes(q);
      const concentrationMatch = p.concentration?.toLowerCase().includes(q);
      const topNotesMatch = p.notes?.top?.some((n) => n.toLowerCase().includes(q));
      const heartNotesMatch = p.notes?.heart?.some((n) => n.toLowerCase().includes(q));
      const baseNotesMatch = p.notes?.base?.some((n) => n.toLowerCase().includes(q));

      return (
        titleMatch ||
        descMatch ||
        noteSummaryMatch ||
        familyMatch ||
        concentrationMatch ||
        topNotesMatch ||
        heartNotesMatch ||
        baseNotesMatch
      );
    });
  }, [query]);

  // Reset selected index when list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredProducts]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!filteredProducts.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredProducts.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredProducts[selectedIndex];
        if (selected) {
          onClose();
          router.push(`/perfumes/${selected.slug}`);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [filteredProducts, selectedIndex, onClose, router]
  );

  const handleSelectProduct = (product: Product) => {
    onClose();
    router.push(`/perfumes/${product.slug}`);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-3 sm:pt-16 md:pt-20 px-2.5 sm:px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Command Palette Card (Responsive for Mobile, Tablet, Desktop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -16 }}
          transition={{ type: "spring", damping: 28, stiffness: 340 }}
          onKeyDown={handleKeyDown}
          className="relative w-full max-w-2xl bg-white border border-[#C5A880]/30 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col font-sans max-h-[90vh] sm:max-h-[82vh]"
        >
          {/* Top Search Input Bar with Cut/Close Button */}
          <div className="relative flex items-center px-3.5 sm:px-6 py-3 sm:py-4 border-b border-stone-100 bg-[#FAF8F5]/90 gap-2">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#590B16] shrink-0" />
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={TYPEWRITER_PLACEHOLDERS[placeholderIndex]}
              className="flex-1 min-w-0 bg-transparent text-sm sm:text-base md:text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none font-sans"
              aria-label="Search perfumes"
            />

            {/* Clear Query Button */}
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors shrink-0"
                aria-label="Clear query"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            ) : null}

            {/* Desktop ESC hint badge */}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] uppercase font-mono font-semibold text-stone-500 bg-stone-100 border border-stone-200 rounded shrink-0">
              ESC
            </kbd>

            {/* Prominent Cut / Close Button (for all Mobile, Tablet, Desktop) */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:p-2 rounded-xl bg-stone-100/90 hover:bg-[#590B16] text-stone-600 hover:text-white transition-all cursor-pointer flex items-center justify-center shrink-0 border border-stone-200/80 hover:border-[#590B16] shadow-2xs"
              aria-label="Close search modal"
              title="Close search"
            >
              <X className="w-4 h-4 sm:w-4 sm:h-4 stroke-[2.2]" />
            </button>
          </div>

          {/* Quick Filter Tags (Horizontal Scrollable on Mobile/Tablet) */}
          <div className="px-3.5 sm:px-6 py-2 sm:py-2.5 bg-[#FAF8F5]/40 border-b border-stone-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            <span className="text-[10px] font-semibold tracking-wider text-stone-400 uppercase mr-1 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C5A880]" /> Popular:
            </span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
                  query.toLowerCase() === tag.toLowerCase()
                    ? "bg-[#590B16] text-white shadow-xs"
                    : "bg-white border border-stone-200 text-stone-600 hover:border-[#590B16]/30 hover:text-[#590B16]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Live Search Results List */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-2 sm:p-3 divide-y divide-stone-50 max-h-[55vh] sm:max-h-[50vh]"
          >
            <div className="px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-stone-400 font-sans">
              {query.trim() ? `Matching Fragrances (${filteredProducts.length})` : "Featured Collections"}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-10 sm:py-12 px-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-stone-400" />
                </div>
                <h4 className="font-serif text-base sm:text-lg font-medium text-stone-800 mb-1">
                  No Fragrances Found
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mb-4">
                  We couldn&apos;t find any fragrance matching &ldquo;{query}&rdquo;. Try searching for notes like Oud, Bergamot, or Rose.
                </p>
                <Link
                  href="/perfumes"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#590B16] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#720E1D] transition-colors"
                >
                  <span>Explore All Fragrances</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              filteredProducts.map((product, index) => {
                const isSelected = index === selectedIndex;
                const primaryImage = product.images?.[0] || "/images/perfumes/collection_crown_legacy.jpg";
                const price = product.variants?.[0]?.price || 13500;

                return (
                  <button
                    key={product.id || product.slug}
                    type="button"
                    onClick={() => handleSelectProduct(product)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left p-2.5 sm:p-3 rounded-xl transition-all flex items-center justify-between gap-2.5 sm:gap-4 group ${
                      isSelected
                        ? "bg-[#FAF7EE] border border-[#C5A880]/40 shadow-xs"
                        : "hover:bg-stone-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                      {/* Perfume Bottle Image */}
                      <div className="w-11 h-13 sm:w-14 sm:h-16 bg-[#FAF8F5] border border-stone-200/80 rounded-lg flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-xs">
                        <Image
                          src={primaryImage}
                          alt={product.title}
                          width={48}
                          height={56}
                          className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Perfume Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <h4 className="font-serif text-sm sm:text-base md:text-lg font-bold text-stone-900 truncate group-hover:text-[#590B16] transition-colors">
                            {product.title}
                          </h4>
                          {product.concentration && (
                            <span className="text-[8.5px] sm:text-[10px] font-sans font-semibold tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-[#590B16]/10 text-[#590B16]">
                              {product.concentration}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs text-stone-500 font-sans truncate mt-0.5 max-w-[190px] sm:max-w-sm md:max-w-md">
                          {product.notesSummary || product.shortDescription || "Luxurious handcrafted extrait"}
                        </p>
                      </div>
                    </div>

                    {/* Price & Action Arrow */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-right">
                      <span className="font-serif text-xs sm:text-base font-bold text-stone-900 group-hover:text-[#590B16] transition-colors whitespace-nowrap">
                        {formatCurrency(price)}
                      </span>
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-[#590B16] text-white"
                            : "text-stone-300 group-hover:text-stone-600 bg-stone-100/60"
                        }`}
                      >
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Bar (Responsive: hints on desktop, clean touch action on mobile) */}
          <div className="px-3.5 sm:px-6 py-2.5 bg-[#FAF8F5] border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-sans">
            <div className="hidden sm:flex items-center gap-4">
              <span className="inline-flex items-center gap-1">
                <ArrowUp className="w-3 h-3 text-stone-400" />
                <ArrowDown className="w-3 h-3 text-stone-400" /> to navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3 text-stone-400" /> to select
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="font-mono text-[9px] bg-white border border-stone-200 px-1 rounded">ESC</kbd> to close
              </span>
            </div>

            <div className="sm:hidden text-[10px] text-stone-400">
              Tap fragrance to view
            </div>

            <Link
              href="/perfumes"
              onClick={onClose}
              className="text-[#590B16] hover:underline font-semibold ml-auto flex items-center gap-1 text-[11px] sm:text-xs"
            >
              <span>View all fragrances</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
