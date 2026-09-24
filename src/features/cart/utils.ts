import { CartItem } from "./types";

export function calculateCartSubtotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export function calculateCartItemCount(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.quantity, 0);
}
