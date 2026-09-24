import { ID, Timestamps } from "@/types/common";

export interface ProductVariant {
  id: ID;
  size: string; // e.g. "50ml", "100ml"
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
}

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product extends Timestamps {
  id: ID;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  concentration: string; // e.g. "Extrait de Parfum", "Eau de Parfum"
  olfactoryFamily?: string; // e.g. "Woody Oriental", "Floral Amber"
  notes: FragranceNotes;
  notesSummary?: string; // e.g. "Amber · Oud · Vanilla"
  variants: ProductVariant[];
  images: string[];
  featured: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isLimitedEdition?: boolean;
  isPlatinum?: boolean;
  gender?: "all" | "men" | "women" | "unisex";
  categoryId: ID;
  collectionId?: ID;
  rating?: number;
  ratingCount?: number;
}


