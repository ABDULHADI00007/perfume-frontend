import React from "react";
import Image from "next/image";
import { LuxuryLoader } from "@/components/ui/luxury-loader";

export default function StorefrontLoading() {
  return (
    <div className="w-full min-h-[75vh] flex flex-col items-center justify-center px-4 bg-gradient-to-b from-[#FAF8F5]/80 via-white to-[#F7F4EE]/60 select-none">
      <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center">
        {/* Brand Logo with Gentle Ambient Glow */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-radial from-[#590B16]/5 to-transparent blur-xl pointer-events-none rounded-full" />
          <Image
            src="/images/perfumes/soulmate_logo_transparent.png"
            alt="Soulmate Scents"
            width={200}
            height={52}
            priority
            className="h-12 sm:h-14 w-auto object-contain relative drop-shadow-xs"
          />
        </div>

        {/* 21st.dev Luxury Loader */}
        <div className="my-2">
          <LuxuryLoader size={46} color="#590B16" glowColor="rgba(89, 11, 22, 0.28)" />
        </div>

        {/* Luxury Typography */}
        <div className="mt-4 flex flex-col items-center space-y-1">
          <p className="text-[10.5px] sm:text-[11.5px] font-serif uppercase tracking-[0.28em] text-[#590B16] font-semibold">
            Soulmate Scents
          </p>
          <p className="text-[9.5px] sm:text-[10px] tracking-[0.16em] text-[#8C7F73] font-sans font-medium">
            Essence of Unbreakable Bonds
          </p>
        </div>
      </div>
    </div>
  );
}


