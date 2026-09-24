"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "../hooks/useCart";
import { CartItemRow } from "./CartItemRow";
import { CartOrderSummary } from "./CartOrderSummary";
import { EmptyCartView } from "./EmptyCartView";
import { Icons } from "@/components/ui/icons";

export const CartPageView: React.FC = () => {
  const { cart, updateQuantity, removeItem } = useCart();

  if (cart.itemCount === 0) {
    return <EmptyCartView />;
  }

  return (
    <div className="w-full">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 mb-4 sm:mb-6 gap-3">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8E95A2] font-sans block mb-0.5">
            SHOPPING BAG
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#0B1938] leading-tight tracking-tight">
            Your Selections
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-sans font-normal mt-1">
            Refined choices for a more fragrant you.
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start relative">
        {/* Left: Product Table White Card (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-7 border border-[#EFECE6] shadow-sm">
          {/* Table Column Titles (Desktop) */}
          <div className="hidden sm:grid grid-cols-12 gap-4 pb-3.5 border-b border-[#F0ECE1] text-[11px] font-sans text-[#8E95A2] font-semibold uppercase tracking-wider">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right pr-4">Total</div>
          </div>

          {/* Product Items */}
          <div className="divide-y divide-[#F0ECE1]">
            {cart.items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Continue Shopping Link at Bottom Left */}
          <div className="pt-5 mt-4 border-t border-[#F0ECE1] flex items-center justify-between">
            <Link
              href="/perfumes"
              className="text-xs uppercase tracking-[0.16em] font-bold text-[#0B1938] hover:text-amber-900 transition-colors inline-flex items-center gap-1.5 font-sans"
            >
              <Icons.ArrowLeft size={13} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary White Card (4 cols) shifted UP to align with SHOPPING BAG line */}
        <aside className="lg:col-span-4 sticky top-20 lg:-mt-[6.5rem] xl:-mt-[7rem]">
          <CartOrderSummary subtotal={cart.subtotal} itemCount={cart.itemCount} />
        </aside>
      </div>
    </div>
  );
};
