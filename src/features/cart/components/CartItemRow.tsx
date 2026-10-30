"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CartItem } from "../types";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  className = "",
}) => {
  const lineTotal = item.price * item.quantity;
  const productSlug = item.productId.replace("prod-", "");
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <article className={`py-4 sm:py-8 border-b border-[#F0ECE1] last:border-b-0 sm:border-b-0 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center ${className}`}>
      {/* ================= MOBILE LAYOUT (< sm) ================= */}
      <div className="flex sm:hidden gap-3.5 items-start w-full relative">
        {/* Flacon Thumbnail */}
        <Link
          href={`/perfumes/${productSlug}`}
          className="relative h-20 w-16 min-[380px]:h-24 min-[380px]:w-20 flex-shrink-0 bg-[#FAF8F5] border border-[#E2DED6] rounded-xl overflow-hidden block shadow-xs"
          aria-label={`View ${item.title}`}
        >
          <OptimizedImage
            src={item.image || "/images/perfumes/oyd_royal.png"}
            alt={item.title}
            aspectRatio="3/4"
            priority={false}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Info & Actions */}
        <div className="flex-1 flex flex-col justify-between min-h-[5rem] min-[380px]:min-h-[6rem]">
          {/* Top Row: Title, Size & Remove Button */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-serif text-base font-bold text-black leading-tight">
                <Link href={`/perfumes/${productSlug}`} className="hover:text-[#590B16] transition-colors">
                  {item.title}
                </Link>
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[11px] text-stone-500 font-sans">
                  Extrait De Parfum
                </span>
                <span className="text-stone-300">·</span>
                <Badge variant="secondary" size="sm" className="text-[10px] px-1.5 py-0">
                  {item.size}
                </Badge>
              </div>
              <div className="text-xs text-stone-600 font-medium mt-1">
                {formatCurrency(item.price)} each
              </div>
            </div>

            {/* Remove Action */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.title} from shopping bag`}
              className="text-[#94A3B8] hover:text-red-600 hover:bg-red-50 -mt-1 -mr-1 h-7 w-7"
              title="Remove item"
            >
              <Icons.Close className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Bottom Row: Stepper on Left, Subtotal on Right */}
          <div className="flex items-center justify-between pt-2.5 mt-auto">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-[#E2DED6] rounded-lg bg-white shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                aria-label={`Decrease quantity of ${item.title}`}
                className="p-1.5 text-black hover:bg-[#FAF8F5] disabled:opacity-30 transition-colors cursor-pointer"
              >
                <Icons.Minus className="w-3 h-3" />
              </button>
              <span className="px-2.5 text-xs font-bold font-sans select-none text-black">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                aria-label={`Increase quantity of ${item.title}`}
                className="p-1.5 text-black hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                <Icons.Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Subtotal */}
            <div className="text-right">
              <span className="font-serif font-bold text-black text-base">
                {formatCurrency(lineTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP LAYOUT (>= sm, 100% UNCHANGED) ================= */}
      <div className="hidden sm:contents">
        {/* Col 1: Product Info (Col span 6 on desktop) */}
        <div className="sm:col-span-6 flex items-start space-x-4 sm:space-x-5">
          {/* Flacon Thumbnail */}
          <Link
            href={`/perfumes/${productSlug}`}
            className="relative h-24 sm:h-28 w-20 sm:w-24 flex-shrink-0 bg-[#FAF8F5] border border-[#E2DED6] rounded-xl overflow-hidden group block shadow-xs"
            aria-label={`View ${item.title}`}
          >
            <OptimizedImage
              src={item.image || "/images/perfumes/oyd_royal.png"}
              alt={item.title}
              aspectRatio="3/4"
              priority={false}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Text Info */}
          <div className="flex flex-col items-start justify-center space-y-1">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-black leading-tight">
              <Link
                href={`/perfumes/${productSlug}`}
                className="hover:text-[#590B16] transition-colors"
              >
                {item.title}
              </Link>
            </h3>
            <span className="text-xs text-stone-500 font-sans font-normal">
              Extrait De Parfum (30% Concentration)
            </span>

            {/* Size Badge using shadcn Badge */}
            <Badge variant="secondary" size="sm" className="my-1">
              {item.size}
            </Badge>

            {/* Wishlist Link */}
            <button
              type="button"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="text-xs text-stone-500 hover:text-black font-sans font-normal flex items-center gap-1.5 transition-colors cursor-pointer pt-0.5"
            >
              <Icons.Heart
                className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-600 stroke-red-600 text-red-600" : "stroke-current"}`}
              />
              <span>{isWishlisted ? "Saved to Wishlist" : "Move to Wishlist"}</span>
            </button>
          </div>
        </div>

        {/* Col 2: Unit Price (Col span 2 on desktop) */}
        <div className="sm:col-span-2 text-center">
          <span className="font-serif font-bold text-black text-sm sm:text-base">
            {formatCurrency(item.price)}
          </span>
        </div>

        {/* Col 3: Quantity Stepper (Col span 2 on desktop) */}
        <div className="sm:col-span-2 flex justify-center items-center">
          <div className="flex items-center border border-[#E2DED6] rounded-xl bg-white shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.title}`}
              className="p-2 text-black hover:bg-[#FAF8F5] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Icons.Minus className="w-3 h-3" />
            </button>
            <span
              aria-live="polite"
              className="px-3 text-xs font-bold font-sans select-none text-black"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              aria-label={`Increase quantity of ${item.title}`}
              className="p-2 text-black hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              <Icons.Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Col 4: Line Total & Remove Action (Col span 2 on desktop) */}
        <div className="sm:col-span-2 flex items-center justify-end gap-3 text-right">
          <span className="font-serif font-bold text-black text-sm sm:text-base">
            {formatCurrency(lineTotal)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.title} from shopping bag`}
            className="text-[#94A3B8] hover:text-red-600 hover:bg-red-50 ml-1"
            title="Remove item"
          >
            <Icons.Close className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </article>
  );
};

