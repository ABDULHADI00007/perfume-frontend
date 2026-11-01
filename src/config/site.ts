export const siteConfig = {
  name: "Soulmate Scents",
  description: "Crafting exceptional luxury fragrances with rare essences and timeless elegance.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://soulmatescents.com",
  ogImage: "/images/perfumes/soulmate_logo_transparent.png",
  contact: {
    email: "soulmatescents@gmail.com",
    phone: "+92 333 7615355",
  },
  socials: {
    instagram: "https://www.instagram.com/soulmatescents?vrfl=MWc1YTY4MGVuNWpyaw==",
    facebook: "https://www.facebook.com/share/1EGXnZi5TC/",
    pinterest: "https://pinterest.com/soulmatescents",
  },
};

export type SiteConfig = typeof siteConfig;
