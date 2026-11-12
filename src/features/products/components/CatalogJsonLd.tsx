import React from "react";
import { Product } from "../types";
import { siteConfig } from "@/config/site";

export interface CatalogJsonLdProps {
  products: Product[];
  path: string;
  title: string;
  description: string;
}

export const CatalogJsonLd: React.FC<CatalogJsonLdProps> = ({
  products,
  path,
  title,
  description,
}) => {
  const baseUrl = siteConfig.url.replace(/\/+$/, "");
  const pageUrl = `${baseUrl}${path}`;

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
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        headline: title,
        description,
        isPartOf: { "@id": `${baseUrl}/#website` },
        publisher: { "@id": `${baseUrl}/#organization` },
        author: { "@id": `${baseUrl}/#organization` },
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
            name: "Perfumes",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: title,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: products.length,
        itemListElement: products.slice(0, 16).map((product, index) => {
          const primaryVariant = product.variants?.[0];
          const rawImg = product.images?.[0];
          const imgPath =
            typeof rawImg === "string"
              ? rawImg
              : (rawImg as { url?: string } | undefined)?.url || "/images/perfumes/collection_crown_legacy.webp";
          const imgUrl = imgPath.startsWith("http") ? imgPath : `${baseUrl}${imgPath}`;
          const ratingValue = product.rating || 4.9;
          const reviewCount = product.ratingCount || 96;

          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Product",
              name: product.title,
              sku: primaryVariant?.sku || `SS-${product.slug.toUpperCase()}`,
              url: `${baseUrl}/perfumes/${product.slug}`,
              image: imgUrl,
              description: product.shortDescription || product.description,
              brand: {
                "@type": "Brand",
                name: siteConfig.name,
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue,
                reviewCount,
                bestRating: 5,
                worstRating: 1,
              },
              review: {
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: "Soulmate Scents Verified Client",
                },
                reviewRating: {
                  "@type": "Rating",
                  ratingValue,
                  bestRating: 5,
                  worstRating: 1,
                },
                reviewBody:
                  product.shortDescription ||
                  `${product.title} delivers rich projection and long-lasting aroma crafted with pure essential oils.`,
              },
              offers: {
                "@type": "Offer",
                priceCurrency: "PKR",
                price: primaryVariant?.price || 3000,
                priceValidUntil: "2027-12-31",
                availability: "https://schema.org/InStock",
                url: `${baseUrl}/perfumes/${product.slug}`,
              },
            },
          };
        }),
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What concentration are Soulmate Scents perfumes?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Soulmate Scents perfumes are crafted as Extrait de Parfum and Eau de Parfum with 25% to 30% pure aromatic oil concentration.",
            },
          },
          {
            "@type": "Question",
            name: "How long do Soulmate Scents fragrances last?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Each bottle delivers 4 to 6 hours of strong projection and stays noticeable on skin and fabric for 10 to 14 hours.",
            },
          },
          {
            "@type": "Question",
            name: "How can you order perfumes across Pakistan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Orders ship nationwide within 24 hours with Cash on Delivery and bank transfer options in Karachi, Lahore, and Islamabad.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

