import { constructMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { Hero } from "@/components/storefront/Hero";
import { NewCollectionSection } from "@/components/storefront/NewCollectionSection";
import { DiscoverCollectionSection } from "@/components/storefront/DiscoverCollectionSection";
import { BrandSavoirFaire } from "@/components/storefront/BrandSavoirFaire";
import { ArtOfBloomSection } from "@/components/storefront/ArtOfBloomSection";
import { TiltCascadeSection } from "@/components/storefront/TiltCascadeSection";
import { JournalPreview } from "@/components/storefront/JournalPreview";
import { CircularTestimonialsSection } from "@/components/storefront/CircularTestimonialsSection";
import { FinalCTA } from "@/components/storefront/FinalCTA";
import { Skiper30 } from "@/components/storefront/ParallaxGallerySection";
import { Skiper79 } from "@/components/storefront/Skiper79TeamScroll";

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

      {/* 01.1 — PARALLAX GALLERY: Skiper 30 multi-speed column parallax showcase with SOULMATE SCENTS */}
      <Skiper30 />

      {/* 01.2 — THE OLFACTORY CASCADE: Slanted tilt cascade spring-physics carousel */}
      <TiltCascadeSection />

      {/* 01.8 — DISCOVER THE COLLECTION: Luxury Editorial Asymmetrical Grid */}
      <DiscoverCollectionSection />

      {/* 04.5 — THE ART OF BLOOM: Editorial dual-card showcase */}
      <ArtOfBloomSection />


      {/* 01.2 — NEW PERFUME COLLECTION: Sage green editorial collage section */}
      <NewCollectionSection />

      {/* 04 — BRAND PHILOSOPHY / SAVOIR-FAIRE: 45/55 editorial split */}
      <BrandSavoirFaire />

      {/* 04.8 — TEAM SHOWCASE SCROLL: Skiper 79 Master Noses & Artisan Collective */}
      <Skiper79 />

      {/* 06 — OLFACTORY JOURNAL: 3-story editorial magazine composition */}
      <JournalPreview />

      {/* 06.5 — VOICES OF DISTINCTION: Circular 3D Carousel Testimonials */}
      <CircularTestimonialsSection />

      {/* 07 — FINAL CLOSING CTA: Quiet cinematic closing section */}
      <FinalCTA />
    </div>
  );
}
