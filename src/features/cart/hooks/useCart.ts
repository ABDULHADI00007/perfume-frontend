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

  const isCartOpen = useSyncExternalStore(
    cartStore.subscribeDrawer,
    cartStore.getDrawerSnapshot,
    () => false
  );

  const addItem = (item: CartItem) => cartStore.addItem(item);
  const updateQuantity = (id: string, quantity: number) =>
    cartStore.updateQuantity(id, quantity);
  const removeItem = (id: string) => cartStore.removeItem(id);
  const clearCart = () => cartStore.clearCart();
  const openCart = () => cartStore.openCart();
  const closeCart = () => cartStore.closeCart();
  const toggleCart = () => cartStore.toggleCart();

  return {
    cart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
  };
}
