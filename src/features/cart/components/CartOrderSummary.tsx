"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CartItem } from "../types";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export interface CartOrderSummaryProps {
  subtotal: number;
  itemCount: number;
  items?: CartItem[];
  className?: string;
}

export const CartOrderSummary: React.FC<CartOrderSummaryProps> = ({
  subtotal,
  itemCount,
  items,
  className = "",
}) => {
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div
      className={`p-7 sm:p-9 bg-white border border-gray-200/90 rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col space-y-6 ${className}`}
    >
      <h2 className="font-serif text-2xl sm:text-[1.65rem] font-bold text-[#0B1938] leading-snug">
        Order Summary
      </h2>

      {/* Cart Items Snapshot (if items passed) */}
      {items && items.length > 0 && (
        <div className="divide-y divide-[#F0ECE1] max-h-56 overflow-y-auto pr-1 -mt-2">
          {items.map((item) => (
            <div key={item.id} className="py-3 first:pt-0 last:pb-1 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-13 h-13 flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={52}
                      height={52}
                      className="w-13 h-13 object-cover rounded-xl border border-gray-100 shadow-2xs"
                    />
                  ) : (
                    <div className="w-13 h-13 bg-[#F8F6F0] rounded-xl flex items-center justify-center border border-[#EFECE6]">
                      <Icons.Bag className="w-5 h-5 text-[#94A3B8]" />
                    </div>
                  )}
                  <span className="absolute -top-1.5 -right-1.5 bg-[#0B1938] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs font-sans">
                    {item.quantity}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#0B1938] line-clamp-1">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-[#64748B] font-sans uppercase tracking-wider block mt-0.5">
                    {item.size}
                  </span>
                </div>
              </div>
              <span className="font-serif text-sm font-bold text-[#0B1938] flex-shrink-0">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Breakdown */}
      <div className="flex flex-col space-y-3.5 text-xs sm:text-sm font-sans font-normal pt-1 border-t border-[#F0ECE1]">
        <div className="flex items-center justify-between text-[#64748B]">
          <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
          <span className="text-[#0B1938] font-bold text-sm">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-[#64748B]">
          <span>Shipping</span>
          <span className="text-[#0B1938] font-bold text-sm">Free</span>
        </div>

        <div className="flex items-center justify-between text-[#64748B]">
          <span>Estimated Tax</span>
          <span className="text-[#0B1938] font-bold text-sm">Rs. 0</span>
        </div>
      </div>

      {/* Estimated Total Divider & Row */}
      <div className="pt-4 border-t border-[#F0ECE1] flex items-baseline justify-between">
        <span className="font-serif text-base sm:text-lg font-bold text-[#0B1938]">
          Estimated Total
        </span>
        <span className="font-serif text-2xl sm:text-3xl text-[#0B1938] font-bold tracking-tight">
          {formatCurrency(subtotal)}
        </span>
      </div>

      {/* Light Gold Gift Perk Box */}
      <div className="bg-[#FAF4E8] rounded-2xl p-4 flex items-start gap-3 border border-[#F5EAD4]">
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
          className="w-full tracking-[0.18em] font-bold text-xs uppercase py-4 rounded-xl bg-[#0B1938] hover:bg-[#121A38] text-white flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all min-h-[50px]"
        >
          <Icons.Lock size={14} />
          <span>Proceed to Checkout</span>
        </Button>

        <Link
          href="/perfumes"
          className="w-full text-center py-3.5 rounded-xl border border-[#0B1938] text-[#0B1938] hover:bg-[#0B1938] hover:text-white transition-all font-bold text-xs uppercase tracking-[0.16em] block"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
