import { constructMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { Hero } from "@/components/storefront/Hero";
import { NewCollectionSection } from "@/components/storefront/NewCollectionSection";
import { DiscoverCollectionSection } from "@/components/storefront/DiscoverCollectionSection";
import { ArtOfBloomSection } from "@/components/storefront/ArtOfBloomSection";
import { Skiper30 } from "@/components/storefront/ParallaxGallerySection";
import { OlfactoryConciergeSection } from "@/components/storefront/OlfactoryConciergeSection";

export const metadata = constructMetadata({
  title: "Soulmate Scents — Haute Parfumerie & Luxury Extraits",
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
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": siteConfig.contact.phone,
            "contactType": "customer service",
            "email": siteConfig.contact.email,
            "availableLanguage": ["en", "ur"],
            "areaServed": "PK"
          }
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Gulberg III",
          "addressLocality": "Lahore",
          "addressCountry": "PK"
        },
        "sameAs": [
          siteConfig.socials.instagram,
          siteConfig.socials.facebook,
          siteConfig.socials.tiktok,
          siteConfig.socials.pinterest
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        "url": siteConfig.url,
        "name": siteConfig.name,
        "description": siteConfig.description,
        "publisher": {
          "@id": `${siteConfig.url}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteConfig.url}/shop?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteConfig.url}/#breadcrumbs`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteConfig.url
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Creations",
            "item": `${siteConfig.url}/#discover-collection`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Concierge & FAQ",
            "item": `${siteConfig.url}/#concierge-knowledge`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${siteConfig.url}/#faq`,
        "name": "Soulmate Scents Haute Parfumerie Concierge & FAQ",
        "description": "Expert answers to common questions about Extrait de Parfum formulation, longevity, skin application rituals, and rare botanicals.",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is an Extrait de Parfum and how does it differ from Eau de Parfum?",
            "text": "What is an Extrait de Parfum and how does it differ from Eau de Parfum?",
            "dateCreated": "2026-01-01",
            "upvoteCount": 84,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "An Extrait de Parfum is the purest and most concentrated formulation of fine fragrance, containing 30% to 40% pure aromatic compounds. Unlike standard Eau de Parfum (15–20% concentration), extraits develop with greater depth on skin and provide 12 to 18 hours of continuous, intimate sillage without harsh alcoholic evaporation.",
              "dateCreated": "2026-01-01"
            },
            "suggestedAnswer": {
              "@type": "Answer",
              "text": "Extrait de Parfum features the highest concentration of fragrance oils (30-40%) ensuring all-day longevity.",
              "dateCreated": "2026-01-01"
            }
          },
          {
            "@type": "Question",
            "name": "How to apply luxury perfume for maximum longevity and projection?",
            "text": "How to apply luxury perfume for maximum longevity and projection?",
            "dateCreated": "2026-01-01",
            "upvoteCount": 62,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hydrate the skin with an unscented moisturizer, apply 2 to 3 sprays to warm pulse points (neck, inner wrists, and collarbone) from 6 inches, and allow the fragrance to dry down naturally without friction.",
              "dateCreated": "2026-01-01"
            },
            "suggestedAnswer": {
              "@type": "Answer",
              "text": "Target pulse points on moisturized skin and never rub wrists together to protect delicate top notes.",
              "dateCreated": "2026-01-01"
            }
          },
          {
            "@type": "Question",
            "name": "What rare botanicals and ingredients compose Soulmate Scents creations?",
            "text": "What rare botanicals and ingredients compose Soulmate Scents creations?",
            "dateCreated": "2026-01-01",
            "upvoteCount": 57,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Soulmate Scents crafts bespoke formulations with aged Mysore sandalwood, French Grasse centifolia rose, high-altitude Sicilian bergamot, natural ambergris accords, and sustainably harvested oriental oud.",
              "dateCreated": "2026-01-01"
            },
            "suggestedAnswer": {
              "@type": "Answer",
              "text": "Ethically harvested rare botanicals and natural essential oils formulated in Grasse and Paris traditions.",
              "dateCreated": "2026-01-01"
            }
          },
          {
            "@type": "Question",
            "name": "How to store luxury perfume to preserve olfactory integrity?",
            "text": "How to store luxury perfume to preserve olfactory integrity?",
            "dateCreated": "2026-01-01",
            "upvoteCount": 49,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Store fragrance flacons upright in a cool, dark environment away from direct sunlight, humidity, and temperature fluctuations, ideally between 15°C and 20°C in their original presentation box.",
              "dateCreated": "2026-01-01"
            },
            "suggestedAnswer": {
              "@type": "Answer",
              "text": "Keep flacons away from bathroom humidity and direct UV light to preserve delicate fragrance molecules.",
              "dateCreated": "2026-01-01"
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between niche perfume and designer fragrance?",
            "text": "What is the difference between niche perfume and designer fragrance?",
            "dateCreated": "2026-01-01",
            "upvoteCount": 53,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A niche perfume is an artisanal creation focused solely on olfactory artistry, higher concentrations of rare natural ingredients, and bespoke storytelling, whereas designer fragrances prioritize mass-market appeal and synthetic fixatives.",
              "dateCreated": "2026-01-01"
            },
            "suggestedAnswer": {
              "@type": "Answer",
              "text": "Niche perfumery prioritizes artisanal craftsmanship and rare raw materials over mass-market commercial trends.",
              "dateCreated": "2026-01-01"
            }
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/#webpage`,
        "url": siteConfig.url,
        "name": "Soulmate Scents — Haute Parfumerie & Luxury Extraits",
        "description": siteConfig.description,
        "isPartOf": { "@id": `${siteConfig.url}/#website` },
        "about": { "@id": `${siteConfig.url}/#organization` },
        "author": {
          "@type": "Person",
          "name": "Soulmate Scents Master Perfumers",
          "jobTitle": "Master Nose & Olfactory Architect",
          "url": `${siteConfig.url}/about`,
          "image": `${siteConfig.url}/images/perfumes/1789763707946.png`,
          "sameAs": [
            siteConfig.socials.instagram,
            siteConfig.socials.facebook,
            siteConfig.socials.tiktok,
            siteConfig.socials.pinterest
          ]
        },
        "publisher": { "@id": `${siteConfig.url}/#organization` },
        "datePublished": "2025-01-01T00:00:00+05:00",
        "dateModified": "2026-11-06T00:40:00+05:00",
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["#hero-summary", "#art-of-scent-description", "#faq-answers"]
        }
      }
    ]
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

      {/* 01.8 — DISCOVER THE COLLECTION: Luxury Editorial Asymmetrical Grid */}
      <DiscoverCollectionSection />

      {/* 04.5 — THE ART OF BLOOM: Editorial dual-card showcase */}
      <ArtOfBloomSection />

      {/* 01.2 — NEW PERFUME COLLECTION: Sage green editorial collage section */}
      <NewCollectionSection />

      {/* 05 — HAUTE PARFUMERIE CONCIERGE: SEO/AEO/GEO Verified Knowledge, FAQ & Table of Contents */}
      <OlfactoryConciergeSection />
    </div>
  );
}
