import React, { Suspense } from "react";
import { constructMetadata } from "@/lib/seo/metadata";
import { ProductDiscoveryView } from "@/features/products/components/ProductDiscoveryView";
import { allProducts } from "@/features/products/data/products";
import { productService } from "@/features/products/services/productService";
import { ProductCatalogSkeleton } from "@/features/products/components/ProductCatalogSkeleton";
import { Product } from "@/features/products/types";

export const dynamic = "force-dynamic";

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
      const dynamicMap = new Map<string, Product>();
      res.data.forEach((p) => {
        if (p.slug) dynamicMap.set(p.slug, p);
      });

      const merged = allProducts.map((staticProd) => {
        const live = dynamicMap.get(staticProd.slug);
        return live ? { ...staticProd, ...live } : staticProd;
      });

      return merged;
    }
  } catch {
    // API offline, fallback to static dataset
  }
  return allProducts;
}

export default async function PerfumesPage() {
  const products = await getLiveProducts();

  return (
    <main className="w-full bg-white min-h-screen">
      <Suspense fallback={<ProductCatalogSkeleton cardCount={16} />}>
        <ProductDiscoveryView
          initialProducts={products}
          itemsPerPage={16}
        />
      </Suspense>
    </main>
  );
}
