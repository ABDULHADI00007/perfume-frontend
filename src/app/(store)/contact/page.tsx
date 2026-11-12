import React from "react";
import { constructMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { ContactClient } from "./ContactClient";
import { CONTACT_FAQ_ITEMS } from "./contactData";

export const revalidate = 60;

export const metadata = constructMetadata({
  title: "Contact Fragrance Concierge & Order Support | Soulmate Scents",
  description:
    "Contact the Soulmate Scents fragrance concierge team for order support, bespoke gifting inquiries, WhatsApp live consultations, and personalized scent recommendations.",
  canonical: "/contact",
});

function ContactJsonLd() {
  const baseUrl = siteConfig.url.replace(/\/+$/, "");
  const pageUrl = `${baseUrl}/contact`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: siteConfig.name,
        url: baseUrl,
        description: siteConfig.description,
        logo: `${baseUrl}/images/perfumes/soulmate_logo_transparent.webp`,
        email: siteConfig.contact.email,
        telephone: siteConfig.contact.phone,
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: siteConfig.contact.phone,
            contactType: "customer service",
            email: siteConfig.contact.email,
            availableLanguage: ["en", "ur"],
            areaServed: "PK",
          },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Karachi",
          addressCountry: "PK",
        },
        sameAs: [
          siteConfig.socials.instagram,
          siteConfig.socials.facebook,
          siteConfig.socials.tiktok,
          siteConfig.socials.pinterest,
        ],
      },
      {
        "@type": "ContactPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Contact Fragrance Concierge & Order Support | Soulmate Scents",
        headline: "Contact Our Fragrance Concierge",
        description:
          "Reach Soulmate Scents concierge support by email, phone, WhatsApp live chat, or our direct inquiry form for fragrance advice and order help.",
        isPartOf: { "@id": `${baseUrl}/#website` },
        author: { "@id": `${baseUrl}/#organization` },
        publisher: { "@id": `${baseUrl}/#organization` },
        datePublished: "2026-01-01",
        dateModified: "2026-11-11",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".speakable-intro", ".speakable-faq"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Contact Us",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: CONTACT_FAQ_ITEMS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function ContactPage() {
  return (
    <>
      <ContactJsonLd />
      <ContactClient />
    </>
  );
}
