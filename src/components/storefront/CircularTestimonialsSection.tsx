"use client";

import React from "react";
import { CircularTestimonials, Testimonial } from "@/components/ui/circular-testimonials";
import { Container } from "@/components/layout/Container";

const perfumeTestimonials: Testimonial[] = [
  {
    name: "Sophia Laurent",
    designation: "Private Collector — Paris",
    quote:
      "Santal Impérial has become my signature. It evolves throughout the day into something deeply intimate and mesmerizing. Nothing from standard department counters comes close.",
    src: "/images/editorial/new_collection_model_green.jpg",
  },
  {
    name: "Alexandre Moreau",
    designation: "Architect & Connoisseur — Milan",
    quote:
      "The Discovery Set transformed how I understand bespoke perfumery. Each extrait reveals layers of aged oud and botanical absolutes that hold up under the most discerning attention.",
    src: "/images/editorial/private-reserve-coastal.jpg",
  },
  {
    name: "Nadia Al-Mansoor",
    designation: "Creative Director — Dubai",
    quote:
      "Oud Royale is unlike anything I have ever experienced. There is a serene restraint, a quietude, that feels simultaneously ancient and timelessly modern. Truly extraordinary.",
    src: "/images/editorial/savoir-faire-botanical.jpg",
  },
  {
    name: "Elena Rostova",
    designation: "Sensory Curator — London",
    quote:
      "Soulmate Scents captures pure emotion in a crystal bottle. The sillage is sublime, whispering elegance without ever overpowering the room.",
    src: "/images/editorial/journal-coastal.jpg",
  },
];

export const CircularTestimonialsSection: React.FC = () => {
  return (
    <section
      aria-label="Voices of Distinction"
      className="py-20 sm:py-28 bg-[#FAF8F5] border-t border-b border-[#E8E4DD] relative overflow-hidden"
    >
      <Container size="wide">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center space-x-3 mb-3">
            <span className="w-6 h-[1px] bg-[#B39359]" />
            <span className="text-[11px] uppercase tracking-[0.24em] font-medium text-[#7D786F]">
              Client Correspondence
            </span>
            <span className="w-6 h-[1px] bg-[#B39359]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#171717] tracking-tight leading-tight">
            Voices of Distinction
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B665E] font-light max-w-lg mx-auto">
            Reflections from patrons who have made Soulmate Scents an indelible part of their personal aura.
          </p>
        </div>

        {/* Circular Testimonials Interactive Component */}
        <div className="w-full flex justify-center">
          <CircularTestimonials
            testimonials={perfumeTestimonials}
            autoplay={true}
            colors={{
              name: "#171717",
              designation: "#8A7E72",
              testimony: "#3D3935",
              arrowBackground: "#171717",
              arrowForeground: "#FAF8F5",
              arrowHoverBackground: "#9E7E47",
            }}
            fontSizes={{
              name: "1.65rem",
              designation: "0.85rem",
              quote: "1.18rem",
            }}
          />
        </div>
      </Container>
    </section>
  );
};

export default CircularTestimonialsSection;
