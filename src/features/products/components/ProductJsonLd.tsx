import React from "react";
import { Product } from "../types";

export interface ProductJsonLdProps {
  product: Product;
}

export const ProductJsonLd: React.FC<ProductJsonLdProps> = ({ product }) => {
  const primaryVariant = product.variants?.[0];
  const primaryImage = product.images?.[0] || "/images/perfumes/oyd_royal.png";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription || product.description,
    image: primaryImage.startsWith("http")
      ? primaryImage
      : `https://maison-de-parfum.com${primaryImage}`,
    sku: primaryVariant?.sku || product.slug,
    brand: {
      "@type": "Brand",
      name: "Maison de Parfum",
    },
    offers: product.variants?.map((v) => ({
      "@type": "Offer",
      sku: v.sku,
      price: v.price,
      priceCurrency: "USD",
      availability:
        v.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
