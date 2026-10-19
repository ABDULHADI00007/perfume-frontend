"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useCart } from "../hooks/useCart";

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  itemCount?: number;
  subtotal?: number;
  onCheckout?: () => void;
  children?: React.ReactNode;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const router = useRouter();
  const { cart, updateQuantity, removeItem } = useCart();

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  const handleViewCart = () => {
    onClose();
    router.push("/cart");
  };

  const footerContent = (
    <div className="flex flex-col space-y-4">
      {/* Subtotal Row */}
      <div className="flex items-center justify-between">
        <span className="font-sans uppercase tracking-[0.16em] text-xs font-bold text-[#64748B]">
          Estimated Subtotal
        </span>
        <span className="font-serif text-2xl text-[#0B1938] font-bold">
          {formatCurrency(cart.subtotal)}
        </span>
      </div>

      {/* Gift Perk Box */}
      <div className="bg-[#FAF4E8] rounded-xl p-3.5 flex items-start gap-2.5 border border-[#F5EAD4]">
        <Icons.Gift className="w-4 h-4 text-[#C5A880] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#6B5A3E] font-sans leading-relaxed font-normal">
          Complimentary 2ml discovery sample & signature packaging included.
        </p>
      </div>

      {/* CTA Buttons using shadcn Button */}
      <div className="flex flex-col space-y-2.5 pt-1">
        <Button
          variant="default"
          size="lg"
          onClick={handleCheckout}
          disabled={cart.itemCount === 0}
          leftIcon={<Icons.Lock className="w-4 h-4" />}
          className="w-full tracking-[0.18em] bg-[#0B1938] hover:bg-[#121E3D] text-white font-bold py-3.5 rounded-xl shadow-md min-h-[48px]"
        >
          Proceed to Checkout
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={handleViewCart}
          disabled={cart.itemCount === 0}
          className="w-full tracking-[0.16em] font-semibold text-xs uppercase"
        >
          View Shopping Bag
        </Button>
      </div>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Shopping Bag"
      description={
        cart.itemCount > 0
          ? `${cart.itemCount} ${cart.itemCount === 1 ? "item selected" : "items selected"}`
          : undefined
      }
      footer={cart.itemCount > 0 ? footerContent : undefined}
      maxWidth="md"
    >
      {cart.itemCount === 0 && !children ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center my-auto min-h-[60vh]">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FAF4E8] to-[#F5EAD4] border border-[#E2DED6] flex items-center justify-center text-[#0B1938] shadow-md mb-5">
            <Icons.Bag className="w-9 h-9 text-[#0B1938]" />
          </div>

          <Badge variant="accent" className="mb-3">
            <Icons.Sparkles className="w-3 h-3 mr-1.5 text-[#C5A880]" />
            SOULMATE SCENTS
          </Badge>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1938] tracking-tight">
            Your Bag is Empty
          </h3>

          <p className="text-xs sm:text-sm text-[#64748B] max-w-xs mx-auto leading-relaxed font-sans mt-2 mb-7">
            Explore our artisanal extraits de parfum, rare harvest botanicals, and bespoke discovery sets.
          </p>

          <div className="w-full max-w-xs space-y-3">
            <Button
              variant="default"
              size="lg"
              onClick={() => {
                onClose();
                router.push("/perfumes");
              }}
              rightIcon={<Icons.ArrowRight className="w-4 h-4" />}
              className="w-full tracking-[0.18em] bg-[#0B1938] hover:bg-[#121E3D] text-white font-bold py-3.5 rounded-xl shadow-md min-h-[48px]"
            >
              Explore All Perfumes
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => {
                onClose();
                router.push("/about");
              }}
              className="w-full tracking-[0.16em] font-semibold text-xs uppercase"
            >
              Our Story & Craft
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-[#F0ECE1] w-full max-w-xs flex items-center justify-center gap-2 text-[11px] text-[#8E95A2] font-sans">
            <Icons.ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Complimentary 2ml Sample With Every Order</span>
          </div>
        </div>
      ) : children ? (
        <div className="flex flex-col space-y-4">{children}</div>
      ) : (
        <div className="flex flex-col divide-y divide-[#F0ECE1]">
          {cart.items.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start">
              {/* Product Flacon Thumbnail */}
              <Link
                href={`/perfumes/${item.productId.replace("prod-", "")}`}
                onClick={onClose}
                className="relative h-20 w-16 flex-shrink-0 bg-[#FAF8F5] border border-[#E2DED6] rounded-xl overflow-hidden group block shadow-2xs"
              >
                <OptimizedImage
                  src={item.image || "/images/perfumes/oyd_royal.png"}
                  alt={item.title}
                  aspectRatio="3/4"
                  priority={false}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              {/* Item Info */}
              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#0B1938] leading-snug">
                      <Link
                        href={`/perfumes/${item.productId.replace("prod-", "")}`}
                        onClick={onClose}
                        className="hover:text-[#C5A880] transition-colors"
                      >
                        {item.title}
                      </Link>
                    </h4>
                    <Badge variant="secondary" size="sm" className="mt-1">
                      {item.size}
                    </Badge>
                  </div>

                  <span className="font-serif text-sm font-bold text-[#0B1938] flex-shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>

                {/* Stepper & Remove Action */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center border border-[#E2DED6] rounded-xl bg-white shadow-2xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                      className="p-1.5 text-[#0B1938] hover:bg-[#FAF8F5] disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <Icons.Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2.5 text-xs font-bold text-[#0B1938] font-sans select-none">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="p-1.5 text-[#0B1938] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    >
                      <Icons.Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.title} from bag`}
                    className="text-[10px] uppercase tracking-[0.14em] text-[#94A3B8] hover:text-red-600 font-bold p-1 h-auto"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
};

