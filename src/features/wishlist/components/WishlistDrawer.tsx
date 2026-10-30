"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "@/features/cart/hooks/useCart";
import { WishlistItem } from "../types";

export const WishlistDrawer: React.FC = () => {
  const { items, itemCount, isWishlistOpen, closeWishlist, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleMoveToCart = (item: WishlistItem) => {
    addToCart({
      id: `${item.id}-50ml`,
      productId: item.id,
      variantId: `${item.id}-var`,
      title: item.title,
      size: item.size || "50ml",
      price: item.price,
      quantity: 1,
      image: item.image,
      sku: `SS-${item.slug.toUpperCase()}-50`,
    });

    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const footerContent = (
    <div className="w-full flex items-center justify-between pt-2">
      <button
        type="button"
        onClick={clearWishlist}
        className="text-[11px] text-stone-500 hover:text-[#590B16] uppercase tracking-wider font-semibold transition-colors cursor-pointer"
      >
        Clear All
      </button>

      <Link
        href="/perfumes"
        onClick={closeWishlist}
        className="text-[11px] text-[#590B16] hover:underline uppercase tracking-wider font-bold transition-all"
      >
        Explore More →
      </Link>
    </div>
  );

  return (
    <Drawer
      isOpen={isWishlistOpen}
      onClose={closeWishlist}
      title="Saved Fragrances"
      description={
        itemCount > 0
          ? `${itemCount} ${itemCount === 1 ? "fragrance saved" : "fragrances saved"}`
          : undefined
      }
      footer={itemCount > 0 ? footerContent : undefined}
      maxWidth="md"
    >
      {itemCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center my-auto min-h-[60vh]">
          <div className="w-20 h-20 rounded-full bg-[#FAF7EE] border border-[#590B16]/20 flex items-center justify-center text-[#590B16] shadow-sm mb-5">
            <Icons.Heart className="w-9 h-9 stroke-[#590B16] fill-none" />
          </div>

          <span className="mb-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#590B16]/10 text-[#590B16] border border-[#590B16]/20">
            SOULMATE SCENTS
          </span>

          <h3 className="font-serif text-2xl font-bold text-black tracking-tight mt-1">
            Your Wishlist is Empty
          </h3>

          <p className="text-xs sm:text-sm text-stone-500 max-w-xs mx-auto leading-relaxed font-sans mt-2 mb-7">
            Save your favorite extraits de parfum and limited editions to revisit them anytime.
          </p>

          <Link href="/perfumes" onClick={closeWishlist} className="w-full max-w-xs">
            <Button
              variant="default"
              size="lg"
              className="w-full tracking-[0.18em] !bg-[#590B16] hover:!bg-[#3E060E] active:!bg-[#30040A] text-white font-bold py-3.5 rounded-xl uppercase text-xs"
            >
              Explore Fragrances
            </Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-stone-100 py-1">
          {items.map((item) => {
            const isAdded = !!addedIds[item.id];

            return (
              <div
                key={item.id}
                className="py-4 flex items-center gap-3.5 sm:gap-4 transition-colors group"
              >
                {/* Thumbnail */}
                <Link
                  href={`/perfumes/${item.slug}`}
                  onClick={closeWishlist}
                  className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FAF7EE] flex-shrink-0 border border-stone-200/80 shadow-2xs hover:opacity-95"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/perfumes/${item.slug}`}
                        onClick={closeWishlist}
                        className="font-serif text-sm font-bold text-black hover:text-[#590B16] transition-colors line-clamp-1 block"
                      >
                        {item.title}
                      </Link>
                      <span className="text-[11px] text-stone-500 font-sans block mt-0.5">
                        {item.size || "50ml"} · Extrait de Parfum
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.title} from wishlist`}
                      className="p-1.5 text-stone-400 hover:text-[#590B16] transition-colors cursor-pointer rounded-lg hover:bg-stone-100"
                      title="Remove"
                    >
                      <Icons.Trash className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2.5">
                    <span className="font-serif text-sm font-bold text-black">
                      Rs. {item.price.toLocaleString()}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isAdded
                          ? "bg-emerald-700 text-white"
                          : "bg-[#590B16] hover:bg-[#3E060E] text-white active:scale-95"
                      }`}
                    >
                      <Icons.Bag size={12} />
                      <span>{isAdded ? "Added ✓" : "Add to Bag"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Drawer>
  );
};
