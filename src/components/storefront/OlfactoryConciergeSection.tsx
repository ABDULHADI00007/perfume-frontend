"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ChevronDown, Search, Compass, BookOpen, Sparkles, ShieldCheck, HelpCircle, Layers, Send } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  definition?: string;
  steps?: string[];
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-extrait-vs-edp",
    question: "What is an Extrait de Parfum and how does it differ from Eau de Parfum?",
    answer:
      "An Extrait de Parfum is the purest form of fine fragrance. It contains between 30% and 40% pure aromatic oil. Standard Eau de Parfum contains only 15% to 20% oil. Extraits develop with rich depth on your skin. They offer 12 to 18 hours of smooth sillage without harsh alcohol evaporation.",
    definition: "Extrait de Parfum refers to the highest oil concentration in haute perfumery (30% to 40% pure essence), engineered for enduring longevity and complex dry-down.",
  },
  {
    id: "faq-how-to-apply",
    question: "How to apply luxury perfume for maximum longevity and projection?",
    answer:
      "To apply luxury perfume for maximum longevity, spray twice onto hydrated pulse points. Target the sides of your neck, inner wrists, and collarbone from six inches away. Never rub your wrists together. Rubbing creates heat that breaks delicate top notes before the heart accord can open and blossom.",
    steps: [
      "Hydrate the skin thoroughly with an unscented moisturizer or jojoba oil before spraying.",
      "Target high-temperature pulse points: the sides of the neck, inner wrists, and clavicle.",
      "Allow the fragrance to settle naturally—never rub wrists together, as friction crushes delicate top notes.",
      "Apply 2 to 3 mist sprays from a 6-inch distance for an even, vaporized scent aura.",
    ],
  },
  {
    id: "faq-rare-botanicals",
    question: "What rare botanicals and ingredients compose Soulmate Scents creations?",
    answer:
      "Soulmate Scents creates each perfume with rare and ethically harvested botanicals. Our formulas blend aged Mysore sandalwood, French Grasse rose, Turkish rose, and Sicilian bergamot. We also infuse noble ambergris and sustainable oriental oud oils. Each essence is gently macerated for months to achieve perfect harmony on your skin.",
    definition: "Olfactory Architecture represents our pyramid blending method pairing volatile solar citrus top notes with resinous woody base notes.",
  },
  {
    id: "faq-how-to-store",
    question: "How to store luxury perfume to preserve olfactory integrity?",
    answer:
      "To preserve your luxury perfume, keep the flacon upright in a cool and dark space. The ideal room temperature is between 15°C and 20°C. Always store the bottle inside its presentation box. Keep it away from bathroom humidity and direct sun so delicate botanicals stay fresh for many years.",
    definition: "Maceration stability is a preservation condition where dark, cool storage allows pure fragrance compounds to mature without oxidative breakdown.",
  },
  {
    id: "faq-niche-vs-designer",
    question: "What is the difference between niche perfume and designer fragrance?",
    answer:
      "Niche perfumery focuses on artistic expression rather than mass-market appeal. We use higher concentrations of pure natural essences instead of synthetic fixatives. Each formula is distilled in small artisan batches. Soulmate Scents extraits are made for fragrance lovers who want a distinctive and enduring personal scent aura.",
    definition: "Niche perfumery refers to independent fragrance houses that prioritize artistic expression, artisanal distillation, and noble raw materials over commercial trends.",
  },
];

export function OlfactoryConciergeSection() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "faq-extrait-vs-edp": true,
    "faq-how-to-apply": true,
    "faq-rare-botanicals": true,
    "faq-how-to-store": true,
    "faq-niche-vs-designer": true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [questionSubject, setQuestionSubject] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionSubject.trim()) {
      setSubmittedMessage(true);
      setTimeout(() => setSubmittedMessage(false), 4000);
      setQuestionSubject("");
    }
  };

  return (
    <section
      id="concierge-knowledge"
      aria-label="Haute Parfumerie Concierge and Knowledge Center"
      className="relative w-full bg-[#FAF7EE] border-t border-[#590B16]/10 pt-12 sm:pt-16 pb-20 select-none scroll-mt-24"
    >
      <Container size="wide">
        {/* Semantic Hierarchical Breadcrumb Navigation with Microdata */}
        <nav aria-label="breadcrumb" className="breadcrumb mb-8">
          <ol
            itemScope
            itemType="https://schema.org/BreadcrumbList"
            className="breadcrumb flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-serif text-[#590B16]/75 uppercase tracking-[0.16em]"
          >
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="breadcrumb-item"
            >
              <Link
                itemProp="item"
                href="/"
                className="hover:text-[#42060F] underline-offset-4 hover:underline"
              >
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li aria-hidden="true" className="text-[#590B16]/40">/</li>
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="breadcrumb-item"
            >
              <Link
                itemProp="item"
                href="/shop"
                className="hover:text-[#42060F] underline-offset-4 hover:underline"
              >
                <span itemProp="name">Haute Parfumerie</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <li aria-hidden="true" className="text-[#590B16]/40">/</li>
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="breadcrumb-item text-[#590B16] font-semibold"
              aria-current="page"
            >
              <span itemProp="name">Concierge & Scent Guide</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </nav>

        {/* Quick In-Page Jump Anchor Table of Contents for AI Agents & Users */}
        <nav
          aria-label="Homepage Section Table of Contents"
          className="mb-12 pb-6 border-b border-[#590B16]/10 flex flex-wrap items-center justify-between gap-4 text-xs tracking-[0.18em] uppercase font-serif text-[#590B16]"
        >
          <div className="flex items-center gap-2 font-semibold">
            <Compass size={14} className="text-[#590B16]" />
            <span id="toc-nav-label">Table of Contents:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] sm:text-xs">
            <a href="#parallax-gallery" className="hover:text-[#42060F] transition-colors underline-offset-4 hover:underline">
              01. Gallery
            </a>
            <a href="#discover-collection" className="hover:text-[#42060F] transition-colors underline-offset-4 hover:underline">
              02. Discover Collection
            </a>
            <a href="#art-of-scent" className="hover:text-[#42060F] transition-colors underline-offset-4 hover:underline">
              03. The Art of Scent
            </a>
            <a href="#new-collection" className="hover:text-[#42060F] transition-colors underline-offset-4 hover:underline">
              04. New Collection
            </a>
            <a href="#concierge-knowledge" className="hover:text-[#42060F] transition-colors underline-offset-4 hover:underline">
              05. Knowledge & FAQ
            </a>
          </div>
        </nav>

        {/* Section Header with Semantic Time Recency Signal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#590B16]/5 border border-[#590B16]/15 text-[11px] uppercase tracking-[0.22em] text-[#590B16] font-semibold mb-3">
              <Sparkles size={12} />
              <span>Haute Parfumerie Knowledge & FAQ</span>
            </div>
            <h2
              id="concierge-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#590B16] font-normal tracking-[0.02em] leading-tight"
              style={{ fontFamily: "'Cinzel', 'Marcellus', serif" }}
            >
              The Art & Science of Fragrance
            </h2>
            <p id="concierge-subheading-summary" className="mt-3 text-sm sm:text-base text-[#590B16]/80 font-sans leading-relaxed">
              Curated by Soulmate Scents master evaluators to guide your personal scent discovery, skin chemistry pairing, and application rituals.
            </p>
          </div>

          <div className="text-left md:text-right shrink-0">
            <span className="text-xs text-[#590B16]/60 uppercase tracking-widest block">Last Formulation Review</span>
            <time dateTime="2026-11-06" className="text-xs sm:text-sm font-semibold text-[#590B16] font-serif">
              November 6, 2026
            </time>
          </div>
        </div>

        {/* WebMCP Declarative Search Tool for AI Agents and Visitors */}
        <div className="mb-14 p-6 sm:p-8 bg-white/70 border border-[#590B16]/15 shadow-sm rounded-none">
          <form
            id="webmcp-search-form"
            action="/shop"
            method="GET"
            role="search"
            aria-label="Search Fragrance Catalog"
            {...({
              toolname: "searchCreations",
              tooldescription: "Search Soulmate Scents luxury perfume collection by note, family, or mood",
            } as Record<string, string>)}
            className="flex flex-col sm:flex-row items-stretch gap-3"
          >
            <div className="relative flex-1">
              <label htmlFor="agent-site-search" className="sr-only">
                Search luxury perfumes by olfactory note or name
              </label>
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#590B16]/50 pointer-events-none" />
              <input
                id="agent-site-search"
                type="search"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes: Bergamot, Ambergris, Bourbon Vanilla, Oud, Rose..."
                {...({
                  toolparamdescription: "Perfume name or olfactory note (e.g. Sultan's Veil, Bergamot, Amber)",
                } as Record<string, string>)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#590B16]/20 text-[#590B16] text-xs sm:text-sm placeholder:text-[#590B16]/40 focus:outline-none focus:border-[#590B16] font-sans"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-[#590B16] text-[#FAF7EE] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#42060F] transition-colors font-serif shrink-0 cursor-pointer"
            >
              Search Creations
            </button>
          </form>
        </div>

        {/* ================= STRUCTURED COMPARISON DATA TABLE ================= */}
        {/* Targets Table Featured Snippets and Machine Extraction */}
        <div className="mb-16 bg-white border border-[#590B16]/15 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#590B16]/15">
            <Layers size={18} className="text-[#590B16]" />
            <h3
              id="fragrance-concentration-comparison"
              className="text-base sm:text-lg uppercase tracking-[0.15em] font-semibold text-[#590B16] font-serif"
            >
              Haute Parfumerie Concentration Comparison Table
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#590B16]/75 mb-6 font-sans">
            A comprehensive reference matrix comparing perfume formulations by pure aromatic oil volume, endurance, and spatial presence.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
              <caption className="sr-only">
                Comparison of Perfume Concentration Types: Extrait de Parfum vs Eau de Parfum vs Eau de Toilette
              </caption>
              <thead>
                <tr className="border-b-2 border-[#590B16]/25 bg-[#FAF7EE] text-[#590B16] font-serif">
                  <th scope="col" className="py-3 px-4 uppercase tracking-wider font-bold">
                    Formulation Category
                  </th>
                  <th scope="col" className="py-3 px-4 uppercase tracking-wider font-bold">
                    Pure Essence Concentration
                  </th>
                  <th scope="col" className="py-3 px-4 uppercase tracking-wider font-bold">
                    Skin Longevity
                  </th>
                  <th scope="col" className="py-3 px-4 uppercase tracking-wider font-bold">
                    Sillage & Projection
                  </th>
                  <th scope="col" className="py-3 px-4 uppercase tracking-wider font-bold">
                    Best Ritual & Occasion
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#590B16]/10 text-[#590B16]/85">
                <tr className="bg-[#590B16]/[0.02] hover:bg-[#590B16]/[0.05] transition-colors">
                  <th scope="row" className="py-3.5 px-4 font-serif font-bold text-[#590B16]">
                    Extrait de Parfum (Soulmate Scents)
                  </th>
                  <td className="py-3.5 px-4 font-semibold">30% to 40% Pure Oil</td>
                  <td className="py-3.5 px-4">12 to 18+ Hours</td>
                  <td className="py-3.5 px-4">Intimate, Magnetic (Arm&apos;s Length)</td>
                  <td className="py-3.5 px-4">Evening, Signature Aura, Milestone Events</td>
                </tr>
                <tr className="hover:bg-[#590B16]/[0.05] transition-colors">
                  <th scope="row" className="py-3.5 px-4 font-serif font-bold text-[#590B16]">
                    Eau de Parfum (Standard EDP)
                  </th>
                  <td className="py-3.5 px-4">15% to 20% Pure Oil</td>
                  <td className="py-3.5 px-4">6 to 8 Hours</td>
                  <td className="py-3.5 px-4">Moderate Radiance (Room Enveloping)</td>
                  <td className="py-3.5 px-4">Daily Executive Wear & Daytime Gatherings</td>
                </tr>
                <tr className="hover:bg-[#590B16]/[0.05] transition-colors">
                  <th scope="row" className="py-3.5 px-4 font-serif font-bold text-[#590B16]">
                    Eau de Toilette (Diluted EDT)
                  </th>
                  <td className="py-3.5 px-4">8% to 12% Pure Oil</td>
                  <td className="py-3.5 px-4">3 to 5 Hours</td>
                  <td className="py-3.5 px-4">High Initial Burst, Rapid Dry-Down</td>
                  <td className="py-3.5 px-4">Post-Workout & High Summer Refreshment</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Grid: Left Column Definitions (DL) + Right Column Question/Answer (FAQ) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Semantic Definition List (<dl>, <dt>, <dd>) & Agent Ask Tool */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#590B16]/15">
              <BookOpen size={16} className="text-[#590B16]" />
              <h3 id="glossary-heading" className="text-sm uppercase tracking-[0.2em] font-semibold text-[#590B16] font-serif">
                Olfactory Glossary & Standards
              </h3>
            </div>

            <dl className="space-y-5 text-sm text-[#590B16]/85 font-sans divide-y divide-[#590B16]/10">
              <div className="pt-2">
                <dt className="font-serif font-bold text-[#590B16] text-base tracking-wide">
                  Extrait de Parfum
                </dt>
                <dd className="mt-1 leading-relaxed text-[#590B16]/80">
                  A high-concentration perfume blend composed of 30% to 40% fragrant oils, maximizing tenacity, skin intimacy, and continuous multi-phase development.
                </dd>
              </div>

              <div className="pt-4">
                <dt className="font-serif font-bold text-[#590B16] text-base tracking-wide">
                  Sillage & Diffusion
                </dt>
                <dd className="mt-1 leading-relaxed text-[#590B16]/80">
                  The atmospheric scent trail left in the wake of the wearer, carefully balanced in our laboratory so as never to overpower enclosed spaces.
                </dd>
              </div>

              <div className="pt-4">
                <dt className="font-serif font-bold text-[#590B16] text-base tracking-wide">
                  Heart Notes (Middle Accord)
                </dt>
                <dd className="mt-1 leading-relaxed text-[#590B16]/80">
                  The thematic core of the fragrance that emerges 15 to 30 minutes following application, providing lasting personality and character.
                </dd>
              </div>

              <div className="pt-4">
                <dt className="font-serif font-bold text-[#590B16] text-base tracking-wide">
                  Base Resins & Fixatives
                </dt>
                <dd className="mt-1 leading-relaxed text-[#590B16]/80">
                  Heavy molecular weight aromatics such as aged sandalwood, ambergris, and patchouli that anchor lighter volatile notes to the skin for 12+ hours.
                </dd>
              </div>
            </dl>

            {/* WebMCP Interactive submitQuestion Tool Form for Visitors & AI Agents */}
            <div className="pt-6 border-t border-[#590B16]/15">
              <form
                id="webmcp-question-form"
                onSubmit={handleQuestionSubmit}
                action="/contact"
                method="GET"
                {...({
                  toolname: "submitQuestion",
                  tooldescription: "Submit a bespoke fragrance consultation question to Soulmate Scents master evaluators",
                } as Record<string, string>)}
                className="space-y-3 p-4 bg-white/60 border border-[#590B16]/15"
              >
                <label htmlFor="agent-question-input" className="block text-xs font-serif font-bold text-[#590B16] uppercase tracking-wider">
                  Have an Olfactory Inquiry?
                </label>
                <div className="flex gap-2">
                  <input
                    id="agent-question-input"
                    type="text"
                    name="question"
                    value={questionSubject}
                    onChange={(e) => setQuestionSubject(e.target.value)}
                    placeholder="Ask about skin chemistry, notes, or gifting..."
                    {...({
                      toolparamdescription: "Inquiry topic or question about perfume formulation or notes",
                    } as Record<string, string>)}
                    className="flex-1 px-3 py-2 bg-white border border-[#590B16]/20 text-[#590B16] text-xs placeholder:text-[#590B16]/40 focus:outline-none focus:border-[#590B16] font-sans"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#590B16] text-[#FAF7EE] text-xs uppercase font-serif tracking-widest hover:bg-[#42060F] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Send size={12} />
                    <span>Inquire</span>
                  </button>
                </div>
                {submittedMessage && (
                  <p className="text-xs text-green-700 font-sans">
                    Thank you. A master evaluator will respond to your inquiry shortly.
                  </p>
                )}
              </form>
            </div>

            {/* Trust and Authority Links (About, Contact, Terms, Privacy) */}
            <div className="pt-4 border-t border-[#590B16]/15 flex flex-wrap items-center gap-3 text-xs font-serif text-[#590B16]/90">
              <div className="flex items-center gap-1.5 font-semibold text-[#590B16]">
                <ShieldCheck size={14} />
                <span id="authority-badge-label">Verified Trust:</span>
              </div>
              <Link href="/about" className="hover:text-[#42060F] underline underline-offset-4">
                About Maison
              </Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-[#42060F] underline underline-offset-4">
                Concierge Contact
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-[#42060F] underline underline-offset-4">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-[#42060F] underline underline-offset-4">
                Privacy Rights
              </Link>
              <span>•</span>
              <Link href="/shipping" className="hover:text-[#42060F] underline underline-offset-4">
                Shipping Policy
              </Link>
              <span>•</span>
              <Link href="/returns" className="hover:text-[#42060F] underline underline-offset-4">
                Returns Policy
              </Link>
            </div>
          </div>

          {/* Right Column: Question-Based Headings & Concise Answer Snippets */}
          {/* Content is fully persistent in the DOM for search engines & AI answer targeting */}
          <div id="faq-answers" className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#590B16]/15">
              <HelpCircle size={16} className="text-[#590B16]" />
              <h3 id="faq-section-heading" className="text-sm uppercase tracking-[0.2em] font-semibold text-[#590B16] font-serif">
                Frequently Addressed Questions (FAQ)
              </h3>
            </div>

            {FAQ_ITEMS.map((item) => {
              const isOpen = !!openIds[item.id];
              return (
                <article
                  key={item.id}
                  className="bg-white border border-[#590B16]/15 transition-all duration-300 overflow-hidden"
                >
                  {/* Clean Direct Heading Tag with Click Toggle */}
                  <div
                    onClick={() => toggleFaq(item.id)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-panel-${item.id}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleFaq(item.id);
                      }
                    }}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF7EE]/50 transition-colors"
                  >
                    <h3
                      id={item.id}
                      className="text-base sm:text-lg font-serif font-bold text-[#590B16] tracking-wide"
                      style={{ fontFamily: "'Cinzel', 'Marcellus', serif" }}
                    >
                      {item.question}
                    </h3>
                    <ChevronDown
                      size={18}
                      className={`text-[#590B16] transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* DOM-Persistent Paragraph for Immediate Search Engine Snippet Targeting */}
                  <div
                    id={`faq-answer-panel-${item.id}`}
                    className={`px-5 pb-6 text-sm text-[#590B16]/85 font-sans leading-relaxed border-t border-[#590B16]/10 pt-4 space-y-3 ${
                      isOpen ? "block" : "hidden sm:block"
                    }`}
                  >
                    <p className="leading-relaxed text-[#590B16]/90">{item.answer}</p>
                    {item.steps && (
                      <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm font-medium text-[#590B16]/85 mt-2">
                        {item.steps.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    )}
                    {item.definition && (
                      <p className="text-xs italic text-[#590B16]/75 bg-[#FAF7EE] p-3 border-l-2 border-[#590B16] mt-2">
                        {item.definition}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
