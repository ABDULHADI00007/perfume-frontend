"use client";

import React from "react";
import { Product, ProductVariant } from "../types";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Icons } from "@/components/ui/icons";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";

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
  const { hasItem, toggleItem } = useWishlist();
  const isWishlisted = hasItem(product.id) || hasItem(product.slug);
  const ratingCount = product.ratingCount || 91;
  const unitPrice = selectedVariant ? selectedVariant.price : 13500;
  const currentPrice = unitPrice * quantity;
  const unitOriginalPrice =
    selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice > unitPrice
      ? selectedVariant.compareAtPrice
      : Math.round(unitPrice * 1.16);
  const originalPrice = unitOriginalPrice * quantity;
  const discountPct = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  const handleToggleWishlist = () => {
    const rawImage = product.images?.[0];
    const primaryImage =
      typeof rawImage === "string"
        ? rawImage
        : (rawImage as { url?: string } | undefined)?.url || "/images/perfumes/vivid-desire-still-life.png";

    toggleItem({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: selectedVariant ? selectedVariant.price : 3000,
      originalPrice: selectedVariant?.compareAtPrice,
      size: selectedVariant?.size || "50ml",
      image: primaryImage,
      description: product.shortDescription || product.description,
    });
  };

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

      {/* Star Ratings (Enlarged Luxury Stars) */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((starNum) => {
            const isFilled = starNum <= Math.round(Number(product.rating) || 5);
            return (
              <svg
                key={starNum}
                className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 transition-transform ${
                  isFilled
                    ? "fill-[#F97316] text-[#F97316] drop-shadow-[0_1px_2px_rgba(249,115,22,0.35)]"
                    : "fill-[#D1C7BA] text-[#D1C7BA]"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          })}
        </div>
        <span className="text-xs sm:text-sm text-stone-500 font-sans font-medium">
          ({ratingCount} reviews)
        </span>
      </div>

      {/* Price Display with Compare Price below (matching card styling) */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight">
            {formatCurrency(currentPrice)}
          </span>
          {originalPrice > currentPrice && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] sm:text-xs font-semibold bg-[#590B16]/10 text-[#590B16] font-sans">
              {discountPct}% OFF
            </span>
          )}
        </div>
        {originalPrice > currentPrice && (
          <span className="text-sm sm:text-base line-through text-[#6F655B] font-sans mt-0.5">
            {formatCurrency(originalPrice)}
          </span>
        )}
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
          onClick={handleToggleWishlist}
          className={`p-3 min-h-[46px] min-w-[46px] rounded-lg border flex items-center justify-center transition-all bg-white shadow-xs cursor-pointer active:scale-95 ${isWishlisted ? "text-[#590B16] border-[#590B16]/30 bg-[#590B16]/10" : "text-stone-700 border-[#E6E0D3] hover:border-[#590B16]"
            }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Icons.Heart
            size={18}
            className={isWishlisted ? "fill-[#590B16] stroke-[#590B16] text-[#590B16]" : "stroke-stone-700 stroke-[2] fill-none"}
          />
        </button>
      </div>

      {/* Trust Badges Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2 pt-6 border-t border-stone-200 text-[11px] text-stone-600 font-sans">
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
