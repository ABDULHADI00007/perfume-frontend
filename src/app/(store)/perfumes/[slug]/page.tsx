import React from "react";
import { notFound } from "next/navigation";
import { constructMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/layout/Container";
import { allProducts } from "@/features/products/data/products";
import { initialCollections } from "@/features/collections/data/collections";
import { ProductBreadcrumbs } from "@/features/products/components/ProductBreadcrumbs";
import { ProductDetailView } from "@/features/products/components/ProductDetailView";
import { FragranceComposition } from "@/features/products/components/FragranceComposition";
import { RelatedProducts } from "@/features/products/components/RelatedProducts";
import { ProductJsonLd } from "@/features/products/components/ProductJsonLd";
import { productService } from "@/features/products/services/productService";
import { Product } from "@/features/products/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | undefined> {
  try {
    const res = await productService.getProductBySlug(slug);
    if (res.success && res.data) {
      return res.data;
    }
  } catch {
    // API endpoint unreachable or 404, fallback to local dataset
  }
  return allProducts.find((p) => p.slug === slug);
}

export async function generateStaticParams() {
  return allProducts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return constructMetadata({
      title: "Fragrance Not Found",
      noIndex: true,
    });
  }

  const primaryImage = product.images?.[0] || "/images/perfumes/oyd_royal.png";

  return constructMetadata({
    title: `${product.title} | Soulmate Scents`,
    description:
      product.seoDescription ||
      product.shortDescription ||
      product.description ||
      `Experience ${product.title}, a handcrafted ${product.concentration} by Soulmate Scents.`,
    image: primaryImage,
    canonical: `/perfumes/${slug}`,
  });
}

export default async function PerfumeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const collection = product.collectionId
    ? initialCollections.find((c) => c.id === product.collectionId)
    : undefined;

  return (
    <>
      <ProductJsonLd product={product} />

      <main className="py-6 sm:py-10 bg-white min-h-screen">
        <Container size="wide">
          {/* Breadcrumbs Navigation */}
          <div className="mb-6 sm:mb-8">
            <ProductBreadcrumbs
              productTitle={product.title}
              collectionTitle={collection?.title}
              collectionSlug={collection?.slug}
            />
          </div>

          {/* Main Product Showcase: 2-Column Gallery & Info Panel */}
          <ProductDetailView product={product} collection={collection} />

          {/* Tabbed Content: Description, Scent Notes, Details & Checklist */}
          <FragranceComposition
            notes={product.notes}
            concentration={product.concentration}
            olfactoryFamily={product.olfactoryFamily}
            productTitle={product.title}
            description={product.description}
          />

          {/* Curated Related Fragrances Slider */}
          <RelatedProducts currentProduct={product} allProducts={allProducts} />
        </Container>
      </main>
    </>
  );
}
