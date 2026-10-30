"use client";

import { useSyncExternalStore, useEffect } from "react";
import { wishlistStore } from "../store/wishlistStore";
import { WishlistItem } from "../types";

let isHydrated = false;

export function useWishlist() {
  useEffect(() => {
    if (!isHydrated) {
      isHydrated = true;
      wishlistStore.init();
    }
  }, []);

  const wishlist = useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.getSnapshot,
    wishlistStore.getServerSnapshot
  );

  const isWishlistOpen = useSyncExternalStore(
    wishlistStore.subscribeDrawer,
    wishlistStore.getDrawerSnapshot,
    () => false
  );

  const addItem = (item: WishlistItem) => wishlistStore.addItem(item);
  const removeItem = (id: string) => wishlistStore.removeItem(id);
  const toggleItem = (item: WishlistItem) => wishlistStore.toggleItem(item);
  const hasItem = (idOrSlug: string) => wishlistStore.hasItem(idOrSlug);
  const clearWishlist = () => wishlistStore.clearWishlist();
  const openWishlist = () => wishlistStore.openDrawer();
  const closeWishlist = () => wishlistStore.closeDrawer();
  const toggleWishlist = () => wishlistStore.toggleDrawer();

  return {
    wishlist,
    items: wishlist.items,
    itemCount: wishlist.itemCount,
    addItem,
    removeItem,
    toggleItem,
    hasItem,
    clearWishlist,
    isWishlistOpen,
    openWishlist,
    closeWishlist,
    toggleWishlist,
  };
}
