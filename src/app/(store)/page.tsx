import { constructMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { Hero } from "@/components/storefront/Hero";
import { NewCollectionSection } from "@/components/storefront/NewCollectionSection";
import { PerfumeJesminaSection } from "@/components/storefront/PerfumeJesminaSection";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { BrandSavoirFaire } from "@/components/storefront/BrandSavoirFaire";
import { ArtOfBloomSection } from "@/components/storefront/ArtOfBloomSection";
import { JournalPreview } from "@/components/storefront/JournalPreview";
import { FinalCTA } from "@/components/storefront/FinalCTA";

export const metadata = constructMetadata({
  title: "Soulmate Scents",
  description:
    "Discover the art of personal scent with Soulmate Scents. Exceptional extraits de parfum composed with rare botanicals, aged sandalwood, and precious resins.",
  canonical: "/",
});

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        "name": siteConfig.name,
        "url": siteConfig.url,
        "logo": `${siteConfig.url}${siteConfig.ogImage}`,
        "description": siteConfig.description,
        "email": siteConfig.contact.email,
        "telephone": siteConfig.contact.phone,
        "sameAs": [siteConfig.socials.instagram, siteConfig.socials.pinterest],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        "url": siteConfig.url,
        "name": siteConfig.name,
        "description": siteConfig.description,
        "publisher": {
          "@id": `${siteConfig.url}/#organization`,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col w-full cinematic-scroll-container">
      {/* Structured Data for Search Engine Optimization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 01 — HERO: Cinematic luxury hero */}
      <Hero />

      {/* 01.5 — PERFUME JESMINA MUST-HAVES: Editorial reference grid section */}
      <PerfumeJesminaSection />

      {/* 04.5 — THE ART OF BLOOM: Editorial dual-card showcase */}
      <ArtOfBloomSection />

      {/* 03 — SIGNATURE FRAGRANCES: 5-product selection */}
      <FeaturedProducts />

      {/* 01.2 — NEW PERFUME COLLECTION: Sage green editorial collage section */}
      <NewCollectionSection />


      {/* 04 — BRAND PHILOSOPHY / SAVOIR-FAIRE: 45/55 editorial split */}
      <BrandSavoirFaire />


      {/* 06 — OLFACTORY JOURNAL: 3-story editorial magazine composition */}
      <JournalPreview />

      {/* 07 — FINAL CLOSING CTA: Quiet cinematic closing section */}
      <FinalCTA />
    </div>
  );
}
