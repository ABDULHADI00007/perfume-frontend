import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  canonical = "/",
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
}: SEOProps = {}): Metadata {
  const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
  const canonicalUrl = `${siteConfig.url}${canonical.startsWith("/") ? canonical : `/${canonical}`}`;

  const openGraphData: Metadata["openGraph"] =
    type === "article"
      ? {
          title: fullTitle,
          description,
          url: canonicalUrl,
          siteName: siteConfig.name,
          images: [{ url: image }],
          type: "article",
          publishedTime,
          modifiedTime,
          authors,
        }
      : {
          title: fullTitle,
          description,
          url: canonicalUrl,
          siteName: siteConfig.name,
          images: [{ url: image }],
          type: "website",
        };

  return {
    metadataBase: new URL(siteConfig.url),
    title: fullTitle,
    description,
    keywords: ["luxury perfume", "haute parfumerie", "niche fragrance", "artisanal perfume", "olfactory journal"],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: openGraphData,
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}
