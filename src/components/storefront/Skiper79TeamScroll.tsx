"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Icons } from "@/components/ui/icons";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  location: string;
  specialty: string;
  image: string;
  experience: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "clara",
    name: "Clara Vance",
    role: "Master Perfumer & Nose",
    location: "Paris • Grasse",
    specialty: "Velvet Florals & Aged Amber",
    image: "/images/team/clara.jpg",
    experience: "16 Yrs Haute Parfumerie",
  },
  {
    id: "julian",
    name: "Julian Morand",
    role: "Extraction Director",
    location: "Florence, Italy",
    specialty: "Wild Sandalwood & Smoked Oudh",
    image: "/images/team/julian.jpg",
    experience: "20 Yrs Master Distiller",
  },
  {
    id: "camille",
    name: "Camille Laurent",
    role: "Botanical Sourcing Lead",
    location: "Provence, France",
    specialty: "Rose de Mai & Night Jasmine",
    image: "/images/editorial/new_collection_model_green.jpg",
    experience: "12 Yrs Rare Florals",
  },
  {
    id: "antoine",
    name: "Antoine Duprès",
    role: "Creative Olfactory Architect",
    location: "Geneva, Switzerland",
    specialty: "Aquatic Resins & Solar Citrus",
    image: "/images/editorial/savoir-faire-botanical.jpg",
    experience: "14 Yrs Molecular Scent",
  },
];

export const Skiper79 = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Staggered parallax scales and translateY for the grid items
  const scaleCenter = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.9]);
  const scaleSides = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.95]);
  const yOdd = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yEven = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const headlineX = useTransform(scrollYProgress, [0, 1], ["5%", "-15%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#070B19] text-white py-28 sm:py-36 overflow-hidden border-t border-white/10"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#D4ADFC]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0C134F]/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-16 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10.5px] uppercase tracking-[0.25em] text-[#D4ADFC] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4ADFC] animate-pulse" />
            <span>Skiper 79 • Team Showcase Scroll</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white leading-[1.08]">
            The Master Noses & <br />
            <span className="italic font-light text-stone-300">Artisan Blenders</span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-stone-400 max-w-md font-sans leading-relaxed tracking-wide">
          Every Soulmate Scents extrait is meticulously authored by an elite collective of botanical chemists, Grasse distillers, and master perfumers.
        </p>
      </div>

      {/* Kinetic Floating Headline with mix-blend-exclusion */}
      <div className="pointer-events-none select-none overflow-hidden my-4 sm:my-8">
        <motion.div
          style={{ x: headlineX }}
          className="whitespace-nowrap font-serif text-[13vw] uppercase font-bold tracking-tighter leading-none text-white/10 mix-blend-exclusion"
        >
          SOULMATE SCENTS • THE CREATIVE COLLECTIVE • GRASSE • PARIS • FLORENCE •
        </motion.div>
      </div>

      {/* Scroll-Triggered Dynamic Team Grid */}
      <div className="relative z-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
          {teamMembers.map((member, idx) => {
            const isOdd = idx % 2 === 1;
            const yMotion = isOdd ? yOdd : yEven;
            const scaleMotion = idx === 1 || idx === 2 ? scaleCenter : scaleSides;

            return (
              <motion.div
                key={member.id}
                style={{ y: yMotion, scale: scaleMotion }}
                className="group relative flex flex-col rounded-3xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-[#D4ADFC]/40 transition-colors duration-500 shadow-2xl backdrop-blur-xs"
              >
                {/* Image Container with Grayscale-to-Color & Zoom */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale contrast-105 brightness-95 group-hover:grayscale-0 group-hover:scale-108 transition-all duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070B19] via-[#070B19]/30 to-transparent opacity-85 group-hover:opacity-60 transition-opacity duration-500" />

                  {/* Location badge on top */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] uppercase font-mono tracking-wider text-stone-300 border border-white/10">
                      <Icons.Tag size={11} className="text-[#D4ADFC]" />
                      {member.location}
                    </span>
                  </div>

                  {/* Experience pill on top-right */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[9.5px] uppercase font-mono tracking-wider text-white border border-white/15">
                      {member.experience}
                    </span>
                  </div>

                  {/* Floating mix-blend name label overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-[#D4ADFC] block mb-1">
                      {member.role}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-white font-normal tracking-tight">
                      {member.name}
                    </h3>
                  </div>
                </div>

                {/* Card Details / Specialty Footer */}
                <div className="p-5 flex-1 flex flex-col justify-between border-t border-white/10 bg-[#070B19]/80">
                  <div>
                    <span className="text-[10px] uppercase font-sans tracking-[0.16em] text-stone-500 block mb-1">
                      Signature Palette
                    </span>
                    <p className="text-xs text-stone-300 font-sans font-medium">
                      {member.specialty}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-stone-400 group-hover:text-white transition-colors">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500">
                      Curated Formula
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#D4ADFC] font-medium">
                      View Profile <Icons.ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Subtle Indicator */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-20 sm:mt-28 flex items-center justify-between border-t border-white/10 pt-6 text-[11px] text-stone-500 font-mono">
        <span>04 / SOULMATE SCENTS ATELIER CREW</span>
        <span className="uppercase tracking-widest text-[#D4ADFC]/80">
          CRAFTED IN GRASSE &bull; BOTTLED IN FRANCE
        </span>
      </div>
    </section>
  );
};

export default Skiper79;
