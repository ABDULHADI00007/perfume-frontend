import { allProducts } from "./products";
import { Product } from "../types";

export const initialFeaturedProducts: Product[] = allProducts.filter((p) => p.featured);
