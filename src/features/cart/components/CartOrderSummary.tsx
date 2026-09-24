"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export interface CartOrderSummaryProps {
  subtotal: number;
  itemCount: number;
  className?: string;
}

export const CartOrderSummary: React.FC<CartOrderSummaryProps> = ({
  subtotal,
  itemCount,
  className = "",
}) => {
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div
      className={`p-6 sm:p-8 bg-white border border-[#E2DED6]/90 rounded-2xl shadow-[0_10px_30px_-10px_rgba(11,25,56,0.08)] hover:shadow-[0_15px_35px_-8px_rgba(11,25,56,0.12)] transition-all duration-300 flex flex-col space-y-5 ${className}`}
    >
      <h2 className="font-serif text-2xl font-bold text-[#0B1938] leading-snug pb-2">
        Order Summary
      </h2>

      {/* Breakdown */}
      <div className="flex flex-col space-y-3 text-sm font-sans font-normal">
        <div className="flex items-center justify-between text-[#64748B]">
          <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
          <span className="text-[#0B1938] font-bold">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-[#64748B]">
          <span>Shipping</span>
          <span className="text-[#0B1938] font-bold">Free</span>
        </div>

        <div className="flex items-center justify-between text-[#64748B]">
          <span>Estimated Tax</span>
          <span className="text-[#0B1938] font-bold">Rs. 0</span>
        </div>
      </div>

      {/* Estimated Total Divider & Row */}
      <div className="pt-4 border-t border-[#F0ECE1] flex items-baseline justify-between">
        <span className="font-serif text-lg font-bold text-[#0B1938]">
          Estimated Total
        </span>
        <span className="font-serif text-2xl sm:text-3xl text-[#0B1938] font-bold tracking-tight">
          {formatCurrency(subtotal)}
        </span>
      </div>

      {/* Light Gold Gift Perk Box */}
      <div className="bg-[#FAF4E8] rounded-xl p-4 flex items-start gap-3 border border-[#F5EAD4]">
        <Icons.Gift size={18} className="text-[#0B1938] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#6B5A3E] font-sans leading-relaxed font-normal">
          A complimentary 2ml discovery sample and signature presentation box included with your order.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-3 pt-1">
        <Button
          variant="primary"
          size="lg"
          disabled={itemCount === 0}
          onClick={handleCheckout}
          className="w-full tracking-[0.18em] font-semibold text-xs uppercase py-4 rounded-xl bg-[#131F37] hover:bg-[#0B1938] text-white flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[48px]"
        >
          <Icons.Lock size={14} />
          <span>Proceed to Checkout</span>
        </Button>

        <Link
          href="/perfumes"
          className="w-full text-center py-3.5 rounded-xl border border-[#131F37] text-[#131F37] hover:bg-[#131F37] hover:text-white transition-all font-semibold text-xs uppercase tracking-[0.16em] block"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
