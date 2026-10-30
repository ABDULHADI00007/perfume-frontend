"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <span
          className="font-serif uppercase tracking-[0.16em] text-xs font-semibold text-[#64748B]"
          style={{ fontFamily: "'Cinzel', 'Marcellus', serif" }}
        >
          Estimated Subtotal
        </span>
        <span
          className="font-serif text-2xl text-black font-bold"
          style={{ fontFamily: "'Cinzel', 'Marcellus', serif" }}
        >
          {formatCurrency(cart.subtotal)}
        </span>
      </div>


      {/* CTA Buttons */}
      <div className="flex flex-col space-y-2.5 pt-1">
        <Button
          variant="default"
          size="lg"
          onClick={handleCheckout}
          disabled={cart.itemCount === 0}
          leftIcon={<Icons.Lock className="w-4 h-4" />}
          className="w-full tracking-[0.18em] !bg-[#590B16] hover:!bg-[#3E060E] active:!bg-[#30040A] focus:!bg-[#590B16] focus-visible:!bg-[#590B16] !text-white font-bold py-3.5 rounded-xl shadow-md min-h-[48px] uppercase text-xs transition-all active:scale-[0.99] font-serif"
          style={{ fontFamily: "'Cinzel', 'Marcellus', serif" }}
        >
          Proceed to Checkout
        </Button>
        <button
          type="button"
          onClick={handleViewCart}
          disabled={cart.itemCount === 0}
          className="w-full tracking-[0.16em] font-bold text-xs uppercase border border-black text-black hover:bg-black hover:text-white transition-all py-3.5 rounded-xl min-h-[46px] cursor-pointer font-serif"
          style={{ fontFamily: "'Cinzel', 'Marcellus', serif" }}
        >
          View Shopping Bag
        </button>
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
          <div className="w-20 h-20 rounded-full bg-[#FAF7EE] border border-[#590B16]/20 flex items-center justify-center text-[#590B16] shadow-md mb-5">
            <Icons.Bag className="w-9 h-9 text-[#590B16]" />
          </div>

          <Badge variant="accent" className="mb-3 bg-[#590B16]/10 text-[#590B16] border border-[#590B16]/20">
            <Icons.Sparkles className="w-3 h-3 mr-1.5 text-[#590B16]" />
            SOULMATE SCENTS
          </Badge>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-black tracking-tight">
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
              className="w-full tracking-[0.18em] bg-[#590B16] hover:bg-[#3E060E] text-white font-bold py-3.5 rounded-xl shadow-md min-h-[48px] uppercase text-xs font-serif"
              style={{ fontFamily: "'Cinzel', 'Marcellus', serif" }}
            >
              Explore All Perfumes
            </Button>

            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/about");
              }}
              className="w-full tracking-[0.16em] font-semibold text-xs uppercase border border-black text-black hover:bg-black hover:text-white transition-all py-3 rounded-xl min-h-[44px] font-serif"
              style={{ fontFamily: "'Cinzel', 'Marcellus', serif" }}
            >
              Our Story & Craft
            </button>
          </div>
        </div>
      ) : children ? (
        <div className="flex flex-col space-y-4">{children}</div>
      ) : (
        <div className="flex flex-col divide-y divide-stone-200/80">
          {cart.items.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start">
              {/* Product Flacon Thumbnail */}
              <Link
                href={`/perfumes/${item.productId.replace("prod-", "")}`}
                onClick={onClose}
                className="relative h-20 w-16 flex-shrink-0 bg-[#FAF7EE] border border-black/10 rounded-xl overflow-hidden group block shadow-2xs"
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
                    <h4 className="font-serif text-base font-bold text-black leading-snug">
                      <Link
                        href={`/perfumes/${item.productId.replace("prod-", "")}`}
                        onClick={onClose}
                        className="hover:text-[#590B16] transition-colors"
                      >
                        {item.title}
                      </Link>
                    </h4>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-[#590B16]/10 text-[#590B16] border border-[#590B16]/20">
                      {item.size}
                    </span>
                  </div>

                  <span className="font-serif text-sm font-bold text-black flex-shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>

                {/* Stepper & Remove Action */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center border border-black/20 rounded-xl bg-white shadow-2xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                      className="p-1.5 text-black hover:bg-[#590B16]/10 hover:text-[#590B16] disabled:opacity-25 transition-colors cursor-pointer"
                    >
                      <Icons.Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2.5 text-xs font-bold text-black font-sans select-none">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="p-1.5 text-black hover:bg-[#590B16]/10 hover:text-[#590B16] transition-colors cursor-pointer"
                    >
                      <Icons.Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.title} from bag`}
                    className="text-[10px] uppercase tracking-[0.14em] text-stone-400 hover:text-[#590B16] font-bold p-1 cursor-pointer transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
};

