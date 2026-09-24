"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "../types";
import { Icons } from "@/components/ui/icons";

export interface ProductDetailsAccordionProps {
  product: Product;
  className?: string;
}

export const ProductDetailsAccordion: React.FC<ProductDetailsAccordionProps> = ({
  product,
  className = "",
}) => {
  const [openSection, setOpenSection] = useState<number | null>(0);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections = [
    {
      title: "Formulation & Narrative",
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-foreground-muted font-sans font-light leading-relaxed">
          <p>{product.description}</p>
          <p>
            Concentration: <strong className="text-foreground font-normal">{product.concentration}</strong>. Handcrafted with aged natural distillations, macerated in dark glass demijohns to preserve delicate botanical volatility.
          </p>
        </div>
      ),
    },
    {
      title: "The Olfactory Ritual",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-foreground-muted font-sans font-light leading-relaxed">
          <p>
            Apply one to two sprays to pulse points where body heat naturally diffuses the fragrance: the inner wrists, base of the throat, behind the earlobes, and inside the elbow creases.
          </p>
          <p>
            For delicate intimacy, allow the formulation to settle naturally without rubbing wrists together, preserving the integrity of the top and heart notes.
          </p>
        </div>
      ),
    },
    {
      title: "Flacon & Artisanal Packaging",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-foreground-muted font-sans font-light leading-relaxed">
          <p>
            Each flacon is forged from ultra-clear heavy flint glass with a precision atomizer calibrated to deliver an ultra-fine, even mist. Finished with a weighted cap engraved with the Maison crest.
          </p>
          <p>
            Enclosed in a rigid presentation box lined with velvet and sealed with a hand-numbered batch certificate.
          </p>
        </div>
      ),
    },
    {
      title: "Complimentary Delivery & Returns",
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-foreground-muted font-sans font-light leading-relaxed">
          <p>
            All fragrance orders include complimentary white-glove delivery and a matching 2ml discovery vial.
          </p>
          <p>
            We invite you to experience the fragrance on skin via the included vial first. If unsatisfied, return the unopened full flacon within 30 days. Read our{" "}
            <Link href="/shipping" className="text-foreground underline underline-offset-2 hover:text-navy">
              shipping guide
            </Link>{" "}
            and{" "}
            <Link href="/returns" className="text-foreground underline underline-offset-2 hover:text-navy">
              returns terms
            </Link>
            .
          </p>
        </div>
      ),
    },
  ];

  return (
    <section
      aria-labelledby="product-details-heading"
      className={`py-12 sm:py-16 border-t border-border ${className}`}
    >
      <div className="max-w-4xl mx-auto">
        <h2 id="product-details-heading" className="sr-only">
          Product Details and Formulation Guidance
        </h2>

        <div className="divide-y divide-border/80 border-t border-b border-border/80">
          {sections.map((section, idx) => {
            const isOpen = openSection === idx;
            const headingId = `accordion-heading-${idx}`;
            const panelId = `accordion-panel-${idx}`;

            return (
              <div key={section.title} className="py-2">
                <h3>
                  <button
                    type="button"
                    id={headingId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleSection(idx)}
                    className="w-full py-4 px-2 flex items-center justify-between text-left font-serif text-lg sm:text-xl font-normal text-foreground hover:text-navy transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <span>{section.title}</span>
                    <span className="ml-4 p-1 text-foreground-subtle transition-transform duration-300">
                      {isOpen ? <Icons.ChevronUp size={18} /> : <Icons.ChevronDown size={18} />}
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    className="px-2 pb-6 pt-1 animate-fade-in"
                  >
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
