import React from "react";
import { constructMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { AboutPageClient } from "./AboutPageClient";

export const metadata = constructMetadata({
  title: "About Our Maison | Savoir-Faire & Craftsmanship",
  description:
    "Discover Soulmate Scents — Maison de Haute Parfumerie. Formulating rare Extraits de Parfum with 30% oil concentration, 45-day maceration, and sustainably sourced botanicals.",
  canonical: "/about",
});

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": `About ${siteConfig.name}`,
    "description":
      "Learn about Soulmate Scents, our artisanal slow-maceration craftsmanship, rare botanical sourcing, and Extrait de Parfum philosophy.",
    "url": `${siteConfig.url}/about`,
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "url": siteConfig.url,
      "logo": `${siteConfig.url}${siteConfig.ogImage}`,
    },
    "mainEntity": {
      "@type": "Organization",
      "name": siteConfig.name,
      "foundingDate": "2024",
      "description": siteConfig.description,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Concierge",
        "email": siteConfig.contact.email,
        "telephone": siteConfig.contact.phone,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutPageClient />
    </>
  );
}
