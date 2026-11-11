import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata = constructMetadata({
  title: "About Soulmate Scents | Craftsmanship & Heritage",
  description:
    "Soulmate Scents is a Pakistani luxury perfumery house composing high-concentration Extrait and Eau de Parfum fragrances from rare French and Arabian essential oils.",
  canonical: "/about",
});

export default function AboutPage() {
  const baseUrl = siteConfig.url.replace(/\/+$/, "");

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${baseUrl}/about#webpage`,
        url: `${baseUrl}/about`,
        name: "About Soulmate Scents | Craftsmanship & Heritage",
        description:
          "Soulmate Scents is a Pakistani luxury perfumery house composing high-concentration Extrait and Eau de Parfum fragrances.",
        datePublished: "2026-01-01",
        dateModified: "2026-11-11",
        author: {
          "@type": "Organization",
          name: "Soulmate Scents Master Perfumers",
          url: baseUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
          { "@type": "ListItem", position: 2, name: "About", item: `${baseUrl}/about` },
        ],
      },
    ],
  };

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen py-10 sm:py-16 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <Container size="wide" className="max-w-4xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-stone-500 mb-4">
          <Link href="/" className="hover:text-[#590B16] transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#590B16] font-semibold">About Us</span>
        </nav>

        <header className="border-b border-[#EADECF] pb-6 mb-8">
          <span className="text-[11px] font-serif font-bold uppercase tracking-[0.25em] text-[#590B16] block mb-2">
            Maison Heritage & Olfactory Artistry
          </span>
          <h1
            id="about-heading"
            className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-[#0D1424]"
          >
            About Soulmate Scents
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
            Soulmate Scents is a luxury fragrance house based in Lahore, Pakistan, dedicated to crafting long-lasting Extrait de Parfum and Eau de Parfum formulations with imported French and Arabian oils.
          </p>
          <div className="text-xs text-stone-500 mt-3">
            Updated{" "}
            <time dateTime="2026-11-11" className="font-medium text-stone-700">
              November 11, 2026
            </time>
          </div>
        </header>

        <section className="space-y-8 text-sm text-stone-700 leading-relaxed">
          <div>
            <h2 id="our-philosophy" className="font-serif text-xl font-bold text-[#0D1424] mb-2">
              What makes Soulmate Scents fragrances unique?
            </h2>
            <p>
              Every Soulmate Scents composition uses a 25% to 30% aromatic oil concentration, matured slowly for depth, smooth projection, and 10 to 14 hours of wear on skin and fabric.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-[#EADECF]">
              <h3 id="quality-oils" className="font-serif text-sm font-bold uppercase tracking-wider text-[#590B16] mb-1.5">
                Rare Natural Absolutes
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                Each bottle blends Calabrian bergamot, Damascus rose, aged oud, and Madagascan vanilla into balanced three-tier scent pyramids.
              </p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-[#EADECF]">
              <h3 id="concierge-service" className="font-serif text-sm font-bold uppercase tracking-wider text-[#590B16] mb-1.5">
                Nationwide Delivery & Support
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                We dispatch orders within 24 hours across Pakistan with tracked courier delivery and a 7-day return and exchange guarantee.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#EADECF]">
            <Link
              href="/perfumes"
              className="px-6 py-2.5 bg-[#590B16] text-white text-xs font-serif font-bold uppercase tracking-widest rounded-full hover:bg-[#42060F] transition-colors"
            >
              Explore Perfume Collection
            </Link>
            <Link
              href="/contact"
              className="px-6 py-2.5 border border-[#590B16] text-[#590B16] text-xs font-serif font-bold uppercase tracking-widest rounded-full hover:bg-[#590B16]/5 transition-colors"
            >
              Contact Concierge
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}

