import { WishlistItem, WishlistState } from "../types";

export const initialWishlistState: WishlistState = {
  items: [],
  itemCount: 0,
};

const WISHLIST_STORAGE_KEY = "soulmate_scents_wishlist";

let currentWishlistState: WishlistState = initialWishlistState;
const listeners = new Set<() => void>();

let isDrawerOpenState = false;
const drawerListeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function notifyDrawer() {
  drawerListeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("wishlist-drawer-change", {
        detail: { isOpen: isDrawerOpenState },
      })
    );
  }
}

export function updateWishlistState(items: WishlistItem[]): WishlistState {
  return {
    items,
    itemCount: items.length,
  };
}

export const wishlistStore = {
  getSnapshot(): WishlistState {
    return currentWishlistState;
  },

  getServerSnapshot(): WishlistState {
    return initialWishlistState;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getDrawerSnapshot(): boolean {
    return isDrawerOpenState;
  },

  subscribeDrawer(listener: () => void): () => void {
    drawerListeners.add(listener);
    return () => {
      drawerListeners.delete(listener);
    };
  },

  init(): void {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          currentWishlistState = updateWishlistState(parsed);
          notify();
        }
      }
    } catch {
      // Local storage unreadable, fallback to initial state
    }
  },

  persist(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(currentWishlistState.items)
      );
    } catch {
      // Local storage full or unavailable
    }
  },

  addItem(item: WishlistItem): void {
    if (currentWishlistState.items.some((i) => i.id === item.id || i.slug === item.slug)) {
      return;
    }

    currentWishlistState = updateWishlistState([item, ...currentWishlistState.items]);
    this.persist();
    notify();
  },

  removeItem(id: string): void {
    currentWishlistState = updateWishlistState(
      currentWishlistState.items.filter((i) => i.id !== id && i.slug !== id)
    );
    this.persist();
    notify();
  },

  toggleItem(item: WishlistItem): boolean {
    const exists = currentWishlistState.items.some(
      (i) => i.id === item.id || i.slug === item.slug
    );
    if (exists) {
      this.removeItem(item.id);
      return false;
    } else {
      this.addItem(item);
      return true;
    }
  },

  hasItem(idOrSlug: string): boolean {
    return currentWishlistState.items.some(
      (i) => i.id === idOrSlug || i.slug === idOrSlug
    );
  },

  clearWishlist(): void {
    currentWishlistState = initialWishlistState;
    this.persist();
    notify();
  },

  openDrawer(): void {
    if (!isDrawerOpenState) {
      isDrawerOpenState = true;
      notifyDrawer();
    }
  },

  closeDrawer(): void {
    if (isDrawerOpenState) {
      isDrawerOpenState = false;
      notifyDrawer();
    }
  },

  toggleDrawer(): void {
    isDrawerOpenState = !isDrawerOpenState;
    notifyDrawer();
  },
};
