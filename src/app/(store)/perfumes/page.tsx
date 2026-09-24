import React, { Suspense } from "react";
import { constructMetadata } from "@/lib/seo/metadata";
import { ProductDiscoveryView } from "@/features/products/components/ProductDiscoveryView";
import { BrandValuesStrip } from "@/components/storefront/BrandValuesStrip";
import { allProducts } from "@/features/products/data/products";
import { Spinner } from "@/components/ui/spinner";

export const metadata = constructMetadata({
  title: "Perfumes & Extraits | Soulmate Scents",
  description:
    "Discover handcrafted luxury perfumes and rare scent formulations from Soulmate Scents.",
  canonical: "/perfumes",
});

export default function PerfumesPage() {
  return (
    <main className="w-full bg-[#FAF8F5] min-h-screen">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-32">
            <Spinner size="lg" />
          </div>
        }
      >
        <ProductDiscoveryView
          initialProducts={allProducts}
          itemsPerPage={16}
        />
      </Suspense>
      <BrandValuesStrip />
    </main>
  );
}
