import React from "react";
import { constructMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/layout/Container";
import { CollectionCard } from "@/features/collections/components/CollectionCard";
import { initialCollections } from "@/features/collections/data/collections";
import { collectionService } from "@/features/collections/services/collectionService";
import { Collection } from "@/features/collections/types";

export const metadata = constructMetadata({
  title: "Curated Fragrance Collections",
  description:
    "Explore curated olfactory collections crafted by master perfumers: The Private Reserve, Les Extraits Purs, The Nocturne Series, and Les Soliflores.",
  canonical: "/collections",
});

async function getCollections(): Promise<Collection[]> {
  try {
    const res = await collectionService.getCollections();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {
    // API fallback to curated initialCollections
  }
  return initialCollections;
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <main className="py-12 sm:py-16 lg:py-20 bg-background min-h-screen">
      <Container size="wide">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <span className="w-6 h-[1px] bg-accent" />
            <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-foreground-muted">
              Curated Series
            </span>
            <span className="w-6 h-[1px] bg-accent" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-foreground leading-tight tracking-tight mb-4">
            The Olfactory Collections
          </h1>
          <p className="text-sm sm:text-base text-foreground-muted font-sans font-light leading-relaxed">
            Each Maison de Parfum collection reflects a distinct creative chapter—from limited single-harvest reserves to intense pure extrait formulations.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {collections.map((collection, idx) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              priority={idx < 2}
            />
          ))}
        </div>
      </Container>
    </main>
  );
}
