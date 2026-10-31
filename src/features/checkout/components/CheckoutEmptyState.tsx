import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export function CheckoutEmptyState() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8 sm:py-12 px-4">
      <div className="bg-white border border-stone-200/80 rounded-2xl p-8 sm:p-14 text-center shadow-xs max-w-lg w-full transition-all">
        <div className="w-16 h-16 rounded-full bg-[#FAF7EE] border border-[#C5A880]/30 flex items-center justify-center mx-auto mb-6 text-[#590B16] shadow-xs">
          <Icons.Bag className="w-7 h-7 text-[#590B16]" />
        </div>

        <span className="inline-block text-[11px] uppercase tracking-[0.22em] text-[#590B16] font-sans font-semibold mb-2">
          Soulmate Scents
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900 font-normal tracking-tight mb-3">
          Your Shopping Bag is Empty
        </h1>

        <p className="text-xs sm:text-sm text-stone-500 font-sans max-w-sm mx-auto mb-8 leading-relaxed">
          Explore our curated collection of luxury perfumes and find the signature fragrance crafted for you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/perfumes" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-8 py-3.5 text-xs tracking-wider uppercase font-sans font-semibold bg-[#590B16] hover:bg-[#720E1D] text-white rounded-full shadow-xs transition-colors">
              Explore Fragrances
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-7 py-3.5 text-xs tracking-wider uppercase font-sans font-semibold text-stone-700 border-stone-300 hover:bg-stone-50 rounded-full transition-colors"
            >
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
