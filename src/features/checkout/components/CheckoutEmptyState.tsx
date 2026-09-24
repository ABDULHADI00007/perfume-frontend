import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export function CheckoutEmptyState() {
  return (
    <div className="bg-white border border-[#EFECE6] rounded-2xl p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto my-12 transition-all">
      <div className="w-16 h-16 rounded-full bg-[#F8F6F0] border border-[#EFECE6] flex items-center justify-center mx-auto mb-6 text-[#0B1938]">
        <Icons.Bag className="w-7 h-7 text-[#0B1938]" />
      </div>

      <h1 className="font-serif text-2xl sm:text-3xl text-[#0B1938] font-bold uppercase tracking-tight mb-3">
        Your Shopping Bag is Empty
      </h1>

      <p className="text-sm text-[#64748B] font-sans max-w-md mx-auto mb-8 leading-relaxed">
        There are no bespoke fragrances currently selected for checkout. Discover our artisanal extraits formulated for enduring sillage.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <Link href="/perfumes" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-sans font-bold bg-[#0B1938] hover:bg-[#172552] text-white rounded-xl transition-all shadow-sm">
            Explore Fragrances
          </Button>
        </Link>
        <Link href="/cart" className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-sans font-bold text-[#0B1938] border-[#E2DED6] hover:bg-[#F8F6F0] rounded-xl transition-all"
          >
            Return to Bag
          </Button>
        </Link>
      </div>
    </div>
  );
}
