"use client";

import React, { useState } from "react";
import { Product, ProductVariant } from "../types";
import { Collection } from "@/features/collections/types";
import { ProductGallery } from "./ProductGallery";
import { ProductInfoPanel } from "./ProductInfoPanel";
import { useCart } from "@/features/cart/hooks/useCart";

export interface ProductDetailViewProps {
  product: Product;
  collection?: Collection;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  collection,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    () =>
      product.variants?.[0] || {
        id: `${product.id}-default`,
        size: "50ml",
        price: product.variants?.[0]?.price || 12500,
        stock: 20,
        sku: "DEFAULT",
      }
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (selectedVariant.stock <= 0) return;

    setIsAdding(true);
    setTimeout(() => {
      addItem({
        id: `${product.id}-${selectedVariant.id}`,
        productId: product.id,
        variantId: selectedVariant.id,
        title: product.title,
        size: selectedVariant.size,
        price: selectedVariant.price,
        quantity,
        image: product.images?.[0] || "",
        sku: selectedVariant.sku,
      });
      setIsAdding(false);
      setIsAdded(true);

      setTimeout(() => {
        setIsAdded(false);
      }, 3000);
    }, 400);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start w-full">
      {/* Left: Product Gallery (Desktop: 7 cols - Full width, exact height to match right panel) */}
      <div className="lg:col-span-7 lg:sticky lg:top-28">
        <ProductGallery
          images={product.images}
          title={product.title}
          isLimitedEdition={product.isLimitedEdition}
          isBestSeller={product.isBestSeller}
          isNewArrival={product.isNewArrival}
        />
      </div>

      {/* Right: Product Information Panel (Desktop: 5 cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between">
        <ProductInfoPanel
          product={product}
          collection={collection}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
          isAdding={isAdding}
          isAdded={isAdded}
        />
      </div>
    </div>
  );
};
