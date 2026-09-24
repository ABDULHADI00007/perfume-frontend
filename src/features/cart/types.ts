import { ID } from "@/types/common";

export interface CartItem {
  id: ID;
  productId: ID;
  variantId: ID;
  title: string;
  size: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}
