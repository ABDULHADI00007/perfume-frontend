"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, ProductVariant } from "../types";
import { Icons } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product, variant: ProductVariant) => void;
  onWishlistToggle?: (product: Product) => void;
  isWishlisted?: boolean;
  priority?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickAdd,
  onWishlistToggle,
  isWishlisted = false,
  priority = false,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [internalWishlisted, setInternalWishlisted] = useState(isWishlisted);

  React.useEffect(() => {
    setInternalWishlisted(isWishlisted);
  }, [isWishlisted]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !internalWishlisted;
    setInternalWishlisted(nextState);
    if (onWishlistToggle) {
      onWishlistToggle(product);
    }
  };

  const selectedVariant: ProductVariant | undefined =
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : undefined;

  const currentPrice = selectedVariant ? selectedVariant.price : 0;
  const primaryImage = product.images?.[0] || "/images/perfumes/amber-rivera.png";
  const ratingCount = product.ratingCount || 50;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickAdd && selectedVariant) {
      onQuickAdd(product, selectedVariant);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col bg-transparent transition-all duration-300 ${className}`}
    >
      {/* Full Width & Height Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#FAF8F5] border border-black/5 shadow-2xs">
        {/* Top-Left Pill Badge: BEST SELLER / NEW */}
        {product.isBestSeller && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="inline-block bg-[#EFE8DA] text-[#5C4D34] text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-sm shadow-xs">
              BEST SELLER
            </span>
          </div>
        )}

        {!product.isBestSeller && product.isNewArrival && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="inline-block bg-[#EFE8DA] text-[#5C4D34] text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-sm shadow-xs">
              NEW
            </span>
          </div>
        )}

        {/* Top-Right Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={internalWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-20 p-1 text-white transition-transform duration-200 cursor-pointer hover:scale-110 active:scale-95 bg-transparent border-0"
        >
          <Icons.Heart
            size={20}
            className={`transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] ${
              internalWishlisted
                ? "fill-rose-600 stroke-rose-600"
                : "stroke-white stroke-[2] fill-none"
            }`}
          />
        </button>

        {/* Full Bleed Perfume Image */}
        <Link
          href={`/perfumes/${product.slug}`}
          prefetch={false}
          aria-label={`View details for ${product.title}`}
          className="relative block w-full h-full"
        >
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>
      </div>

      {/* Product Details Section Below Image */}
      <div className="mt-3.5 flex flex-col space-y-1">
        {/* Title */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0D1424] tracking-tight group-hover:text-amber-900 transition-colors">
          <Link href={`/perfumes/${product.slug}`} prefetch={false}>
            {product.title}
          </Link>
        </h3>

        {/* Type / Subtitle */}
        <p className="text-xs font-sans text-gray-500 font-normal">
          {product.concentration || "Eau de Parfum"}
        </p>

        {/* Rating Stars & Count */}
        <div className="flex items-center space-x-1.5 pt-1">
          <div className="flex items-center text-amber-500 text-xs">
            {"★".repeat(product.rating || 5)}
          </div>
          <span className="text-xs text-gray-500 font-sans">
            ({ratingCount})
          </span>
        </div>

        {/* Price */}
        <div className="pt-1 pb-3">
          <span className="font-sans font-bold text-base sm:text-lg text-[#0D1424]">
            {formatCurrency(currentPrice)}
          </span>
        </div>

        {/* Pill Add to Cart Button */}
        {selectedVariant && (
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add ${product.title} to cart`}
            className={`w-full py-2.5 px-4 rounded-full border border-[#0B1938] text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
              added || isHovered
                ? "bg-[#0B1938] text-white border-[#0B1938] shadow-sm"
                : "bg-white text-[#0B1938] hover:bg-[#0B1938] hover:text-white"
            }`}
          >
            {added ? (
              <>
                <Icons.Check size={14} />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <Icons.Bag size={14} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
};
