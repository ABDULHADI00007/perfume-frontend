"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
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
    icon: <Sparkles className="w-5 h-5 text-[#590B16]" strokeWidth={1.5} />,
    items: [
      {
        q: "What makes Soulmate Scents Eau de Parfum (EDP) last so long?",
        a: "Soulmate Scents crafts concentrated Eau de Parfum (EDP) using 25% to 30% imported pure aromatic essence oils—significantly higher than typical commercial perfumes which use only 12% to 18%. Specially formulated for Pakistan's warm climate, our fragrances deliver 12 to 18+ hours of lasting longevity on skin and over 24 hours on clothes without harsh alcohol evaporation.",
      },
      {
        q: "How long do Soulmate Scents fragrances last on skin and clothes?",
        a: "Due to our concentrated 25%–30% Eau de Parfum formulation and matured botanical oils, our fragrances typically last 12 to 18+ hours on skin and remain noticeably fragrant on fabrics for multiple days. The scent profile develops gracefully from vivid top notes to deep, rich base notes.",
      },
      {
        q: "Are Soulmate Scents original formulations or impressions / copies?",
        a: "All Soulmate Scents creations are bespoke, original high-luxury formulations crafted in artisanal small batches using ethically sourced raw essences—including aged Mysore sandalwood, French Grasse rose, Cambodian oud, and ambergris.",
      },
      {
        q: "Are your fragrances safe for sensitive skin?",
        a: "Yes. Because our formulations use up to 30% pure fragrance oil and significantly less alcohol than mass-market fragrances, they are much gentler on the skin and avoid the drying effects or irritation often caused by cheap alcohol-heavy sprays.",
      },
    ],
  },
  {
    category: "Application & Storage Rituals",
    icon: <Clock className="w-5 h-5 text-[#590B16]" strokeWidth={1.5} />,
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
    icon: <Truck className="w-5 h-5 text-[#590B16]" strokeWidth={1.5} />,
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
        a: "Yes. We offer 100% free white-glove doorstep delivery across Pakistan on all orders with no minimum spend.",
      },
      {
        q: "Can I track my parcel once shipped?",
        a: "Absolutely. As soon as your parcel is dispatched, you will receive an SMS and email notification with your active courier tracking number.",
      },
    ],
  },
  {
    category: "Returns, Damages & Customer Care",
    icon: <RefreshCw className="w-5 h-5 text-[#590B16]" strokeWidth={1.5} />,
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
    category: "Eau de Parfum (Soulmate Scents)",
    oil: "25% to 30% Pure Essence",
    longevity: "12 to 18+ Hours",
    projection: "Strong & Long-Lasting",
    bestFor: "Signature Scent, Daily Luxury & Events",
    isHighlight: true,
  },
  {
    category: "Commercial Eau de Parfum (EDP)",
    oil: "12% to 18% Oil",
    longevity: "4 to 6 Hours",
    projection: "Moderate Sillage",
    bestFor: "Standard Daily Office Wear",
    isHighlight: false,
  },
  {
    category: "Eau de Toilette (EDT)",
    oil: "5% to 10% Oil",
    longevity: "2 to 4 Hours",
    projection: "Light / Fresh",
    bestFor: "Summer & Casual Routine",
    isHighlight: false,
  },
  {
    category: "Body Sprays & Colognes",
    oil: "1% to 3% Oil",
    longevity: "Under 1 Hour",
    projection: "Faint Burst",
    bestFor: "Post-Gym & Quick Refreshment",
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

  // Website's signature serif font family (matching "Warm Regards," and luxury headers)
  const websiteSerifFont = "var(--font-serif), 'Cormorant Garamond', 'Playfair Display', Georgia, serif";

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="bg-[#FAF9F6] text-black min-h-screen py-8 sm:py-14 font-sans selection:bg-[#590B16]/20">
        <Container size="wide">
          {/* Breadcrumb Navigation matching site standard */}
          <nav className="text-xs font-sans text-stone-500 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
              <span>Home</span>
            </Link>
            <span className="text-[#C5A880]">&gt;</span>
            <span className="text-black font-semibold">Help & FAQ Guide</span>
          </nav>

          {/* Header Section matching Warm Regards & Site Header Typography */}
          <div className="mb-10 sm:mb-14 text-left">
            <Badge variant="accent" className="mb-3 bg-[#590B16]/10 text-[#590B16] border border-[#590B16]/20 font-sans">
              <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-[#590B16]" strokeWidth={1.5} />
              CLIENT HELP & SCENT KNOWLEDGE
            </Badge>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight"
              style={{ fontFamily: websiteSerifFont, fontWeight: 700 }}
            >
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm text-black/80 font-sans font-normal mt-2 max-w-2xl leading-relaxed">
              Everything you need to know about Soulmate Scents luxury formulations, lasting longevity, nationwide courier dispatch, and our client satisfaction guarantee.
            </p>
          </div>

          {/* Concentration Comparison Matrix Table (Clean & Minimal) */}
          <div className="mb-14 p-5 sm:p-7 rounded-2xl border border-[#E2DED6] bg-white shadow-xs">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
              <div>
                <Badge variant="accent" className="mb-2 bg-[#590B16]/10 text-[#590B16] border border-[#590B16]/20 font-sans">
                  <Layers className="w-3.5 h-3.5 mr-1.5 text-[#590B16]" strokeWidth={1.5} />
                  FRAGRANCE LONGEVITY GUIDE
                </Badge>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-black tracking-tight"
                  style={{ fontFamily: websiteSerifFont, fontWeight: 700 }}
                >
                  Perfume Concentration Guide
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm font-sans font-normal text-left sm:text-right">
                Why Soulmate Scents Eau de Parfum lasts 12-18+ hours in Pakistan&apos;s climate compared to standard commercial perfumes.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans min-w-[620px]">
                <thead className="border-b border-[#F0ECE1] text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                  <tr>
                    <th className="pb-3 px-4 font-semibold">Category</th>
                    <th className="pb-3 px-4 font-semibold">Pure Essence Oil</th>
                    <th className="pb-3 px-4 font-semibold">Skin Longevity</th>
                    <th className="pb-3 px-4 font-semibold">Sillage & Aura</th>
                    <th className="pb-3 px-4 font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE1]">
                  {CONCENTRATION_MATRIX.map((row) => (
                    <tr
                      key={row.category}
                      className={`transition-colors ${
                        row.isHighlight
                          ? "bg-[#590B16]/[0.03] text-[#590B16] font-medium"
                          : "text-stone-700 hover:bg-stone-50/60"
                      }`}
                    >
                      <td className="py-4 px-4 flex items-center gap-2 font-sans font-semibold">
                        {row.isHighlight && <Sparkles size={13} strokeWidth={1.5} className="text-[#590B16]" />}
                        <span className={row.isHighlight ? "text-[#590B16] font-bold" : "text-stone-900"}>{row.category}</span>
                      </td>
                      <td className={`py-4 px-4 font-sans ${row.isHighlight ? "font-bold text-[#590B16]" : "font-medium text-stone-900"}`}>
                        {row.oil}
                      </td>
                      <td className={`py-4 px-4 font-sans ${row.isHighlight ? "font-bold text-[#590B16]" : "font-medium text-stone-900"}`}>
                        {row.longevity}
                      </td>
                      <td className="py-4 px-4 font-sans text-stone-700">{row.projection}</td>
                      <td className="py-4 px-4 font-sans text-stone-500 font-normal">{row.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Categorized FAQs Accordion & Sticky Contact Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: FAQs Accordion (Takes 8 cols) */}
            <div className="lg:col-span-8 space-y-10 text-left">
              {FAQ_CATEGORIES.map((category) => (
                <div key={category.category} className="space-y-4">
                  {/* Category Header with Clean Minimal Icon */}
                  <div className="flex items-center gap-3 pb-2.5 border-b border-[#F0ECE1]">
                    <span className="text-[#590B16] shrink-0" aria-hidden="true">
                      {category.icon}
                    </span>
                    <h3
                      className="text-xl sm:text-2xl font-bold text-black tracking-tight"
                      style={{ fontFamily: websiteSerifFont, fontWeight: 700 }}
                    >
                      {category.category}
                    </h3>
                  </div>

                  {/* Clean Minimal Question Items with Smooth Accordion Animation */}
                  <div className="bg-white rounded-2xl border border-[#E2DED6] divide-y divide-[#F0ECE1] px-5 sm:px-6 shadow-xs overflow-hidden">
                    {category.items.map((item, idx) => {
                      const key = `${category.category}-${idx}`;
                      const isOpen = openItem === key;

                      return (
                        <div key={key} className="py-4 sm:py-5 transition-colors">
                          <button
                            type="button"
                            onClick={() => toggle(key)}
                            aria-expanded={isOpen}
                            className="w-full flex items-center justify-between text-left cursor-pointer gap-4 group py-0.5"
                          >
                            <span
                              className={`font-sans text-sm sm:text-base leading-snug transition-colors pr-2 ${
                                isOpen
                                  ? "text-[#590B16] font-semibold"
                                  : "text-stone-900 font-medium group-hover:text-[#590B16]"
                              }`}
                            >
                              {item.q}
                            </span>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                              className="shrink-0"
                            >
                              <Icons.ChevronDown
                                size={17}
                                strokeWidth={1.5}
                                className={`transition-colors ${
                                  isOpen ? "text-[#590B16]" : "text-stone-400 group-hover:text-stone-700"
                                }`}
                              />
                            </motion.div>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                key="content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="pt-3 pb-1 text-xs sm:text-sm text-stone-600 font-sans leading-relaxed space-y-3 text-left">
                                  <p className="leading-relaxed">{item.a}</p>
                                  {item.steps && (
                                    <ol className="list-decimal pl-5 space-y-1.5 font-medium text-stone-700 bg-[#FAF8F5] p-3.5 rounded-xl text-left border border-stone-200/60 mt-3">
                                      {item.steps.map((step, sIdx) => (
                                        <li key={sIdx}>{step}</li>
                                      ))}
                                    </ol>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                <ShieldCheck className="w-8 h-8 text-[#C5A880] mb-3" strokeWidth={1.5} />
                <h3
                  className="text-2xl sm:text-3xl font-bold mb-2 text-white tracking-tight"
                  style={{ fontFamily: websiteSerifFont, fontWeight: 700 }}
                >
                  Still Have Questions?
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 mb-6 font-sans font-normal leading-relaxed">
                  Our fragrance concierge team is available 7 days a week to guide you with personal scent recommendations or order queries.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://wa.me/923337615355"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#590B16] font-semibold text-xs uppercase tracking-wider hover:bg-stone-100 transition-colors shadow-md font-sans"
                  >
                    <Icons.Phone className="w-4 h-4" strokeWidth={1.5} />
                    <span>WhatsApp Concierge</span>
                  </a>
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/40 text-white font-semibold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors font-sans"
                  >
                    <span>Contact Form</span>
                  </Link>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-[#E2DED6] bg-white space-y-2 text-left font-sans">
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
      </main>
    </>
  );
}
