"use client";

import React from "react";
import { motion } from "framer-motion";

export interface AnnouncementBarProps {
  className?: string;
}

const announcements = [
  "FREE DELIVERY ALL OVER PAKISTAN",
  "100% AUTHENTIC & LUXURY EXTRAIT DE PARFUM",
  "CASH ON DELIVERY AVAILABLE NATIONWIDE",
  "COMPLIMENTARY TESTER WITH EVERY ORDER",
  "DISCOVER SCENTS THAT STAY WITH YOU",
  "HANDCRAFTED ARTISANAL PERFUMERY",
];

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  className = "",
}) => {
  // Duplicate list to guarantee seamless 50% infinite translation loop
  const tickerItems = [...announcements, ...announcements];

  return (
    <aside
      aria-label="Announcement Marquee"
      className={`w-full bg-[#3E060E] text-white py-2 sm:py-2.5 overflow-hidden z-40 border-b border-[#280409]/60 select-none ${className}`}
    >
      <div className="relative w-full flex overflow-hidden">
        <motion.div
          className="flex items-center whitespace-nowrap will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 26,
            repeat: Infinity,
          }}
        >
          {tickerItems.map((item, index) => (
            <div
              key={index}
              className="inline-flex items-center mx-4 sm:mx-6 text-[10.5px] sm:text-[11.5px] font-sans tracking-[0.2em] uppercase font-medium text-white/95"
            >
              <span>{item}</span>
              <span className="ml-8 sm:ml-12 text-[#FAF7EE]/45 text-[9px]">✦</span>
            </div>
          ))}
        </motion.div>
      </div>
    </aside>
  );
};

