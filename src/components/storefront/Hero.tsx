"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import PaperCurlCarousel, { type PaperCurlItem } from "@/components/ui/paper-curl-carousel";
import { Icons } from "@/components/ui/icons";

export const Hero: React.FC = () => {
  const items: PaperCurlItem[] = useMemo(
    () => [
      {
        src: "/images/editorial/hero_img.png",
        title: "More Than a Fragrance",
        caption: "Edition 01 — Timeless artisanal extraits crafted with pure devotion in Grasse",
        alt: "Maison de Parfum - Timeless Scents",
      },
      {
        src: "/images/editorial/hero_two.png",
        title: "Sultan's Veil",
        caption: "Edition 02 — Rare Mysore sandalwood, golden ambergris & midnight saffron",
        alt: "Sultan's Veil Private Reserve",
      },
      {
        src: "/images/editorial/hero_three.png",
        title: "L'Aura Blanche",
        caption: "Edition 03 — Crisp Calabrian bergamot draped in white cashmere and french iris",
        alt: "L'Aura Blanche Parisian Luxury",
      },
      {
        src: "/images/editorial/new_collection_model_green.jpg",
        title: "Botanical Solitude",
        caption: "Edition 04 — Wild coastal herbs, smoked vetiver and damp green woods",
        alt: "Botanical Solitude Collection",
      },
    ],
    []
  );

  return (
    <section
      aria-label="Hero Introduction"
      className="relative w-full overflow-hidden bg-[#0D1117] text-[#111111]"
    >
      {/* Top Floating Editorial Brand Pill */}
      <div className="absolute top-5 left-6 sm:left-10 z-20 pointer-events-none flex items-center gap-3">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#E8BA78] animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.22em] text-[#F3E5D0] font-medium">
            Haute Parfumerie • Private Reserve
          </span>
        </div>
      </div>

      {/* Floating CTA Overlay in Top Right */}
      <div className="absolute top-5 right-6 sm:right-10 z-20 flex items-center gap-3">
        <Link
          href="/perfumes"
          className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#E8BA78] hover:bg-[#F3D19E] active:scale-95 text-[#0B1426] font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-md hover:shadow-xl"
        >
          <span>Explore Scent Catalog</span>
          <Icons.ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Unique WebGL Paper Curl Carousel */}
      <PaperCurlCarousel
        items={items}
        height="calc(100vh - 64px)"
        autoplay={5000}
        loop={true}
        paper="#E8E4DC"
        rail={true}
        className="shadow-2xl"
      />
    </section>
  );
};
