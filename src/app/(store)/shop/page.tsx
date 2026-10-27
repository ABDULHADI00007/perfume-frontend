import React, { Suspense } from "react";
import { constructMetadata } from "@/lib/seo/metadata";
import { ProductDiscoveryView } from "@/features/products/components/ProductDiscoveryView";
import { allProducts } from "@/features/products/data/products";
import { ProductCatalogSkeleton } from "@/features/products/components/ProductCatalogSkeleton";

export const metadata = constructMetadata({
  title: "Shop All Fragrances | Soulmate Scents",
  description:
    "Explore the complete Soulmate Scents catalog of extraits de parfum and luxury fragrances.",
  canonical: "/shop",
});

export default function ShopPage() {
  return (
    <main className="w-full bg-white min-h-screen">
      <Suspense fallback={<ProductCatalogSkeleton cardCount={16} />}>
        <ProductDiscoveryView
          initialProducts={allProducts}
          itemsPerPage={16}
        />
      </Suspense>
    </main>
  );
}
