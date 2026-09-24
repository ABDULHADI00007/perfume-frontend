import { siteConfig } from "@/config/site";

export interface ProductJsonLdProps {
  name: string;
  description: string;
  images: string[];
  sku: string;
  price: number;
  currency?: string;
  inStock?: boolean;
  slug: string;
}

export function generateProductJsonLd({
  name,
  description,
  images,
  sku,
  price,
  currency = "USD",
  inStock = true,
  slug,
}: ProductJsonLdProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: images,
    sku,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/perfumes/${slug}`,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}
