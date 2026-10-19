"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/features/cart/types";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { CouponValidationData } from "../types";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  freeShippingThreshold?: number;
  flatRateFee?: number;
  taxRate?: number;
  enableTax?: boolean;
  appliedCoupon: CouponValidationData | null;
  onApplyCoupon: (coupon: CouponValidationData | null) => void;
  isSubmitting: boolean;
  onSubmitOrder: () => void;
  submitError?: string | null;
  customerEmail?: string;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  freeShippingThreshold = 150,
  flatRateFee = 15,
  taxRate = 5,
  enableTax = false,
  appliedCoupon,
  isSubmitting,
  onSubmitOrder,
  submitError,
}: CheckoutOrderSummaryProps) {
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : flatRateFee;

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const calculatedTax = enableTax ? Math.round(taxableAmount * (taxRate / 100) * 100) / 100 : 0;
  const finalTotal = Math.max(0, Math.round((subtotal - discountAmount + shippingFee + calculatedTax) * 100) / 100);

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card variant="default" className="border border-[#E2DED6] bg-white p-2 sm:p-4 shadow-xl">
      <CardHeader className="pb-3 border-b border-[#F0ECE1]">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-2xl font-bold text-[#0B1938]">
            Order Summary
          </CardTitle>
          <Badge variant="accent">
            {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-5">
        {/* Cart Items Snapshot */}
        <div className="divide-y divide-[#F0ECE1] max-h-64 overflow-y-auto pt-3 pb-1 px-2 custom-scrollbar">
          {items.map((item) => (
            <div key={item.id} className="py-3.5 first:pt-2.5 last:pb-1 flex items-center gap-3.5">
              <div className="relative w-14 h-14 flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded-xl border border-[#E2DED6] shadow-2xs"
                  />
                ) : (
                  <div className="w-full h-full bg-[#FAF8F5] rounded-xl flex items-center justify-center border border-[#EFECE6]">
                    <Icons.Bag className="w-5 h-5 text-[#94A3B8]" />
                  </div>
                )}
                <span className="absolute -top-2 -right-2 bg-[#0B1938] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md z-20 font-sans">
                  {item.quantity}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-sm font-semibold text-[#0B1938] truncate leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748B] font-sans uppercase tracking-wider font-normal mt-0.5">
                  {item.size}
                </p>
              </div>

              <div className="text-right pl-2">
                <span className="font-serif text-sm sm:text-base font-bold text-[#0B1938]">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Breakdown */}
        <div className="flex flex-col space-y-3 text-sm font-sans font-normal pt-2 border-t border-[#F0ECE1]">
          <div className="flex items-center justify-between text-[#64748B]">
            <span>Subtotal ({totalItemCount} items)</span>
            <span className="text-[#0B1938] font-bold">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#64748B]">
            <span>White-Glove Shipping</span>
            <span className="text-[#0B1938] font-bold">
              {isFreeShipping ? (
                <span className="text-emerald-700 font-semibold">Free Delivery</span>
              ) : (
                formatCurrency(flatRateFee)
              )}
            </span>
          </div>

          {appliedCoupon && (
            <div className="flex items-center justify-between text-[#0B1938]">
              <span>Privilege Discount ({appliedCoupon.coupon.code})</span>
              <span className="font-bold text-emerald-700">-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[#64748B]">
            <span>Estimated Tax</span>
            <span className="text-[#0B1938] font-bold">
              {enableTax && calculatedTax > 0 ? formatCurrency(calculatedTax) : "Rs. 0"}
            </span>
          </div>
        </div>

        {/* Estimated Total Divider & Row */}
        <div className="pt-4 border-t border-[#F0ECE1] flex items-baseline justify-between">
          <span className="font-serif text-lg font-bold text-[#0B1938]">
            Total Amount
          </span>
          <span className="font-serif text-2xl sm:text-3xl text-[#0B1938] font-bold tracking-tight">
            {formatCurrency(finalTotal)}
          </span>
        </div>

        {/* Light Gold Gift Perk Box */}
        <div className="bg-[#FAF4E8] rounded-xl p-4 flex items-start gap-3 border border-[#F5EAD4]">
          <Icons.Gift className="w-5 h-5 text-[#C5A880] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#6B5A3E] font-sans leading-relaxed font-normal">
            Complimentary 2ml Extrait De Parfum sample & luxury presentation packaging included.
          </p>
        </div>

        {/* Error Message Banner */}
        {submitError && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-sans flex items-start gap-2">
            <Icons.AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
            <p className="leading-relaxed">{submitError}</p>
          </div>
        )}

        {/* Action Buttons using shadcn Button */}
        <div className="flex flex-col space-y-3 pt-2">
          <Button
            type="button"
            variant="default"
            size="lg"
            onClick={onSubmitOrder}
            disabled={isSubmitting || items.length === 0}
            isLoading={isSubmitting}
            leftIcon={!isSubmitting && <Icons.Lock className="w-4 h-4" />}
            className="w-full tracking-[0.18em] font-semibold text-xs uppercase py-4 rounded-xl bg-[#0B1938] hover:bg-[#121E3D] text-white flex items-center justify-center cursor-pointer shadow-md min-h-[48px]"
          >
            Place Order
          </Button>

          <Link href="/cart" className="w-full">
            <Button
              variant="outline"
              size="md"
              className="w-full font-semibold text-xs uppercase tracking-[0.16em]"
            >
              Return to Shopping Bag
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

