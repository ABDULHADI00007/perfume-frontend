export const siteConfig = {
  name: "Maison de Parfum",
  description: "Crafting exceptional luxury fragrances with rare essences and timeless elegance.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://maisonparfum.com",
  ogImage: "/images/og-image.jpg",
  contact: {
    email: "concierge@maisonparfum.com",
    phone: "+1 (800) 555-PARFUM",
  },
  socials: {
    instagram: "https://instagram.com/maisonparfum",
    pinterest: "https://pinterest.com/maisonparfum",
  },
};

export type SiteConfig = typeof siteConfig;
