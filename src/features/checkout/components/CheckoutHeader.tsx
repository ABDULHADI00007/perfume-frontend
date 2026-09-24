import React from "react";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";

export function CheckoutHeader() {
  return (
    <header className="border-b border-[#EFECE6] bg-[#F8F6F0]/90 backdrop-blur-md sticky top-0 z-30 py-4 transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        {/* Return to Cart Action */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-sans font-semibold tracking-[0.14em] uppercase text-[#0B1938] hover:text-[#172552] transition-colors group"
        >
          <Icons.ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="hidden sm:inline">Return to Bag</span>
          <span className="sm:hidden">Bag</span>
        </Link>

        {/* Brand Wordmark */}
        <Link href="/" className="text-center group">
          <span className="block font-serif text-lg sm:text-xl md:text-2xl font-bold tracking-[0.22em] text-[#0B1938] uppercase group-hover:text-[#172552] transition-colors">
            Maison de Parfum
          </span>
          <span className="block font-sans text-[9px] tracking-[0.3em] uppercase text-[#64748B] -mt-0.5">
            Haute Parfumerie Paris
          </span>
        </Link>

        {/* Secure Guarantee Badge */}
        <div className="flex items-center gap-1.5 text-[#0B1938] bg-white/80 border border-[#EFECE6] px-3 py-1.5 rounded-full text-xs font-sans tracking-wider shadow-xs">
          <Icons.Lock className="w-3.5 h-3.5 text-[#0B1938]" />
          <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-[0.12em]">
            Encrypted Order
          </span>
        </div>
      </div>
    </header>
  );
}
