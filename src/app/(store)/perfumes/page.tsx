import React, { Suspense } from "react";
import { constructMetadata } from "@/lib/seo/metadata";
import { ProductDiscoveryView } from "@/features/products/components/ProductDiscoveryView";
import { allProducts } from "@/features/products/data/products";
import { ProductCatalogSkeleton } from "@/features/products/components/ProductCatalogSkeleton";

export const metadata = constructMetadata({
  title: "Perfumes & Extraits | Soulmate Scents",
  description:
    "Discover handcrafted luxury perfumes and rare scent formulations from Soulmate Scents.",
  canonical: "/perfumes",
});

export default function PerfumesPage() {
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
