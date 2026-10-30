export interface WishlistItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number;
  size?: string;
  image: string;
  shortDescription?: string;
  description?: string;
}

export interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
}
