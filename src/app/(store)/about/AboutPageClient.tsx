"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";
import { fadeInUp, staggerContainer, defaultViewport } from "@/lib/motion";

// Olfactory accords definition with rich sensory metadata
interface AccordLayer {
  id: "top" | "heart" | "base";
  frenchName: string;
  englishTitle: string;
  role: string;
  duration: string;
  sillage: string;
  quote: string;
  description: string;
  notes: { name: string; origin: string; category: string }[];
  color: string;
}

const ACCORD_LAYERS: AccordLayer[] = [
  {
    id: "top",
    frenchName: "Notes de Tête",
    englishTitle: "The Luminous Spark",
    role: "Immediate Awakening",
    duration: "First 15–30 Minutes",
    sillage: "Vivid & Radiating",
    quote: "The exhilarating first breath — crisp, effervescent, and magnetically captivating.",
    description:
      "Crafted with the highest volatility natural botanicals, our top notes are composed to grant an electric, sun-drenched greeting. They awaken your senses without overpowering, setting the mood for the narrative that follows.",
    notes: [
      { name: "Calabrian Bergamot", origin: "Reggio Calabria, Italy", category: "Citrus" },
      { name: "Pink Peppercorn", origin: "Madagascar", category: "Spicy" },
      { name: "Sparkling Sicilian Lemon", origin: "Sicily", category: "Citrus" },
      { name: "Crushed Wild Mint", origin: "Provence, France", category: "Green" },
    ],
    color: "#E8D5B5",
  },
  {
    id: "heart",
    frenchName: "Notes de Cœur",
    englishTitle: "The Emotional Core",
    role: "The Signature Soul",
    duration: "2–8 Hours",
    sillage: "Velvety & Enveloping",
    quote: "Where the spirit of the fragrance truly unfolds — opulent, warm, and memorable.",
    description:
      "As the initial citrus sparkles gently subside, the true emotional identity of the extrait blossoms. Here, velvety floral absolutes and aged herbal extracts merge seamlessly with the natural chemistry of your skin.",
    notes: [
      { name: "Damask Rose Centifolia", origin: "Grasse, France", category: "Floral" },
      { name: "Night-Blooming Jasmine", origin: "Sambac, India", category: "White Floral" },
      { name: "Wild Alpine Lavender", origin: "High Alps, France", category: "Herbal" },
      { name: "Golden Amberwood Accord", origin: "Atelier Blend", category: "Amber" },
    ],
    color: "#D4ADFC",
  },
  {
    id: "base",
    frenchName: "Notes de Fond",
    englishTitle: "The Eternal Memory",
    role: "Lasting Projection",
    duration: "12–24+ Hours",
    sillage: "Intimate & Hypnotic",
    quote: "The lingering aura left in the room — rich woods, dark vanilla, and smoky resins.",
    description:
      "The anchor of Haute Parfumerie. Our bases feature heavy, dense molecules that cling gently to silk, wool, and pulse points. Formulated at 30% concentration, these rich resins create your unforgettable olfactory signature.",
    notes: [
      { name: "Bourbon Vanilla Pods", origin: "Madagascar", category: "Gourmand" },
      { name: "Aged Mysore Sandalwood", origin: "Karnataka, India", category: "Woody" },
      { name: "Royal Agarwood (Oud)", origin: "Assam Terroir", category: "Smoky Resin" },
      { name: "Cashmere White Musk", origin: "Clean Synthetics", category: "Musk" },
    ],
    color: "#C5A880",
  },
];

// Atelier metrics
const ATELIER_METRICS = [
  {
    number: "30%",
    title: "Pure Extrait Concentration",
    desc: "Triple the oil content of commercial Eau de Toilette for unmatched depth and longevity.",
  },
  {
    number: "45 Days",
    title: "Maceration & Aging",
    desc: "Cold-rested in dark temperature chambers to let raw botanicals chemically marry.",
  },
  {
    number: "100%",
    title: "Ethical Raw Botanicals",
    desc: "Single-origin harvests directly from master distillers in Grasse, Italy, and Madagascar.",
  },
  {
    number: "24h+",
    title: "Active Skin Sillage",
    desc: "Slow-release molecular architecture that gracefully evolves from sunrise to twilight.",
  },
];

// Savoir-Faire 4-stage process
const CRAFTSMANSHIP_STEPS = [
  {
    step: "01",
    title: "Botanical Pilgrimage",
    subtitle: "Terroir & Dawn Harvesting",
    desc: "We harvest delicate jasmine and rose petals strictly at sunrise while dawn dew is intact. Each terroir brings distinct mineral nuances that synthetic imitations cannot duplicate.",
    highlight: "Single-estate harvests with complete soil traceability",
  },
  {
    step: "02",
    title: "Molecular Alchemy",
    subtitle: "The Master Formulation",
    desc: "Balancing over 80 individual aroma molecules per composition. Every extrait is calibrated to blend seamlessly with human pheromones, creating a unique signature for each wearer.",
    highlight: "Exclusively Extrait de Parfum (30% pure perfume oil)",
  },
  {
    step: "03",
    title: "Cellar Maturation",
    subtitle: "The 45-Day Slow Rest",
    desc: "Mass perfumes are bottled within 48 hours. Soulmate Scents rests undisturbed for a full month and a half, allowing harsh notes to mellow into liquid velvet.",
    highlight: "Zero heat acceleration, zero synthetic stabilizers",
  },
  {
    step: "04",
    title: "The Weighted Crystal Flacon",
    subtitle: "Bespoke Artistry",
    desc: "Enclosed in heavyweight Italian crystal flacons, fitted with precision micro-fine mist atomizers and finished with a magnetic weighted cap engraved with our Maison crest.",
    highlight: "Hand-inspected, serialized, and individually packaged",
  },
];

// Rare Botanicals Spotlight
const BOTANICALS = [
  {
    name: "Grasse Rose Centifolia",
    country: "Grasse, France",
    notes: "Sweet, honeyed, velvety petal warmth",
    image: "/images/editorial/journal-jasmine.jpg",
    badge: "Rare Floral Harvest",
  },
  {
    name: "Madagascar Bourbon Vanilla",
    country: "Sava Region, Madagascar",
    notes: "Dark, balsamic, sultry roasted sweetness",
    image: "/images/editorial/savoir-faire-botanical.jpg",
    badge: "Aged Extract",
  },
  {
    name: "Mysore Sandalwood",
    country: "Karnataka Terroir, India",
    notes: "Creamy, serene, sacred woody warmth",
    image: "/images/editorial/journal-woods.jpg",
    badge: "Sustainable Harvest",
  },
  {
    name: "Calabrian Bergamot",
    country: "Reggio Calabria, Italy",
    notes: "Sun-drenched, crisp, effervescent citrus",
    image: "/images/editorial/journal-coastal.jpg",
    badge: "Cold-Pressed Rind",
  },
];

// Brand Commitments / Values
const COMMITMENTS = [
  {
    icon: "ShieldCheck",
    title: "Cruelty-Free & Conscious",
    desc: "100% cruelty-free, vegan formulation. Formulated without parabens, phthalates, nitro-musks, or endocrine disruptors.",
  },
  {
    icon: "Package",
    title: "Archival Packaging",
    desc: "Rigid presentation box with tactile linen texture, velvet bottle bed, and embossed gold foil detailing designed to be preserved.",
  },
  {
    icon: "Sparkles",
    title: "Complimentary Discovery Vial",
    desc: "Every 50ml or 100ml flacon includes a matching 2ml trial vial. Test the fragrance on skin first; if not completely captivated, return unopened.",
  },
  {
    icon: "Heart",
    title: "Conscious Terroir Stewardship",
    desc: "We work directly with generational family-owned flower farms, funding clean distillation initiatives in Grasse and Madagascar.",
  },
];

export const AboutPageClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"top" | "heart" | "base">("top");
  const selectedAccord = ACCORD_LAYERS.find((a) => a.id === activeTab) || ACCORD_LAYERS[0];

  return (
    <div className="w-full bg-[#FAF8F5] text-[#121735] font-sans selection:bg-[#C5A880]/30 selection:text-[#0C134F]">
      {/* =========================================================================
          1. EDITORIAL HERO: The Poetry of Scent
      ========================================================================== */}
      <section className="relative w-full overflow-hidden border-b border-[#E6E2EA] pt-6 sm:pt-10 pb-16 sm:pb-24 bg-gradient-to-b from-[#F5EFE6]/60 via-[#FAF8F5] to-[#FAF8F5]">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#D4ADFC]/8 rounded-full blur-3xl pointer-events-none" />

        <Container size="wide">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-[#7A7D8F]">
            <Link href="/" className="hover:text-[#0C134F] transition-colors">
              Home
            </Link>
            <span className="text-[#C5A880] text-[10px]">/</span>
            <span className="text-[#121735] font-medium tracking-wide">About The Maison</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Editorial Manifesto */}
            <motion.div
              className="lg:col-span-7 flex flex-col items-start"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Maison Prestige Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E6E2EA] shadow-xs mb-6">
                <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
                <span className="font-sans text-[11px] uppercase tracking-[0.22em] font-semibold text-[#121735]">
                  Maison De Haute Parfumerie • Est. 2024
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={fadeInUp}
                className="font-serif text-3xl sm:text-5xl lg:text-[58px] font-normal leading-[1.08] tracking-[-0.015em] text-[#121735] mb-6"
              >
                We Don&apos;t Just Create Scent.{" "}
                <span className="italic font-light text-[#8C6B3A] block sm:inline">
                  We Bottle Moments.
                </span>
              </motion.h1>

              {/* Subheading Narrative */}
              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg text-[#555968] font-light leading-relaxed mb-6 max-w-2xl"
              >
                At <strong className="text-[#121735] font-medium">Soulmate Scents</strong>, we believe fragrance is the most intimate garment you will ever wear. It speaks before you utter a syllable, enters the room ahead of you, and lingers long after you have departed.
              </motion.p>

              <motion.p
                variants={fadeInUp}
                className="text-sm sm:text-[15px] text-[#6B6F80] font-light leading-relaxed mb-8 max-w-xl"
              >
                Born from an obsessive dedication to classical French formulation and enriched by rare, sun-drenched resins of the East, each flacon is composed strictly at Extrait de Parfum concentration (30% pure oil) — ensuring your signature scent endures with captivating grace.
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Link
                  href="/perfumes"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#0C134F] hover:bg-[#15206B] text-white text-xs uppercase tracking-[0.2em] font-semibold px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 min-h-[50px] group"
                >
                  <span>Explore The Flacons</span>
                  <Icons.ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#savoir-faire"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F3EFE6] text-[#121735] border border-[#D5CFDE] text-xs uppercase tracking-[0.2em] font-semibold px-7 py-4 rounded-xl transition-all duration-300 min-h-[50px]"
                >
                  <span>Our Savoir-Faire</span>
                  <Icons.ChevronDown className="w-4 h-4 text-[#7A7D8F]" />
                </a>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                variants={fadeInUp}
                className="mt-10 pt-6 border-t border-[#E6E2EA] flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-[#6B6F80]"
              >
                <div className="flex items-center gap-2">
                  <Icons.Sparkles className="w-4 h-4 text-[#C5A880]" />
                  <span>30% Extrait Concentration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                  <span>Cruelty-Free & Sustainable</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.Gift className="w-4 h-4 text-[#C5A880]" />
                  <span>Complimentary Discovery Sample</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Luxury Flacon Visual Stack */}
            <motion.div
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Primary Visual Frame */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] max-h-[560px] rounded-3xl overflow-hidden shadow-2xl border border-[#E6E2EA] group bg-[#EDE8E1]">
                <Image
                  src="/images/editorial/savoir-faire-botanical.jpg"
                  alt="Soulmate Scents Savoir-Faire Formulation Atelier"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C134F]/75 via-[#0C134F]/20 to-transparent" />

                {/* Top Corner Authenticity Seal */}
                <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/40 shadow-sm flex items-center gap-1.5">
                  <Icons.Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#0C134F]">
                    Batch No. 042
                  </span>
                </div>

                {/* Floating Glassmorphism Spec Sheet */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-xl text-[#121735]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#8C6B3A] font-sans mb-1">
                        Olfactory Standard
                      </p>
                      <h2 className="font-serif text-lg sm:text-xl font-normal text-[#0C134F]">
                        Extrait de Parfum Absolu
                      </h2>
                      <p className="text-xs text-[#6B6F80] font-light mt-0.5">
                        Handcrafted in small artisan kettles • 45-day dark cellaring
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-[#0C134F] text-[#C5A880] flex items-center justify-center shrink-0 shadow-md">
                      <Icons.ShieldCheck className="w-6 h-6 text-[#C5A880]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          2. ATELIER NUMBERS: The Haute Parfumerie Standard
      ========================================================================== */}
      <section className="w-full py-12 sm:py-16 bg-white border-b border-[#E6E2EA]">
        <Container size="wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {ATELIER_METRICS.map((metric, i) => (
              <motion.div
                key={i}
                className="relative p-6 sm:p-7 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC] hover:border-[#C5A880]/60 hover:bg-white hover:shadow-lg transition-all duration-300 group"
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                variants={fadeInUp}
              >
                <div className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#0C134F] tracking-tight group-hover:text-[#8C6B3A] transition-colors">
                  {metric.number}
                </div>
                <h2 className="font-sans text-xs uppercase tracking-[0.16em] font-semibold text-[#121735] mt-2 mb-1.5">
                  {metric.title}
                </h2>
                <p className="text-xs text-[#6B6F80] leading-relaxed font-light">
                  {metric.desc}
                </p>
                {/* Subtle gold line on bottom hover */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#C5A880] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full" />
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* =========================================================================
          3. INTERACTIVE OLFACTORY ARCHITECTURE: The Accord Explorer
      ========================================================================== */}
      <section className="w-full py-16 sm:py-24 bg-[#FAF7F3] border-b border-[#E6E2EA]">
        <Container size="wide">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-semibold text-[#8C6B3A] block mb-2 font-sans">
              THE ART OF THE PYRAMID
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#121735] tracking-tight leading-tight">
              Anatomy of a Soulmate Composition
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6F80] font-light mt-3 leading-relaxed max-w-xl mx-auto">
              A master perfume is not a static scent — it is a living olfactory journey that evolves in three harmonic acts over time.
            </p>
          </div>

          {/* Interactive Accord Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
            {ACCORD_LAYERS.map((accord) => {
              const isActive = activeTab === accord.id;
              return (
                <button
                  key={accord.id}
                  onClick={() => setActiveTab(accord.id)}
                  type="button"
                  className={`flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl font-sans text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 cursor-pointer min-h-[46px] border ${
                    isActive
                      ? "bg-[#0C134F] text-white border-[#0C134F] shadow-lg scale-102"
                      : "bg-white text-[#555968] border-[#E6E2EA] hover:bg-[#F3EFE6] hover:text-[#121735]"
                  }`}
                  aria-pressed={isActive}
                >
                  <span
                    className={`w-2 h-2 rounded-full transition-colors ${
                      isActive ? "bg-[#C5A880]" : "bg-[#C5BFCB]"
                    }`}
                  />
                  <span>{accord.frenchName}</span>
                  <span className="text-[10px] opacity-70">({accord.duration.split(" ")[0]})</span>
                </button>
              );
            })}
          </div>

          {/* Active Layer Dynamic Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedAccord.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl border border-[#E6E2EA] shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Accord Details (Left) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-[#FAF4E8] text-[#8C6B3A] border border-[#F5EAD4] text-[11px] font-semibold uppercase tracking-wider font-sans">
                      {selectedAccord.role}
                    </span>
                    <span className="text-xs text-[#7A7D8F] font-sans">
                      Duration: <strong className="text-[#121735]">{selectedAccord.duration}</strong>
                    </span>
                    <span className="text-xs text-[#7A7D8F] font-sans hidden sm:inline">•</span>
                    <span className="text-xs text-[#7A7D8F] font-sans">
                      Sillage: <strong className="text-[#121735]">{selectedAccord.sillage}</strong>
                    </span>
                  </div>

                  <div>
                    <p className="text-[11px] font-sans uppercase tracking-[0.24em] text-[#8C6B3A] font-semibold">
                      {selectedAccord.frenchName}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#0C134F] mt-1 mb-3">
                      {selectedAccord.englishTitle}
                    </h3>
                    <p className="font-serif italic text-base sm:text-lg text-[#555968] leading-relaxed">
                      &ldquo;{selectedAccord.quote}&rdquo;
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#6B6F80] font-light leading-relaxed">
                    {selectedAccord.description}
                  </p>
                </div>

                {/* Botanical Notes Ingredient Board (Right) */}
                <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#EBE6DC] rounded-2xl p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E6E2EA] pb-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0C134F] font-sans">
                      Primary Botanical Terroirs
                    </span>
                    <span className="text-[11px] text-[#8C6B3A] font-sans font-medium">
                      Natural Extracts
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedAccord.notes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 sm:p-3.5 bg-white rounded-xl border border-[#EAE6DF] hover:border-[#C5A880] transition-colors flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <p className="font-medium text-xs sm:text-sm text-[#121735] group-hover:text-[#0C134F]">
                            {note.name}
                          </p>
                          <p className="text-[11px] text-[#7A7D8F] font-light font-sans">
                            {note.origin}
                          </p>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md bg-[#FAF4E8] text-[#8C6B3A] font-sans">
                          {note.category}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-center">
                    <p className="text-[11px] text-[#8E95A2] font-sans italic">
                      Zero adulterants • Cold-filtered at 4°C for pristine purity
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Container>
      </section>

      {/* =========================================================================
          4. THE 4 PILLARS OF SAVOIR-FAIRE: Our Craftsmanship
      ========================================================================== */}
      <section id="savoir-faire" className="w-full py-16 sm:py-24 bg-white border-b border-[#E6E2EA]">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Sticky Editorial Intro */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-semibold text-[#8C6B3A] block font-sans">
                SAVOIR-FAIRE & ATELIER
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#121735] tracking-tight leading-tight">
                The Sacred Alchemy of Creation
              </h2>
              <p className="text-sm text-[#555968] font-light leading-relaxed">
                Unlike industrial perfumes mass-produced on automated conveyor belts, Soulmate Scents remains an unapologetic bastion of artisanal perfumery.
              </p>

              {/* Editorial Image in Sticky Section */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E6E2EA] shadow-md bg-[#EDE8E1]">
                <Image
                  src="/images/editorial/journal-jasmine.jpg"
                  alt="Grasse Jasmine Petals Harvesting"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C134F]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#F5EAD4]">Grasse, France</p>
                  <p className="font-serif text-sm">Sunrise Petal Extraction</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/perfumes"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#0C134F] hover:text-[#8C6B3A] transition-colors group"
                >
                  <span>Experience The Collection</span>
                  <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Steps Progression */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {CRAFTSMANSHIP_STEPS.map((step, idx) => (
                <motion.div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] hover:border-[#C5A880] hover:bg-white hover:shadow-md transition-all duration-300"
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                  variants={fadeInUp}
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="font-serif text-2xl sm:text-3xl font-light text-[#C5A880]">
                      {step.step}
                    </span>
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-semibold text-[#8C6B3A] px-3 py-1 bg-[#FAF4E8] rounded-full border border-[#F5EAD4]">
                      {step.subtitle}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#121735] mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6B6F80] font-light leading-relaxed mb-4">
                    {step.desc}
                  </p>

                  <div className="inline-flex items-center gap-2 text-xs font-medium text-[#0C134F] bg-white px-3 py-1.5 rounded-lg border border-[#E6E2EA]">
                    <Icons.Check className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{step.highlight}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          5. BOTANICAL INGREDIENTS SPOTLIGHT: Terroirs of the World
      ========================================================================== */}
      <section className="w-full py-16 sm:py-24 bg-[#FAF7F3] border-b border-[#E6E2EA]">
        <Container size="wide">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-semibold text-[#8C6B3A] block mb-2 font-sans">
              RARE BOTANICAL SOURCING
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#121735] tracking-tight leading-tight">
              From Sacred Terroirs to Your Skin
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6F80] font-light mt-3 leading-relaxed max-w-xl mx-auto">
              We travel to generational farms around the globe to secure rare natural essences that cannot be synthesized in a laboratory.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BOTANICALS.map((botanical, idx) => (
              <motion.div
                key={idx}
                className="group relative rounded-2xl overflow-hidden bg-white border border-[#E6E2EA] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                variants={fadeInUp}
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EDE8E1]">
                  <Image
                    src={botanical.image}
                    alt={botanical.name}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-editorial"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C134F]/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-[#0C134F] text-[10px] font-bold uppercase tracking-wider font-sans border border-white/50 shadow-xs">
                    {botanical.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C6B3A] block font-sans mb-1">
                      {botanical.country}
                    </span>
                    <h3 className="font-serif text-lg font-normal text-[#121735] group-hover:text-[#0C134F] transition-colors">
                      {botanical.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#6B6F80] font-light mt-2 pt-2 border-t border-[#F0ECE1]">
                    {botanical.notes}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* =========================================================================
          6. FOUNDER'S MANIFESTO: The Olfactory Creed
      ========================================================================== */}
      <section className="w-full py-16 sm:py-24 bg-[#F5EFE6]/70 border-b border-[#E6E2EA] relative overflow-hidden">
        <Container size="narrow">
          <motion.div
            className="text-center relative p-8 sm:p-14 bg-white rounded-3xl border border-[#E6E2EA] shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={fadeInUp}
          >
            {/* Gold Maison Crest Emblem */}
            <div className="w-14 h-14 rounded-full bg-[#0C134F] text-[#C5A880] flex items-center justify-center mx-auto mb-6 shadow-md border-2 border-[#C5A880]/40">
              <Icons.Sparkles className="w-6 h-6 text-[#C5A880]" />
            </div>

            <p className="text-[11px] font-sans uppercase tracking-[0.28em] font-semibold text-[#8C6B3A] mb-4">
              THE OLFACTORY CREED
            </p>

            <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl font-light text-[#121735] leading-relaxed italic mb-8">
              &ldquo;A fragrance is an emotional time machine. Long after places fade and conversations dissolve, a single inhalation can transport you back to the exact second you felt invincible, cherished, and alive.&rdquo;
            </blockquote>

            <div className="inline-flex flex-col items-center">
              <span className="font-serif text-lg font-normal text-[#0C134F]">
                Soulmate Scents Olfactory House
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#7A7D8F] font-sans mt-0.5">
                Master Parfumeur & Creative Direction
              </span>
              <div className="w-16 h-[1.5px] bg-[#C5A880] mt-3" />
            </div>
          </motion.div>
        </Container>
      </section>

      {/* =========================================================================
          7. CONSCIOUS LUXURY & COMMITMENTS
      ========================================================================== */}
      <section className="w-full py-16 sm:py-24 bg-white border-b border-[#E6E2EA]">
        <Container size="wide">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-semibold text-[#8C6B3A] block mb-2 font-sans">
              STANDARDS OF EXCELLENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#121735] tracking-tight">
              Conscious Haute Parfumerie
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6F80] font-light mt-2 max-w-lg mx-auto">
              Luxury without compromise. We formulate with absolute transparency, ethical stewardship, and exquisite presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMMITMENTS.map((item, idx) => {
              const IconComp = Icons[item.icon as keyof typeof Icons] || Icons.Sparkles;
              return (
                <motion.div
                  key={idx}
                  className="p-7 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC] hover:border-[#C5A880]/70 hover:bg-white hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center group"
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                  variants={fadeInUp}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[#E6E2EA] group-hover:border-[#C5A880] group-hover:bg-[#0C134F] text-[#0C134F] group-hover:text-[#C5A880] flex items-center justify-center mb-5 transition-all duration-300 shadow-xs">
                    <IconComp className="w-6 h-6 transition-colors" />
                  </div>
                  <h3 className="font-serif text-lg font-normal text-[#121735] mb-2 group-hover:text-[#0C134F] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B6F80] font-light leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* =========================================================================
          8. CINEMATIC CLOSING BANNER / CONCIERGE CTA
      ========================================================================== */}
      <section className="w-full py-20 sm:py-28 bg-[#0C134F] text-white relative overflow-hidden">
        {/* Ambient gold glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4ADFC]/10 rounded-full blur-3xl pointer-events-none" />

        <Container size="narrow">
          <motion.div
            className="text-center relative z-10 space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={fadeInUp}
          >
            <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-[#C5A880] font-semibold block">
              YOUR OLFACTORY ODYSSEY BEGINS
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight">
              Find Your Soulmate Signature
            </h2>

            <p className="text-sm sm:text-base text-[#C5BFCB] font-light max-w-xl mx-auto leading-relaxed">
              Step into our olfactory wardrobe. Discover fragrances formulated to echo your temperament, elevate your presence, and leave an indelible impression.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/perfumes"
                className="inline-flex items-center gap-3 bg-[#C5A880] hover:bg-[#B39266] text-[#0C134F] font-bold text-xs uppercase tracking-[0.2em] px-9 py-4 rounded-xl shadow-xl transition-all duration-300 min-h-[50px] group"
              >
                <span>Shop The Collection</span>
                <Icons.ArrowRight className="w-4 h-4 text-[#0C134F] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-xl backdrop-blur-md transition-all duration-300 min-h-[50px]"
              >
                <span>Consult Perfume Concierge</span>
              </Link>
            </div>

            <p className="text-[11px] text-[#9497A8] font-sans pt-4 tracking-wider uppercase">
              Free Express Delivery in Pakistan • Complimentary 2ml Discovery Flacon Included
            </p>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};
