"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CartItem } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Card variant="default" className={`border border-[#E2DED6] bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm sm:shadow-md ${className}`}>
      <CardHeader className="pb-3 border-b border-[#F0ECE1] px-0 pt-0">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-xl sm:text-2xl font-bold text-black">
            Summary
          </CardTitle>
          <Badge variant="accent" className="bg-[#590B16]/10 text-[#590B16] border border-[#590B16]/20">
            {itemCount} {itemCount === 1 ? "Item" : "Items"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-3 sm:pt-4 space-y-4 sm:space-y-5 px-0 pb-0">
        {/* Cart Items Snapshot (Desktop Only - on mobile, full list is already shown right above) */}
        {items && items.length > 0 && (
          <div className="hidden lg:block divide-y divide-[#F0ECE1] max-h-56 overflow-y-auto pt-2 pb-1 px-1 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="py-3.5 first:pt-2.5 last:pb-1 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="48px"
                        className="object-cover rounded-xl border border-gray-100 shadow-2xs"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#FAF8F5] rounded-xl flex items-center justify-center border border-[#EFECE6]">
                        <Icons.Bag className="w-4 h-4 text-[#94A3B8]" />
                      </div>
                    )}
                    <span className="absolute -top-2 -right-2 bg-[#590B16] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md z-20 font-sans">
                      {item.quantity}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-black line-clamp-1">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-stone-500 font-sans uppercase tracking-wider block mt-0.5">
                      {item.size}
                    </span>
                  </div>
                </div>
                <span className="font-serif text-sm font-bold text-black flex-shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Breakdown */}
        <div className="flex flex-col space-y-3 text-xs sm:text-sm font-sans font-normal pt-2 border-t border-[#F0ECE1]">
          <div className="flex items-center justify-between text-black/80">
            <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
            <span className="text-black font-bold text-sm">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-black/80">
            <span>White-Glove Courier</span>
            <span className="text-emerald-700 font-semibold text-sm">Complimentary</span>
          </div>

          <div className="flex items-center justify-between text-black/80">
            <span>Estimated Tax</span>
            <span className="text-black font-bold text-sm">Rs. 0</span>
          </div>
        </div>

        {/* Estimated Total Divider & Row */}
        <div className="pt-4 border-t border-[#F0ECE1] flex items-baseline justify-between">
          <span className="font-serif text-base sm:text-lg font-bold text-black">
            Subtotal Amount
          </span>
          <span className="font-serif text-2xl sm:text-3xl text-black font-bold tracking-tight">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Light Gold Gift Perk Box */}
        <div className="bg-[#FAF4E8] rounded-xl p-4 flex items-start gap-3 border border-[#F5EAD4]">
          <Icons.Gift className="w-5 h-5 text-[#C5A880] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#6B5A3E] font-sans leading-relaxed font-normal">
            Complimentary 2ml discovery sample and signature presentation box included.
          </p>
        </div>

        {/* Action Buttons using shadcn Button */}
        <div className="flex flex-col space-y-3 pt-2">
          <Button
            variant="default"
            size="lg"
            disabled={itemCount === 0}
            onClick={handleCheckout}
            leftIcon={<Icons.Lock className="w-4 h-4" />}
            className="w-full tracking-[0.18em] font-bold text-xs uppercase py-4 rounded-xl !bg-[#590B16] hover:!bg-[#3E060E] active:!bg-[#30040A] focus:!bg-[#590B16] focus-visible:!bg-[#590B16] !text-white flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[48px] font-serif"
            style={{ fontFamily: "'Cinzel', 'Marcellus', serif" }}
          >
            Proceed to Checkout
          </Button>

          <Link href="/perfumes" className="w-full">
            <Button
              variant="outline"
              size="md"
              className="w-full font-semibold text-xs uppercase tracking-[0.16em] font-serif"
              style={{ fontFamily: "'Cinzel', 'Marcellus', serif" }}
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

