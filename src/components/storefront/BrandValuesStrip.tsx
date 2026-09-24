"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

interface ValueItem {
  title: string;
  subtitle: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

const values: ValueItem[] = [
  {
    title: "Free Shipping",
    subtitle: "On orders above Rs. 20,000",
    icon: ({ className }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: "100% Authentic",
    subtitle: "Genuine products, always",
    icon: ({ className }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Dedicated Support",
    subtitle: "Here to help, always",
    icon: ({ className }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
];

export const BrandValuesStrip: React.FC = () => {
  return (
    <section
      aria-label="Store Benefits & Value Proposition"
      className="w-full bg-[#FAF8F5] border-t border-b border-[#EFEBE4] py-8 sm:py-10 mt-12"
    >
      <Container size="wide">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
        >
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={staggerItem}
                className="flex items-center space-x-4 px-4 py-2 group"
              >
                {/* Circular Icon Container */}
                <div className="w-12 h-12 rounded-full bg-white border border-[#EFEBE4] flex items-center justify-center text-[#0D1424] shadow-xs group-hover:scale-105 group-hover:border-black transition-all flex-shrink-0">
                  <Icon className="w-5 h-5 stroke-current" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#0D1424] mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs font-sans text-gray-500 font-normal">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
};
