"use client";

import React, { useState } from "react";
import { Product, ProductVariant } from "../types";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Icons } from "@/components/ui/icons";

export interface ProductInfoPanelProps {
  product: Product;
  collection?: { id: string; title: string; slug: string };
  selectedVariant: ProductVariant;
  onVariantChange?: (variant: ProductVariant) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  isAdding?: boolean;
  isAdded?: boolean;
  className?: string;
}

export const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({
  product,
  selectedVariant,
  onVariantChange,
  quantity,
  onQuantityChange,
  onAddToCart,
  isAdding = false,
  isAdded = false,
  className = "",
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const ratingCount = product.ratingCount || 91;
  const currentPrice = selectedVariant ? selectedVariant.price * quantity : 13500;

  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <div className={`flex flex-col space-y-6 ${className}`}>
      {/* Top Badge */}
      <div>
        <span className="inline-block bg-[#590B16]/10 text-[#590B16] border border-[#590B16]/20 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-sm shadow-xs font-serif">
          BEST SELLER
        </span>
      </div>

      {/* Title & Sub-info */}
      <div className="flex flex-col space-y-1">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-black leading-tight tracking-tight uppercase">
          {product.title}
        </h1>
        <p className="text-xs sm:text-sm font-sans text-stone-500 font-normal">
          {product.concentration || "Eau de Parfum"} &nbsp;|&nbsp; {selectedVariant?.size || "50ml"}
        </p>
        {product.shortDescription && (
          <p className="text-xs sm:text-sm text-stone-700 font-medium italic pt-0.5">
            &ldquo;{product.shortDescription}&rdquo;
          </p>
        )}
      </div>

      {/* Star Ratings */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center text-amber-500 text-sm">
          {"★".repeat(product.rating || 5)}
        </div>
        <span className="text-xs text-stone-500 font-sans">
          ({ratingCount} reviews)
        </span>
      </div>

      {/* Price */}
      <div>
        <span className="font-serif text-3xl sm:text-4xl font-bold text-black">
          {formatCurrency(currentPrice)}
        </span>
      </div>

      {/* Description Paragraph */}
      <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
        {product.description ||
          "A bold and sophisticated fragrance crafted for those who lead with presence. Oud Royale blends rare oud with warm spices, amber and woody notes, creating a scent that leaves a lasting impression."}
      </p>

      {/* Size Selector Pill */}
      <div className="flex flex-col space-y-2.5 pt-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-serif">
          Size
        </span>
        <div className="flex items-center gap-3">
          {product.variants && product.variants.length > 0 ? (
            product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => onVariantChange?.(variant)}
                className={`px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all font-serif ${selectedVariant?.id === variant.id
                  ? "bg-[#590B16] text-white shadow-sm"
                  : "bg-[#FAF7EE] text-stone-700 hover:bg-[#F2ECE1] border border-[#E6E0D3]"
                  }`}
              >
                {variant.size}
              </button>
            ))
          ) : (
            <button
              type="button"
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#590B16] text-white shadow-sm cursor-pointer font-serif"
            >
              {selectedVariant?.size || "50ml"}
            </button>
          )}
        </div>
      </div>

      {/* Quantity & Add to Cart Action Row */}
      <div className="flex items-center gap-3 pt-2">
        {/* Quantity Counter */}
        <div className="flex items-center bg-white border border-[#E6E0D3] rounded-lg px-3 py-2.5 min-h-[46px]">
          <button
            type="button"
            onClick={handleDecrement}
            className="p-1 text-stone-400 hover:text-[#590B16] transition-colors"
            aria-label="Decrease quantity"
          >
            <Icons.Minus size={14} />
          </button>
          <span className="w-8 text-center text-xs font-bold text-black">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            className="p-1 text-stone-400 hover:text-[#590B16] transition-colors"
            aria-label="Increase quantity"
          >
            <Icons.Plus size={14} />
          </button>
        </div>

        {/* Primary Add to Cart Button */}
        <button
          type="button"
          onClick={onAddToCart}
          disabled={isAdding}
          className="flex-1 min-h-[46px] bg-[#590B16] hover:bg-[#3E060E] text-white text-xs font-semibold uppercase tracking-[0.16em] rounded-lg flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-95 cursor-pointer font-serif"
        >
          <Icons.Bag size={16} />
          <span>{isAdded ? "Added to Cart ✓" : "Add to Cart"}</span>
        </button>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={() => setIsWishlisted((prev) => !prev)}
          className={`p-3 min-h-[46px] min-w-[46px] rounded-lg border flex items-center justify-center transition-all bg-white shadow-xs cursor-pointer active:scale-95 ${isWishlisted ? "text-[#590B16] border-[#590B16]/30 bg-[#590B16]/10" : "text-stone-700 border-[#E6E0D3] hover:border-[#590B16]"
            }`}
          aria-label="Add to wishlist"
        >
          <Icons.Heart
            size={18}
            className={isWishlisted ? "fill-[#590B16] stroke-[#590B16] text-[#590B16]" : "stroke-stone-700 stroke-[2] fill-none"}
          />
        </button>
      </div>

      {/* Trust Badges Strip */}
      <div className="grid grid-cols-3 gap-2 pt-6 border-t border-stone-200 text-[11px] text-stone-600 font-sans">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#590B16] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <div>
            <strong className="block font-bold text-black text-[11px]">Free Shipping</strong>
            <span className="text-[10px] text-stone-400">On orders above Rs. 20,000</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#590B16] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <div>
            <strong className="block font-bold text-black text-[11px]">100% Authentic</strong>
            <span className="text-[10px] text-stone-400">Genuine products, always</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#590B16] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 12v10H4V12M2 7h20v5H2zM12 7V22M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
          <div>
            <strong className="block font-bold text-black text-[11px]">Luxury Packaging</strong>
            <span className="text-[10px] text-stone-400">A memorable unboxing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
