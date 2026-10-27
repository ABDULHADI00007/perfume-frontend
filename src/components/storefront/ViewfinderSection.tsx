"use client";

import React from "react";
import Link from "next/link";
import { CylinderCarousel, CarouselImage } from "@/components/ui/cylinder-carousel";
import { ArrowUpRight, Sparkles } from "lucide-react";

const perfumeCylinderImages: CarouselImage[] = [
  {
    title: "Amber Riviera — Extrait de Parfum",
    src: "/images/perfumes/amber-rivera.png",
    alt: "Amber Riviera Luxury Perfume Flacon",
  },
  {
    title: "Oud Majesty — Royal Reserve",
    src: "/images/perfumes/oud-majesty.png",
    alt: "Oud Majesty Perfume Flacon",
  },
  {
    title: "Citrus Rêverie — Solar Infusion",
    src: "/images/perfumes/cirtus-revrie.png",
    alt: "Citrus Rêverie Perfume Flacon",
  },
  {
    title: "Sultan Veils — Oriental Mystique",
    src: "/images/perfumes/sultan-veils.png",
    alt: "Sultan Veils Perfume Flacon",
  },
  {
    title: "Golden Serenity — Amber Nectar",
    src: "/images/perfumes/golden-senerity.png",
    alt: "Golden Serenity Perfume Flacon",
  },
  {
    title: "Secret Garden — Damask Floral",
    src: "/images/perfumes/secret-garden.png",
    alt: "Secret Garden Perfume Flacon",
  },
  {
    title: "Dusk Absolu — Nightfall Woods",
    src: "/images/perfumes/dusk.png",
    alt: "Dusk Absolu Perfume Flacon",
  },
  {
    title: "Vanilla Rêve — Bourbon Infusion",
    src: "/images/perfumes/vanila_rev.png",
    alt: "Vanilla Rêve Perfume Flacon",
  },
  {
    title: "Whisper Blossom — Delicate Petals",
    src: "/images/perfumes/whispers-bloom.jpg",
    alt: "Whisper Blossom Perfume Flacon",
  },
];

export function ViewfinderSection() {
  return (
    <section
      id="olfactory-viewfinder"
      aria-label="3D Cylinder Panoramic Archive"
      className="w-full bg-white text-[#4A0A13] relative overflow-hidden flex flex-col items-center justify-center py-14 sm:py-20 lg:py-24 select-none"
    >
      {/* Top Section Header */}
      <div className="flex flex-col items-center justify-center text-center z-10 px-4 mb-6 sm:mb-10">
        <div className="inline-flex items-center space-x-2.5 mb-2.5">
          <span className="w-6 h-[1px] bg-[#B39359]/70" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium text-[#B39359] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#B39359]" />
            The 3D Cylinder Archive
          </span>
          <span className="w-6 h-[1px] bg-[#B39359]/70" />
        </div>
        <h2 className="font-serif uppercase text-2xl sm:text-4xl lg:text-5xl font-normal text-[#4A0A13] tracking-[0.08em]">
          The Olfactory Viewfinder
        </h2>
      </div>

      {/* 3D Cylinder Carousel - Exact Sizing & Curvature like Reference */}
      <div className="w-full h-[440px] sm:h-[480px] flex items-center justify-center relative z-0">
        <CylinderCarousel
          images={perfumeCylinderImages}
          cardWidth={250}
          cardAspectRatio="3/4"
          perspective="52em"
          animationDuration={32}
          maskGradient="linear-gradient(90deg, transparent 0%, #000 20%, #000 80%, transparent 100%)"
          className="w-full h-full"
          cardClassName="rounded-2xl border border-stone-200/80 shadow-[0_15px_35px_rgba(74,10,19,0.08),0_5px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(74,10,19,0.15)] transition-all duration-300"
        />
      </div>

      {/* Bottom explore link */}
      <div className="mt-8 sm:mt-10 flex items-center justify-center z-10">
        <Link
          href="/perfumes"
          className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4A0A13] hover:bg-[#36050C] text-white text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 shadow-md shadow-[#4A0A13]/20"
        >
          <span>Explore All Scents</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#B39359]" />
        </Link>
      </div>
    </section>
  );
}

export default ViewfinderSection;
