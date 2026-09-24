import React, { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { constructMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/layout/Container";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { ProductDiscoveryView } from "@/features/products/components/ProductDiscoveryView";
import { initialCollections } from "@/features/collections/data/collections";
import { collectionService } from "@/features/collections/services/collectionService";
import { Collection } from "@/features/collections/types";
import { allProducts } from "@/features/products/data/products";
import { Spinner } from "@/components/ui/spinner";
import { Icons } from "@/components/ui/icons";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCollection(slug: string): Promise<Collection | undefined> {
  try {
    const res = await collectionService.getCollectionBySlug(slug);
    if (res.success && res.data) {
      return res.data;
    }
  } catch {
    // API fallback
  }
  return initialCollections.find((c) => c.slug === slug);
}

export async function generateStaticParams() {
  return initialCollections.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) {
    return constructMetadata({
      title: "Collection Not Found",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `${collection.title} Collection`,
    description: collection.description || `Explore the ${collection.title} luxury collection by Maison de Parfum.`,
    canonical: `/collections/${slug}`,
  });
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) {
    notFound();
  }

  // Filter products for this specific collection
  const collectionProducts = allProducts.filter((p) => p.collectionId === collection.id);

  return (
    <main className="py-10 sm:py-16 lg:py-20 bg-background min-h-screen">
      <Container size="wide">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/collections"
            className="inline-flex items-center text-xs uppercase tracking-[0.16em] text-foreground-muted hover:text-foreground transition-colors"
          >
            <Icons.ArrowLeft size={14} className="mr-2" />
            Back to All Collections
          </Link>
        </div>

        {/* Collection Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-16 pb-12 border-b border-border">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center space-x-3 mb-4">
              <span className="w-6 h-[1px] bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-foreground-muted">
                {collection.subtitle || "Exclusive Collection"}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground leading-tight tracking-tight mb-4">
              {collection.title}
            </h1>

            {collection.description && (
              <p className="text-base text-foreground-muted font-sans font-light leading-relaxed max-w-xl">
                {collection.description}
              </p>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-subtle border border-border shadow-subtle">
              <OptimizedImage
                src={collection.heroImage || "/images/perfumes/oud-majesty.png"}
                alt={collection.title}
                aspectRatio="16/9"
                priority={true}
                className="w-full h-auto object-cover bg-surface-subtle/30"
              />
            </div>
          </div>
        </div>

        {/* Collection Products Discovery View */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-32">
              <Spinner size="lg" />
            </div>
          }
        >
          <ProductDiscoveryView
            initialProducts={collectionProducts.length > 0 ? collectionProducts : allProducts}
            fixedCollectionId={collection.id}
            itemsPerPage={6}
          />
        </Suspense>
      </Container>
    </main>
  );
}
