"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "../hooks/useCart";
import { CartItemRow } from "./CartItemRow";
import { CartOrderSummary } from "./CartOrderSummary";
import { EmptyCartView } from "./EmptyCartView";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export const CartPageView: React.FC = () => {
  const { cart, updateQuantity, removeItem } = useCart();

  if (cart.itemCount === 0) {
    return <EmptyCartView />;
  }

  return (
    <div className="w-full font-sans text-black">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs font-sans text-stone-500 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
          <span>Home</span>
        </Link>
        <span className="text-[#C5A880]">&gt;</span>
        <span className="text-black font-semibold">Shopping Bag</span>
      </nav>

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 sm:mb-6 border-b border-[#F0ECE1] gap-3 sm:gap-4">
        <div>
          <Badge variant="accent" className="mb-2 bg-[#590B16]/10 text-[#590B16] border border-[#590B16]/20">
            <Icons.Bag className="w-3 h-3 mr-1.5 text-[#590B16]" />
            YOUR SELECTIONS
          </Badge>
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-black/80 font-sans font-normal mt-1">
            Refined fragrance choices curated for your signature scent journey.
          </p>
        </div>

        <Badge variant="default" size="lg" className="self-start sm:self-auto bg-[#590B16] text-white">
          {cart.itemCount} {cart.itemCount === 1 ? "Fragrance" : "Fragrances"}
        </Badge>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start relative">
        {/* Left: Product Table White Card (8 cols) */}
        <Card variant="default" className="lg:col-span-8 border border-[#E2DED6] bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm">
          <CardHeader className="pb-3 sm:pb-4 border-b border-[#F0ECE1] px-0 pt-0">
            <CardTitle className="font-serif text-lg sm:text-2xl font-bold text-black">
              Selected Items
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-2 sm:pt-4 px-0 pb-0">
            {/* Table Column Titles (Desktop) */}
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b border-[#F0ECE1] text-[11px] font-sans text-[#8E95A2] font-semibold uppercase tracking-wider">
              <div className="col-span-6">Fragrance</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right pr-4">Subtotal</div>
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
            <div className="pt-4 sm:pt-6 mt-2 sm:mt-4 border-t border-[#F0ECE1] flex items-center justify-between">
              <Link href="/perfumes" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" leftIcon={<Icons.ArrowLeft className="w-3.5 h-3.5" />} className="w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Right: Order Summary White Card (4 cols) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 mt-1 lg:mt-0">
          <CartOrderSummary subtotal={cart.subtotal} itemCount={cart.itemCount} items={cart.items} />
        </aside>
      </div>
    </div>
  );
};

