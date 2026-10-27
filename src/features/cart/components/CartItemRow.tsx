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
    <article className={`py-6 sm:py-8 flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:items-center ${className}`}>
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
      <div className="sm:col-span-2 text-left sm:text-center flex sm:block items-center justify-between">
        <span className="sm:hidden text-xs text-stone-500 font-sans">Price:</span>
        <span className="font-serif font-bold text-black text-sm sm:text-base">
          {formatCurrency(item.price)}
        </span>
      </div>

      {/* Col 3: Quantity Stepper (Col span 2 on desktop) */}
      <div className="sm:col-span-2 flex sm:justify-center items-center justify-between">
        <span className="sm:hidden text-xs text-stone-500 font-sans">Quantity:</span>
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
      <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 text-right">
        <span className="sm:hidden text-xs text-stone-500 font-sans">Total:</span>
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
    </article>
  );
};

