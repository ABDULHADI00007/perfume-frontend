"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/features/cart/types";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { checkoutService } from "../services/checkoutService";
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
  onApplyCoupon,
  isSubmitting,
  onSubmitOrder,
  submitError,
  customerEmail,
}: CheckoutOrderSummaryProps) {
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : flatRateFee;

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const calculatedTax = enableTax ? Math.round(taxableAmount * (taxRate / 100) * 100) / 100 : 0;
  const finalTotal = Math.max(0, Math.round((subtotal - discountAmount + shippingFee + calculatedTax) * 100) / 100);

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await checkoutService.validateCoupon(
        couponInput.trim(),
        subtotal,
        customerEmail
      );
      if (res.success && res.data) {
        onApplyCoupon(res.data);
        setCouponInput("");
      } else {
        setCouponError(res.message || "Invalid coupon code");
      }
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : "Unable to validate coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponError(null);
  };

  return (
    <div className="p-6 sm:p-8 bg-white border border-[#E2DED6]/90 rounded-2xl shadow-[0_10px_30px_-10px_rgba(11,25,56,0.08)] hover:shadow-[0_15px_35px_-8px_rgba(11,25,56,0.12)] transition-all duration-300 flex flex-col space-y-5">
      <h2 className="font-serif text-2xl font-bold text-[#0B1938] leading-snug pb-2">
        Order Summary
      </h2>

      {/* Cart Items Snapshot */}
      <div className="divide-y divide-[#F0ECE1] max-h-64 overflow-y-auto pt-2 pb-1 px-1 -mt-2">
        {items.map((item) => (
          <div key={item.id} className="py-3 first:pt-1.5 last:pb-1 flex items-center gap-3.5">
            <div className="relative w-14 h-14 flex-shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded-xl shadow-2xs"
                />
              ) : (
                <div className="w-full h-full bg-[#F8F6F0] rounded-xl flex items-center justify-center border border-[#EFECE6]">
                  <Icons.Bag className="w-5 h-5 text-[#94A3B8]" />
                </div>
              )}
              <span className="absolute -top-1 -right-1 bg-[#0B1938] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md z-10 font-sans">
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
      <div className="flex flex-col space-y-3 text-sm font-sans font-normal pt-1">
        <div className="flex items-center justify-between text-[#64748B]">
          <span>Subtotal ({totalItemCount} {totalItemCount === 1 ? "item" : "items"})</span>
          <span className="text-[#0B1938] font-bold">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-[#64748B]">
          <span>Shipping</span>
          <span className="text-[#0B1938] font-bold">
            {isFreeShipping ? "Free" : formatCurrency(flatRateFee)}
          </span>
        </div>

        {appliedCoupon && (
          <div className="flex items-center justify-between text-[#0B1938]">
            <span>Privilege Discount ({appliedCoupon.coupon.code})</span>
            <span className="font-bold">-{formatCurrency(discountAmount)}</span>
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
          Estimated Total
        </span>
        <span className="font-serif text-2xl sm:text-3xl text-[#0B1938] font-bold tracking-tight">
          {formatCurrency(finalTotal)}
        </span>
      </div>

      {/* Light Gold Gift Perk Box (Exact match with View Shopping Bag page) */}
      <div className="bg-[#FAF4E8] rounded-xl p-4 flex items-start gap-3 border border-[#F5EAD4]">
        <Icons.Gift size={18} className="text-[#0B1938] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#6B5A3E] font-sans leading-relaxed font-normal">
          A complimentary 2ml discovery sample and signature presentation box included with your order.
        </p>
      </div>

      {/* Error Message Banner */}
      {submitError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-sans flex items-start gap-2">
          <Icons.AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
          <p className="leading-relaxed">{submitError}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col space-y-3 pt-1">
        <Button
          type="button"
          onClick={onSubmitOrder}
          disabled={isSubmitting || items.length === 0}
          className="w-full tracking-[0.18em] font-semibold text-xs uppercase py-4 rounded-xl bg-[#131F37] hover:bg-[#0B1938] text-white flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[48px]"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Securing Your Order...
            </span>
          ) : (
            <>
              <Icons.Lock size={14} />
              <span>Place Order</span>
            </>
          )}
        </Button>

        <Link
          href="/cart"
          className="w-full text-center py-3.5 rounded-xl border border-[#131F37] text-[#131F37] hover:bg-[#131F37] hover:text-white transition-all font-semibold text-xs uppercase tracking-[0.16em] block font-sans"
        >
          Return to Shopping Bag
        </Link>
      </div>
    </div>
  );
}
