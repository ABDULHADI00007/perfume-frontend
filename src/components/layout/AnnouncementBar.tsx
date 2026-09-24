"use client";

import React from "react";
import { Container } from "./Container";

export interface AnnouncementBarProps {
  className?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  className = "",
}) => {
  return (
    <aside
      aria-label="Announcement"
      className={`w-full bg-[#0D1424] text-white py-2.5 px-4 text-xs z-40 border-b border-white/10 ${className}`}
    >
      <Container size="wide" className="flex items-center justify-between text-[11px] sm:text-[12px] font-sans tracking-[0.14em] uppercase font-medium">
        {/* Left Announcement Message */}
        <div className="flex items-center gap-2">
          <span>DISCOVER SCENTS THAT STAY WITH YOU</span>
        </div>

        {/* Right Info Badges */}
        <div className="hidden md:flex items-center space-x-4 text-white/80 font-normal tracking-[0.16em]">
          <span>WORLDWIDE DELIVERY</span>
          <span className="text-white/40">|</span>
          <span>AUTHENTIC & PREMIUM</span>
          <span className="text-white/40">|</span>
          <span>EXCLUSIVE COLLECTIONS</span>
        </div>
      </Container>
    </aside>
  );
};
