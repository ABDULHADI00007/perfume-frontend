import { CartItem, CartState } from "../types";
import { calculateCartItemCount, calculateCartSubtotal } from "../utils";

export const initialCartState: CartState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
};

const CART_STORAGE_KEY = "maison_parfum_cart";

let currentCartState: CartState = initialCartState;
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
      new CustomEvent("cart-drawer-change", {
        detail: { isOpen: isDrawerOpenState },
      })
    );
  }
}

export function updateCartState(items: CartItem[]): CartState {
  const filtered = items.filter((item) => item.quantity > 0);
  return {
    items: filtered,
    subtotal: calculateCartSubtotal(filtered),
    itemCount: calculateCartItemCount(filtered),
  };
}

export const cartStore = {
  getSnapshot(): CartState {
    return currentCartState;
  },

  getServerSnapshot(): CartState {
    return initialCartState;
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

  openCart() {
    isDrawerOpenState = true;
    notifyDrawer();
  },

  closeCart() {
    isDrawerOpenState = false;
    notifyDrawer();
  },

  toggleCart() {
    isDrawerOpenState = !isDrawerOpenState;
    notifyDrawer();
  },

  init() {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const sanitized: CartItem[] = parsed
            .filter((item: unknown): item is Record<string, unknown> => {
              if (!item || typeof item !== "object") return false;
              const obj = item as Record<string, unknown>;
              return (
                Boolean(obj.productId) &&
                typeof obj.price === "number" &&
                !isNaN(obj.price) &&
                obj.price >= 0 &&
                typeof obj.quantity === "number" &&
                obj.quantity > 0
              );
            })
            .map((item) => ({
              id: String(item.id || `${item.productId}-${item.variantId || "std"}`),
              productId: String(item.productId),
              variantId: String(item.variantId || "v-std"),
              title: String(item.title || "Fragrance"),
              size: String(item.size || "50ml"),
              price: Number(item.price),
              quantity: Math.floor(Number(item.quantity)),
              image: item.image ? String(item.image) : undefined,
              sku: item.sku ? String(item.sku) : undefined,
            }));
          currentCartState = updateCartState(sanitized);
          notify();
        }
      }
    } catch {
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch {
        // Storage disabled or quota exceeded
      }
    }
  },

  save(state: CartState) {
    currentCartState = state;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      } catch {
        // Storage errors ignored
      }
    }
    notify();
  },

  addItem(item: CartItem) {
    const items = [...currentCartState.items];
    const existingIndex = items.findIndex(
      (i) => i.productId === item.productId && i.variantId === item.variantId
    );
    if (existingIndex > -1) {
      items[existingIndex] = {
        ...items[existingIndex],
        quantity: items[existingIndex].quantity + item.quantity,
      };
    } else {
      items.push(item);
    }
    this.save(updateCartState(items));
    this.openCart();
  },

  updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }
    const items = currentCartState.items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    this.save(updateCartState(items));
  },

  removeItem(id: string) {
    const items = currentCartState.items.filter((item) => item.id !== id);
    this.save(updateCartState(items));
  },

  clearCart() {
    this.save(initialCartState);
  },
};
