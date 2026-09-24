"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FragranceNotes } from "../types";

export interface FragranceCompositionProps {
  notes?: FragranceNotes;
  concentration?: string;
  olfactoryFamily?: string;
  productTitle?: string;
  description?: string;
  className?: string;
}

export const FragranceComposition: React.FC<FragranceCompositionProps> = ({
  notes,
  productTitle = "Oud Royale",
  description,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<"description" | "notes" | "details" | "shipping" | "reviews">("description");

  const topNotesText = notes?.top?.join(", ") || "Saffron, Bergamot, Spices";
  const heartNotesText = notes?.heart?.join(", ") || "Oud, Rose, Amber";
  const baseNotesText = notes?.base?.join(", ") || "Musk, Vanilla, Sandalwood";

  return (
    <section className={`py-12 border-t border-gray-200/80 mt-12 font-sans ${className}`}>
      {/* Tab Navigation Header */}
      <div className="border-b border-gray-200/80 mb-8 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-8 min-w-max pb-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all relative ${
              activeTab === "description"
                ? "text-[#0D1424] border-b-2 border-[#0D1424]"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all relative ${
              activeTab === "notes"
                ? "text-[#0D1424] border-b-2 border-[#0D1424]"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Scent Notes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all relative ${
              activeTab === "details"
                ? "text-[#0D1424] border-b-2 border-[#0D1424]"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("shipping")}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all relative ${
              activeTab === "shipping"
                ? "text-[#0D1424] border-b-2 border-[#0D1424]"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Shipping & Returns
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all relative ${
              activeTab === "reviews"
                ? "text-[#0D1424] border-b-2 border-[#0D1424]"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Reviews (91)
          </button>
        </div>
      </div>

      {/* Main Tab Content Grid (2 Columns matching Reference Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Narrative Description & Feature Checkmarks */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
            {description ||
              `${productTitle} is an extraordinary blend that captures power, elegance, and mystery. Inspired by rare oriental traditions, this fragrance opens with rich spices, unfolds into deep oud, and settles into a warm, lingering trail. Perfect for evening wear and special occasions.`}
          </p>

          <div className="flex flex-col space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-gray-700 font-medium">
              <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-gray-700 text-[10px] font-bold">
                ✓
              </div>
              <span>Long-lasting fragrance</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-700 font-medium">
              <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-gray-700 text-[10px] font-bold">
                ✓
              </div>
              <span>Premium ingredients</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-700 font-medium">
              <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-gray-700 text-[10px] font-bold">
                ✓
              </div>
              <span>Ideal for special occasions</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-700 font-medium">
              <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-gray-700 text-[10px] font-bold">
                ✓
              </div>
              <span>Comes in luxury packaging</span>
            </div>
          </div>
        </div>

        {/* Right Column: Circular Scent Notes Showcase */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#0D1424]">
            Scent Notes
          </h3>

          <div className="grid grid-cols-3 gap-4 pt-2">
            {/* Top Notes Circle Card */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border border-gray-200 shadow-xs">
                <Image
                  src="/images/perfumes/sultan-veils.png"
                  alt="Top Notes"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <h4 className="font-serif text-sm font-bold text-[#0D1424]">
                Top Notes
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {topNotesText}
              </p>
            </div>

            {/* Heart Notes Circle Card */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border border-gray-200 shadow-xs">
                <Image
                  src="/images/perfumes/oyd_royal.png"
                  alt="Heart Notes"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <h4 className="font-serif text-sm font-bold text-[#0D1424]">
                Heart Notes
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {heartNotesText}
              </p>
            </div>

            {/* Base Notes Circle Card */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border border-gray-200 shadow-xs">
                <Image
                  src="/images/perfumes/amber-rivera.png"
                  alt="Base Notes"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <h4 className="font-serif text-sm font-bold text-[#0D1424]">
                Base Notes
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {baseNotesText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
