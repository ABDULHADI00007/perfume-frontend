"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Icons } from "@/components/ui/icons";

const faqs = [
  {
    category: "Fragrance & Ingredients",
    items: [
      {
        q: "What is an Extrait de Parfum?",
        a: "Extrait de Parfum is the highest concentration of fragrance oil, typically 25–40% pure aromatic compounds suspended in alcohol. Our extraits range from 28–32%, which gives them an exceptional depth, longevity (12+ hours), and skin-intimate character that lighter concentrations cannot achieve.",
      },
      {
        q: "Are your fragrances synthetic-free?",
        a: "We use no synthetic diluents or aromachemical fillers. We do, however, selectively use certain safe, ethically produced aroma molecules where they serve a specific compositional purpose — always disclosed in our full ingredient lists.",
      },
      {
        q: "How long do your fragrances last on skin?",
        a: "Due to our high extrait concentration, our fragrances typically last 12–18+ hours. The character changes beautifully across that time, from vivid top notes to deep, intimate base accords.",
      },
      {
        q: "Where are your ingredients sourced?",
        a: "Single-origin Mysore sandalwood, Grasse jasmine harvested at twilight, aged Cambodian oud, and Moroccan rose absolute — all sourced directly from sustainable farms and distilleries with transparent supply chains.",
      },
    ],
  },
  {
    category: "Orders & Delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery is 3–5 business days domestically. International orders arrive within 7–14 business days. All orders are packaged with archival tissue, a wax seal, and a personal handwritten note.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes — complimentary shipping on all domestic orders over PKR 5,000. International orders over USD 150 ship free. All orders include a complimentary sample and presentation box.",
      },
      {
        q: "Can I track my order?",
        a: "Yes. Once dispatched, you will receive a tracking link via email. Our concierge team is also available to provide updates at any time.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        q: "What is your returns policy?",
        a: "We offer a 14-day returns window on all unopened, sealed flacons. Given the intimate nature of fragrance, opened products cannot be returned unless genuinely faulty. Please refer to our Returns page for full details.",
      },
      {
        q: "My order arrived damaged — what should I do?",
        a: "Please contact our concierge team within 48 hours of delivery with photographs of the damaged item and packaging. We will arrange an immediate replacement at no cost.",
      },
    ],
  },
  {
    category: "Discovery Set",
    items: [
      {
        q: "What is included in the Discovery Set?",
        a: "Five 5ml Extrait flacons of our signature fragrances, a handmade linen presentation box, a comprehensive olfactory tasting guide, and a full-value voucher redeemable toward any 100ml flacon purchase.",
      },
      {
        q: "Can I choose which fragrances are in the Discovery Set?",
        a: "The Discovery Set is curated to present our five signature extraits in their intended seasonal arc. If you have a specific enquiry about a bespoke discovery experience, please contact our concierge.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggle = (key: string) => setOpenItem((prev) => (prev === key ? null : key));

  return (
    <main className="bg-background min-h-screen">

      {/* Header */}
      <section className="border-b border-border/60 py-20 sm:py-28">
        <Container size="default">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-3 mb-6">
              <span className="w-6 h-[1px] bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.28em] font-medium text-foreground-muted font-sans">
                Information
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-foreground leading-[1.1] tracking-tight mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-base text-foreground-muted font-sans font-light leading-relaxed">
              Answers to the most common enquiries about our fragrances, ordering process, and client care.
            </p>
          </div>
        </Container>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 sm:py-24">
        <Container size="default">
          <div className="space-y-16">
            {faqs.map((category) => (
              <div key={category.category}>
                {/* Category Heading */}
                <div className="flex items-center space-x-4 mb-8 pb-4 border-b border-border/60">
                  <span className="w-4 h-[2px] bg-accent" />
                  <h2 className="font-sans text-[11px] uppercase tracking-[0.22em] font-semibold text-foreground">
                    {category.category}
                  </h2>
                </div>

                {/* Questions */}
                <div className="space-y-3">
                  {category.items.map((item, idx) => {
                    const key = `${category.category}-${idx}`;
                    const isOpen = openItem === key;
                    return (
                      <div
                        key={key}
                        className={`border transition-colors duration-200 ${isOpen ? "border-border-strong bg-surface" : "border-border/60 bg-surface hover:border-border-strong"}`}
                      >
                        <button
                          onClick={() => toggle(key)}
                          aria-expanded={isOpen}
                          className="w-full flex items-start justify-between text-left px-6 py-5 cursor-pointer gap-4"
                        >
                          <span className="font-sans text-sm font-medium text-foreground leading-relaxed">
                            {item.q}
                          </span>
                          <span className={`flex-shrink-0 mt-0.5 text-foreground-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                            <Icons.ChevronDown size={16} />
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6">
                            <p className="text-sm text-foreground-muted font-sans font-light leading-relaxed">
                              {item.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions CTA */}
          <div className="mt-20 p-8 sm:p-10 bg-surface border border-border text-center">
            <h3 className="font-serif text-2xl font-normal text-foreground mb-3">
              Still have a question?
            </h3>
            <p className="text-sm text-foreground-muted font-sans font-light mb-6 max-w-md mx-auto">
              Our fragrance concierge team is available Monday through Friday to assist with any enquiry.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center font-sans font-medium uppercase px-8 py-3.5 text-xs tracking-[0.2em] bg-primary text-primary-foreground hover:bg-primary-hover border border-primary transition-all duration-200 cursor-pointer"
            >
              Contact Concierge
            </a>
          </div>
        </Container>
      </section>

    </main>
  );
}
