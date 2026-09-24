"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
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
      <div className="flex items-center justify-between text-sm">
        <span className="font-sans uppercase tracking-[0.16em] text-xs font-semibold text-[#475569]">
          Estimated Subtotal
        </span>
        <span className="font-serif text-xl text-[#0B1938] font-bold">
          {formatCurrency(cart.subtotal)}
        </span>
      </div>
      <p className="text-xs text-[#64748B] font-sans leading-relaxed font-normal">
        Complimentary 2ml discovery sample and signature presentation box included.
      </p>

      <div className="flex flex-col space-y-2.5 pt-1">
        <Button
          variant="primary"
          size="lg"
          onClick={handleCheckout}
          disabled={cart.itemCount === 0}
          className="w-full tracking-[0.18em] bg-[#0B1938] hover:bg-[#172552] text-white font-semibold py-3.5 rounded-lg"
        >
          Proceed to Checkout
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={handleViewCart}
          disabled={cart.itemCount === 0}
          className="w-full tracking-[0.16em] border border-[#0B1938] text-[#0B1938] hover:bg-[#0B1938] hover:text-white font-semibold py-3 rounded-lg"
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
          ? `${cart.itemCount} ${cart.itemCount === 1 ? "item" : "items"}`
          : undefined
      }
      footer={cart.itemCount > 0 ? footerContent : undefined}
      maxWidth="md"
    >
      {cart.itemCount === 0 && !children ? (
        <div className="flex flex-col items-center justify-center h-full py-16 text-center">
          <div className="p-4 rounded-full bg-slate-100 text-[#0B1938] mb-4">
            <Icons.Bag size={32} />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#0B1938]">
            Your Bag is Empty
          </h3>
          <p className="text-xs text-[#64748B] max-w-xs mt-2 leading-relaxed font-sans font-normal">
            Discover our exquisite fragrances and curated collections to begin your olfactory journey.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              router.push("/perfumes");
            }}
            className="mt-6 tracking-[0.16em] border border-[#0B1938] text-[#0B1938] hover:bg-[#0B1938] hover:text-white font-semibold"
          >
            Explore Perfumes
          </Button>
        </div>
      ) : children ? (
        <div className="flex flex-col space-y-4">{children}</div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-200">
          {cart.items.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex space-x-4">
              {/* Product Thumbnail */}
              <div className="relative h-20 w-16 flex-shrink-0 bg-slate-100 border border-gray-200 rounded-md overflow-hidden">
                <OptimizedImage
                  src={item.image || "/images/perfumes/oyd_royal.png"}
                  alt={item.title}
                  aspectRatio="3/4"
                  priority={false}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Item Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#0B1938] leading-snug">
                      <Link
                        href={`/perfumes/${item.productId.replace("prod-", "")}`}
                        onClick={onClose}
                        className="hover:text-amber-900 transition-colors"
                      >
                        {item.title}
                      </Link>
                    </h4>
                    <span className="inline-block mt-1 text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 bg-slate-100 border border-slate-200 text-[#475569] font-sans font-semibold rounded-sm">
                      {item.size}
                    </span>
                  </div>

                  <span className="font-serif text-base text-[#0B1938] font-bold ml-2">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>

                {/* Stepper & Remove */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center border border-gray-300 rounded-md bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                      className="p-1.5 text-[#0B1938] hover:bg-gray-100 disabled:opacity-30 transition-colors rounded-l-md"
                    >
                      <Icons.Minus size={12} />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#0B1938] font-sans select-none">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="p-1.5 text-[#0B1938] hover:bg-gray-100 transition-colors rounded-r-md"
                    >
                      <Icons.Plus size={12} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.title} from bag`}
                    className="text-[11px] uppercase tracking-[0.14em] text-gray-500 hover:text-red-600 transition-colors font-semibold"
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
