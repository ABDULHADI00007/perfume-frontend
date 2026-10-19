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
    <div className="w-full font-sans text-[#0B1938]">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs font-sans text-[#8E95A2] mb-6 flex items-center gap-2" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#0B1938] transition-colors flex items-center gap-1">
          <span>Home</span>
        </Link>
        <span className="text-[#C5A880]">&gt;</span>
        <span className="text-[#0B1938] font-semibold">Shopping Bag</span>
      </nav>

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#F0ECE1] gap-4">
        <div>
          <Badge variant="accent" className="mb-2">
            <Icons.Bag className="w-3 h-3 mr-1.5 text-[#C5A880]" />
            YOUR SELECTIONS
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1938] tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-sans font-normal mt-1">
            Refined fragrance choices curated for your signature scent journey.
          </p>
        </div>

        <Badge variant="default" size="lg" className="self-start sm:self-auto bg-[#0B1938]">
          {cart.itemCount} {cart.itemCount === 1 ? "Fragrance" : "Fragrances"}
        </Badge>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative">
        {/* Left: Product Table White Card (8 cols) */}
        <Card variant="default" className="lg:col-span-8 border border-[#E2DED6] bg-white p-2 sm:p-4">
          <CardHeader className="pb-4 border-b border-[#F0ECE1]">
            <CardTitle className="font-serif text-xl sm:text-2xl font-bold text-[#0B1938]">
              Selected Items
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-4">
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
            <div className="pt-6 mt-4 border-t border-[#F0ECE1] flex items-center justify-between">
              <Link href="/perfumes">
                <Button variant="outline" size="sm" leftIcon={<Icons.ArrowLeft className="w-3.5 h-3.5" />}>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Right: Order Summary White Card (4 cols) */}
        <aside className="lg:col-span-4 sticky top-20">
          <CartOrderSummary subtotal={cart.subtotal} itemCount={cart.itemCount} items={cart.items} />
        </aside>
      </div>
    </div>
  );
};

