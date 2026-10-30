"use client";

import React, { useState } from "react";
import { Product, ProductVariant } from "../types";
import { InteractiveTravelCard } from "@/components/ui/InteractiveTravelCard";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";

export interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product, variant: ProductVariant) => void;
  onWishlistToggle?: (product: Product) => void;
  isWishlisted?: boolean;
  priority?: boolean;
  className?: string;
  titleClassName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickAdd,
  onWishlistToggle,
  isWishlisted: propIsWishlisted,
  className = "",
  titleClassName,
}) => {
  const [added, setAdded] = useState(false);
  const { hasItem, toggleItem } = useWishlist();

  const isWishlisted =
    propIsWishlisted !== undefined ? propIsWishlisted : hasItem(product.id) || hasItem(product.slug);

  const selectedVariant: ProductVariant | undefined =
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : undefined;

  const currentPrice = selectedVariant ? selectedVariant.price : 3000;
  const originalPrice =
    selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice > currentPrice
      ? selectedVariant.compareAtPrice
      : Math.round(currentPrice * 1.16);
  const rawImage = product.images?.[0];
  const primaryImage =
    typeof rawImage === "string"
      ? rawImage
      : (rawImage as { url?: string } | undefined)?.url || "/images/perfumes/vivid-desire-still-life.png";

  const handleAddToCart = () => {
    if (onQuickAdd && selectedVariant) {
      onQuickAdd(product, selectedVariant);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const badgeText = product.isBestSeller
    ? "Best Seller"
    : product.isNewArrival
      ? "New"
      : "Signature";

  const stockText = `${selectedVariant?.stock || 9} left`;

  const isLuxuryFramed = [
    "whispers-bloom",
    "pulse",
    "dusk",
    "vivid-desire",
    "noble-ocean",
    "infinite-boss",
    "eternal-blaze",
    "secret-garden",
    "suroor",
    "gentle-man",
    "elite-fusion",
    "crown-legacy",
    "sultans-veil",
    "velvet-orchid",
    "blue-horizon",
  ].includes(product.slug);

  return (
    <article className={`flex justify-center w-full ${className}`}>
      <InteractiveTravelCard
        title={product.title}
        titleClassName={titleClassName}
        subtitle={selectedVariant?.size || "50ml"}
        stockBadge={stockText}
        overview={product.shortDescription || product.description || ""}
        rating={product.rating || 5}
        ratingCount={product.ratingCount || 124}
        imageUrl={primaryImage}
        price={currentPrice}
        originalPrice={originalPrice}
        currency="Rs."
        badge={badgeText}
        discountBadge="14% off"
        href={`/perfumes/${product.slug}`}
        actionText="Add to cart"
        onActionClick={handleAddToCart}
        isAdded={added}
        isWishlisted={isWishlisted}
        onWishlistToggle={() => {
          if (onWishlistToggle) {
            onWishlistToggle(product);
          } else {
            toggleItem({
              id: product.id,
              title: product.title,
              slug: product.slug,
              price: currentPrice,
              originalPrice: originalPrice,
              size: selectedVariant?.size || "50ml",
              image: primaryImage,
              description: product.shortDescription || product.description,
            });
          }
        }}
        imageClassName={
          isLuxuryFramed
            ? "!h-[110%] !object-cover !object-top !-translate-y-4 min-[380px]:!-translate-y-5 sm:!-translate-y-8"
            : "!h-[114%] !object-cover !object-top !-translate-y-4 min-[380px]:!-translate-y-5 sm:!-translate-y-8"
        }
      />
    </article>
  );
};
