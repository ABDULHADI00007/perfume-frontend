export const siteConfig = {
  name: "Soulmate Scents",
  description: "Crafting exceptional luxury fragrances with rare essences and timeless elegance.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://soulmatescents.com",
  ogImage: "/images/perfumes/soulmate_logo_transparent.png",
  contact: {
    email: "concierge@soulmatescents.com",
    phone: "+1 (800) 555-PARFUM",
  },
  socials: {
    instagram: "https://instagram.com/soulmatescents",
    pinterest: "https://pinterest.com/soulmatescents",
  },
};

export type SiteConfig = typeof siteConfig;
