import React, { Suspense } from "react";
import { constructMetadata } from "@/lib/seo/metadata";
import { ProductDiscoveryView } from "@/features/products/components/ProductDiscoveryView";
import { allProducts } from "@/features/products/data/products";
import { productService } from "@/features/products/services/productService";
import { ProductCatalogSkeleton } from "@/features/products/components/ProductCatalogSkeleton";
import { CatalogJsonLd } from "@/features/products/components/CatalogJsonLd";
import { Product } from "@/features/products/types";

export const revalidate = 60;

export const metadata = constructMetadata({
  title: "Perfumes & Extraits | Soulmate Scents",
  description:
    "Discover handcrafted luxury perfumes and rare scent formulations from Soulmate Scents.",
  canonical: "/perfumes",
});

async function getLiveProducts(): Promise<Product[]> {
  try {
    const res = await productService.getProducts({ limit: 100 });
    if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
      // Live database products are the primary source of truth
      const liveProducts = res.data;
      const liveSlugs = new Set(liveProducts.map((p) => p.slug).filter(Boolean));
      // Merge with static products only for any legacy slugs not yet in DB
      const fallbackExtras = allProducts.filter((p) => !liveSlugs.has(p.slug));
      return [...liveProducts, ...fallbackExtras];
    }
  } catch {
    // API offline, fallback to static dataset
  }
  return allProducts;
}

export default async function PerfumesPage() {
  const products = await getLiveProducts();

  return (
    <div className="w-full bg-white min-h-screen">
      <CatalogJsonLd
        products={products}
        path="/perfumes"
        title="Perfumes & Extraits | Soulmate Scents"
        description="Discover handcrafted luxury perfumes and rare scent formulations from Soulmate Scents."
      />
      <Suspense fallback={<ProductCatalogSkeleton cardCount={16} />}>
        <ProductDiscoveryView
          initialProducts={products}
          itemsPerPage={16}
        />
      </Suspense>
    </div>
  );
}
