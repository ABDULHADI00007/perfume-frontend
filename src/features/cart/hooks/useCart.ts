"use client";

import { useSyncExternalStore, useEffect } from "react";
import { cartStore } from "../store/cartStore";
import { CartItem } from "../types";

let isHydrated = false;

export function useCart() {
  useEffect(() => {
    if (!isHydrated) {
      isHydrated = true;
      cartStore.init();
    }
  }, []);

  const cart = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );

  const addItem = (item: CartItem) => cartStore.addItem(item);
  const updateQuantity = (id: string, quantity: number) =>
    cartStore.updateQuantity(id, quantity);
  const removeItem = (id: string) => cartStore.removeItem(id);
  const clearCart = () => cartStore.clearCart();

  return { cart, addItem, updateQuantity, removeItem, clearCart };
}
