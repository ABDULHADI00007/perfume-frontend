"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";
import { Sparkles, Layers, ShieldCheck, HelpCircle, Truck, RefreshCw, Clock } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
  steps?: string[];
  tips?: string;
}

interface FAQCategory {
  category: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    category: "Fragrance Formulation & Longevity",
    icon: <Sparkles className="w-4 h-4 text-[#590B16]" />,
    items: [
      {
        q: "What is an Extrait de Parfum and how does it differ from Eau de Parfum?",
        a: "An Extrait de Parfum is the highest and purest concentration of fine fragrance. It contains between 30% and 40% pure aromatic perfume oil, compared to standard Eau de Parfum (EDP) which only contains 15% to 20% oil. This allows Soulmate Scents extraits to deliver 12 to 18+ hours of continuous, smooth longevity on skin and over 24 hours on fabrics without harsh alcohol evaporation.",
      },
      {
        q: "How long do Soulmate Scents fragrances last on skin and clothes?",
        a: "Due to our high 30%–40% extrait concentration and macerated botanical oils, our fragrances typically last 12–18 hours on skin and remain noticeably fragrant on fabrics for multiple days. The character develops gracefully from vivid solar top notes to deep, intimate resinous base accords.",
      },
      {
        q: "Are Soulmate Scents original formulations or impressions / copies?",
        a: "All Soulmate Scents creations are bespoke, original high-luxury formulations crafted in artisanal small batches using ethically sourced raw essences—including aged Mysore sandalwood, French Grasse rose, Cambodian oud, and ambergris.",
      },
      {
        q: "Are your fragrances safe for sensitive skin?",
        a: "Yes. Because our formulations use up to 40% pure fragrance oil and significantly less alcohol than mass-market fragrances, they are much gentler on the skin and avoid the drying effects or irritation often caused by cheap alcohol-heavy sprays.",
      },
    ],
  },
  {
    category: "Application & Storage Rituals",
    icon: <Clock className="w-4 h-4 text-[#590B16]" />,
    items: [
      {
        q: "How should I apply perfume for maximum longevity and projection?",
        a: "For optimal sillage and lasting power, follow these master evaluator application steps:",
        steps: [
          "Moisturize skin with an unscented lotion or oil before spraying to lock in the fragrance molecules.",
          "Target high-temperature pulse points: the sides of your neck, inner wrists, and collarbone.",
          "Never rub your wrists together—friction creates heat that crushes delicate top notes before the scent develops.",
          "Apply 2 to 3 mist sprays from 6 inches away for an even, luxurious scent cloud.",
        ],
      },
      {
        q: "How should I store luxury perfume to preserve its freshness?",
        a: "Keep your perfume bottles upright in a cool, dark environment away from direct sunlight and bathroom humidity. Ideal room temperature is between 15°C and 20°C. Storing the bottle inside its presentation box protects delicate botanical extracts for years.",
      },
    ],
  },
  {
    category: "Orders, Shipping & Cash on Delivery (COD)",
    icon: <Truck className="w-4 h-4 text-[#590B16]" />,
    items: [
      {
        q: "Is Cash on Delivery (COD) available across Pakistan?",
        a: "Yes! We offer 100% Cash on Delivery (COD) to all cities, towns, and regions across Pakistan, as well as direct bank wire transfer options.",
      },
      {
        q: "How long does courier delivery take?",
        a: "Domestic orders within Pakistan are delivered within 2 to 4 business days via express white-glove couriers (TCS / Trax). Major metropolitan cities like Karachi, Lahore, and Islamabad / Rawalpindi often receive delivery within 48 hours.",
      },
      {
        q: "Do you offer free delivery?",
        a: "Yes. All domestic orders above the free shipping threshold qualify for complimentary white-glove doorstep delivery.",
      },
      {
        q: "Can I track my parcel once shipped?",
        a: "Absolutely. As soon as your parcel is dispatched, you will receive an SMS and email notification with your active courier tracking number.",
      },
    ],
  },
  {
    category: "Returns, Damages & Customer Care",
    icon: <RefreshCw className="w-4 h-4 text-[#590B16]" />,
    items: [
      {
        q: "What is your return and replacement policy?",
        a: "We offer an easy 7-day return and exchange window on all unopened, factory-sealed flacons. If your order arrives damaged or leaking during courier transit, contact our concierge within 48 hours and we will ship an immediate replacement flacon at zero extra charge.",
      },
      {
        q: "How do I reach the Soulmate Scents concierge team?",
        a: "You can reach our VIP Concierge team directly via WhatsApp (+92 333 7615355), email (soulmatescents@gmail.com), or through our Contact page.",
      },
    ],
  },
];

const CONCENTRATION_MATRIX = [
  {
    category: "Extrait de Parfum (Soulmate Scents)",
    oil: "30% to 40% Pure Oil",
    longevity: "12 to 18+ Hours",
    projection: "Magnetic & Deep",
    bestFor: "Signature Scent, Evenings & Milestones",
    isHighlight: true,
  },
  {
    category: "Eau de Parfum (EDP)",
    oil: "15% to 20% Oil",
    longevity: "6 to 8 Hours",
    projection: "Moderate Sillage",
    bestFor: "Daily Office & Daytime Wear",
    isHighlight: false,
  },
  {
    category: "Eau de Toilette (EDT)",
    oil: "5% to 15% Oil",
    longevity: "3 to 5 Hours",
    projection: "Light / Fresh",
    bestFor: "Casual Gym & Warm Weather",
    isHighlight: false,
  },
  {
    category: "Eau de Cologne (EDC)",
    oil: "2% to 4% Oil",
    longevity: "1 to 2 Hours",
    projection: "Faint",
    bestFor: "Post-Shower Refreshment",
    isHighlight: false,
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>("Fragrance Formulation & Longevity-0");

  const toggle = (key: string) => {
    setOpenItem((prev) => (prev === key ? null : key));
  };

  // Structured Data Schema for Google & AI Search Engines
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_CATEGORIES.flatMap((cat) =>
      cat.items.map((item) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a,
        },
      }))
    ),
  };

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="bg-[#FAF9F6] min-h-screen text-black">
        {/* Header Section (Full Wide Container Left Aligned) */}
        <section className="border-b border-[#F0ECE1] bg-white py-10 sm:py-16">
          <Container size="wide">
            <div className="w-full text-left">
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center gap-2 text-xs font-sans text-stone-500 uppercase tracking-wider">
                  <li>
                    <Link href="/" className="hover:text-black transition-colors">
                      Home
                    </Link>
                  </li>
                  <li className="text-stone-300">&gt;</li>
                  <li className="text-black font-semibold">Help & FAQ Guide</li>
                </ol>
              </nav>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#590B16]/10 text-[#590B16] text-[11px] uppercase tracking-[0.2em] font-semibold mb-3">
                <HelpCircle size={13} />
                <span>Client Help & Scent Knowledge</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-black tracking-tight leading-tight mb-4 text-left">
                Frequently Asked Questions
              </h1>

              <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed max-w-3xl text-left">
                Everything you need to know about Soulmate Scents luxury formulations, lasting longevity, nationwide courier dispatch, and our client satisfaction guarantee.
              </p>
            </div>
          </Container>
        </section>

        {/* Concentration Comparison Matrix Table (Full Wide Container Left Aligned) */}
        <section className="py-10 sm:py-14 border-b border-[#F0ECE1] bg-[#FAF8F5]">
          <Container size="wide">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C5A880] font-bold mb-1">
                  <Layers size={14} />
                  <span>Fragrance Longevity Matrix</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
                  Perfume Concentration Guide
                </h2>
              </div>
              <p className="text-xs text-stone-500 max-w-sm font-sans text-left sm:text-right">
                Why Soulmate Scents extraits last 12-18+ hours compared to standard commercial perfumes.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E2DED6] bg-white shadow-xs">
              <table className="w-full text-left text-xs font-sans min-w-[620px]">
                <thead className="bg-[#590B16] text-white uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Pure Essence Oil</th>
                    <th className="py-3 px-4">Skin Longevity</th>
                    <th className="py-3 px-4">Sillage & Aura</th>
                    <th className="py-3 px-4">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {CONCENTRATION_MATRIX.map((row) => (
                    <tr
                      key={row.category}
                      className={`transition-colors ${
                        row.isHighlight
                          ? "bg-[#590B16]/5 font-semibold text-[#590B16]"
                          : "text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <td className="py-3 px-4 flex items-center gap-2">
                        {row.isHighlight && <Sparkles size={13} className="text-[#590B16]" />}
                        <span>{row.category}</span>
                      </td>
                      <td className="py-3 px-4 font-mono">{row.oil}</td>
                      <td className="py-3 px-4 font-mono">{row.longevity}</td>
                      <td className="py-3 px-4">{row.projection}</td>
                      <td className="py-3 px-4 text-stone-500 font-normal">{row.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>

        {/* Categorized FAQs Accordion (Left Aligned with Wide Container) */}
        <section className="py-12 sm:py-18">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: FAQs Accordion (Takes 8 cols) */}
              <div className="lg:col-span-8 space-y-10 text-left">
                {FAQ_CATEGORIES.map((category) => (
                  <div key={category.category} className="space-y-4">
                    {/* Category Header */}
                    <div className="flex items-center gap-2.5 pb-2 border-b border-[#F0ECE1]">
                      <div className="w-7 h-7 rounded-lg bg-[#590B16]/10 flex items-center justify-center">
                        {category.icon}
                      </div>
                      <h3 className="font-serif text-lg sm:text-xl font-normal text-stone-900">
                        {category.category}
                      </h3>
                    </div>

                    {/* Question Items */}
                    <div className="space-y-2.5">
                      {category.items.map((item, idx) => {
                        const key = `${category.category}-${idx}`;
                        const isOpen = openItem === key;

                        return (
                          <div
                            key={key}
                            className={`rounded-xl border transition-all ${
                              isOpen
                                ? "border-[#590B16]/40 bg-white shadow-xs"
                                : "border-[#E2DED6] bg-white hover:border-stone-400"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggle(key)}
                              aria-expanded={isOpen}
                              className="w-full flex items-center justify-between p-4 text-left cursor-pointer gap-4"
                            >
                              <span className="font-serif text-sm sm:text-base font-semibold text-stone-900">
                                {item.q}
                              </span>
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                                  isOpen
                                    ? "rotate-180 bg-[#590B16] text-white"
                                    : "text-stone-400 bg-stone-100"
                                }`}
                              >
                                <Icons.ChevronDown size={14} />
                              </span>
                            </button>

                            {isOpen && (
                              <div className="px-4 pb-4 pt-1 border-t border-stone-100 text-xs sm:text-sm text-stone-600 font-sans leading-relaxed space-y-3 text-left">
                                <p>{item.a}</p>
                                {item.steps && (
                                  <ol className="list-decimal pl-5 space-y-1.5 font-medium text-stone-700 bg-stone-50 p-3 rounded-lg text-left">
                                    {item.steps.map((step, sIdx) => (
                                      <li key={sIdx}>{step}</li>
                                    ))}
                                  </ol>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Sticky Concierge Help Card (Takes 4 cols) */}
              <aside className="lg:col-span-4 sticky top-24 space-y-6">
                <div className="rounded-2xl bg-gradient-to-br from-[#590B16] to-[#3E060E] text-white p-6 sm:p-8 text-left shadow-lg">
                  <ShieldCheck className="w-9 h-9 text-[#C5A880] mb-3" />
                  <h3 className="font-serif text-xl sm:text-2xl font-normal mb-2 text-white">
                    Still Have Questions?
                  </h3>
                  <p className="text-xs text-stone-200 mb-6 font-sans leading-relaxed">
                    Our fragrance concierge team is available 7 days a week to guide you with personal scent recommendations or order queries.
                  </p>
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://wa.me/923337615355"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#590B16] font-semibold text-xs uppercase tracking-wider hover:bg-stone-100 transition-colors shadow-md"
                    >
                      <Icons.Phone className="w-4 h-4" />
                      <span>WhatsApp Concierge</span>
                    </a>
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/40 text-white font-semibold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
                    >
                      <span>Contact Form</span>
                    </Link>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-[#E2DED6] bg-white space-y-2 text-left">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Direct Contact
                  </div>
                  <div className="text-xs text-stone-800 font-medium">
                    Phone: +92 333 7615355
                  </div>
                  <div className="text-xs text-stone-800 font-medium">
                    Email: soulmatescents@gmail.com
                  </div>
                  <div className="text-[11px] text-stone-500 pt-1">
                    Monday – Sunday: 10:00 AM – 10:00 PM PKT
                  </div>
                </div>
              </aside>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
