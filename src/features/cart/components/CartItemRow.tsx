"use client";

import React from "react";
import Link from "next/link";
import { CartItem } from "../types";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
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
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  return (
    <article className={`py-6 sm:py-8 flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:items-center ${className}`}>
      {/* Col 1: Product Info (Col span 6 on desktop) */}
      <div className="sm:col-span-6 flex items-start space-x-4 sm:space-x-5">
        {/* Flacon Thumbnail */}
        <Link
          href={`/perfumes/${productSlug}`}
          className="relative h-24 sm:h-28 w-20 sm:w-24 flex-shrink-0 bg-[#F7F5EE] border border-[#EFECE6] rounded-xl overflow-hidden group block shadow-xs"
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
        <div className="flex flex-col items-start justify-center">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0B1938] leading-tight">
            <Link
              href={`/perfumes/${productSlug}`}
              className="hover:text-amber-900 transition-colors"
            >
              {item.title}
            </Link>
          </h3>
          <span className="text-xs text-[#8E95A2] font-sans font-normal mt-0.5">
            Eau de Parfum
          </span>

          {/* Size Pill */}
          <span className="inline-block bg-[#F3EFEC] text-[#5A6270] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider my-2">
            {item.size}
          </span>

          {/* Wishlist Link */}
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="text-xs text-[#64748B] hover:text-[#0B1938] font-sans font-normal flex items-center gap-1.5 transition-colors cursor-pointer mt-0.5"
          >
            <Icons.Heart
              size={13}
              className={isWishlisted ? "fill-red-600 stroke-red-600" : "stroke-current"}
            />
            <span>{isWishlisted ? "Wishlisted" : "Move to Wishlist"}</span>
          </button>
        </div>
      </div>

      {/* Col 2: Price (Col span 2 on desktop) */}
      <div className="sm:col-span-2 text-left sm:text-center flex sm:block items-center justify-between">
        <span className="sm:hidden text-xs text-[#8E95A2] font-sans">Price:</span>
        <span className="font-serif font-bold text-[#0B1938] text-sm sm:text-base">
          {formatCurrency(item.price)}
        </span>
      </div>

      {/* Col 3: Quantity Stepper (Col span 2 on desktop) */}
      <div className="sm:col-span-2 flex sm:justify-center items-center justify-between">
        <span className="sm:hidden text-xs text-[#8E95A2] font-sans">Quantity:</span>
        <div className="flex items-center border border-[#E5E0D8] rounded-md bg-white">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label={`Decrease quantity of ${item.title}`}
            className="p-1.5 text-[#0B1938] hover:bg-gray-100 disabled:opacity-30 transition-colors rounded-l-md cursor-pointer"
          >
            <Icons.Minus size={12} />
          </button>
          <span
            aria-live="polite"
            className="px-2.5 text-xs font-bold font-sans select-none text-[#0B1938]"
          >
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            aria-label={`Increase quantity of ${item.title}`}
            className="p-1.5 text-[#0B1938] hover:bg-gray-100 transition-colors rounded-r-md cursor-pointer"
          >
            <Icons.Plus size={12} />
          </button>
        </div>
      </div>

      {/* Col 4: Line Total & Remove Cross (Col span 2 on desktop) */}
      <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 text-right">
        <span className="sm:hidden text-xs text-[#8E95A2] font-sans">Total:</span>
        <span className="font-serif font-bold text-[#0B1938] text-sm sm:text-base">
          {formatCurrency(lineTotal)}
        </span>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.title} from shopping bag`}
          className="text-gray-400 hover:text-red-600 text-lg transition-colors cursor-pointer ml-2 p-1"
          title="Remove item"
        >
          <Icons.Close size={16} />
        </button>
      </div>
    </article>
  );
};
