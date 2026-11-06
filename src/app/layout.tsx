import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Outfit, Playfair_Display } from "next/font/google";
import React, { Suspense } from "react";
import "./globals.css";
import { constructMetadata } from "@/lib/seo/metadata";
import { TopProgressBar } from "@/components/layout/TopProgressBar";
import { Preloader } from "@/components/ui/Preloader";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${plusJakarta.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/images/perfumes/favicon-icon.png?v=soulmate-3" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/images/perfumes/favicon-icon.png?v=soulmate-3" type="image/png" />
        <link rel="apple-touch-icon" href="/images/perfumes/favicon-icon.png?v=soulmate-3" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col selection:bg-accent-subtle selection:text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2.5 focus:bg-[#590B16] focus:text-[#FAF7EE] focus:text-xs focus:font-semibold focus:uppercase focus:tracking-widest focus:shadow-xl focus:outline-none"
        >
          Skip to main content
        </a>
        <Preloader />
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
