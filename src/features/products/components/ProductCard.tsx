"use client";

import React, { useState } from "react";
import { Product, ProductVariant } from "../types";
import { InteractiveTravelCard } from "@/components/ui/InteractiveTravelCard";

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
  isWishlisted,
  className = "",
}) => {
  const [added, setAdded] = useState(false);

  const selectedVariant: ProductVariant | undefined =
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : undefined;

  const currentPrice = selectedVariant ? selectedVariant.price : 3000;
  const originalPrice = selectedVariant?.compareAtPrice || 3500;
  const primaryImage = product.images?.[0] || "/images/perfumes/elite-fusion.png";

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

  return (
    <article className={`flex justify-center w-full ${className}`}>
      <InteractiveTravelCard
        title={product.title}
        subtitle={selectedVariant?.size || "50ml"}
        stockBadge={stockText}
        overview={product.shortDescription || product.description || ""}
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
        onWishlistToggle={onWishlistToggle ? () => onWishlistToggle(product) : undefined}
      />
    </article>
  );
};
