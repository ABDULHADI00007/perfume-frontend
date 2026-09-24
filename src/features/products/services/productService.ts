import { cache } from "react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/api";
import { Product } from "../types";
import { normalizeProduct } from "../utils";

export const productService = {
  async getProducts(params?: Record<string, string | number>): Promise<ApiResponse<Product[]>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await apiClient<ApiResponse<any[]>>(API_ENDPOINTS.products.list, { params });
    if (res.success && Array.isArray(res.data)) {
      return {
        ...res,
        data: res.data.map(normalizeProduct),
      };
    }
    return res as unknown as ApiResponse<Product[]>;
  },

  getProductBySlug: cache(async (slug: string): Promise<ApiResponse<Product>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await apiClient<ApiResponse<any>>(API_ENDPOINTS.products.detail(slug));
    if (res.success && res.data) {
      return {
        ...res,
        data: normalizeProduct(res.data),
      };
    }
    return res as unknown as ApiResponse<Product>;
  }),

  getFeaturedProducts: cache(async (): Promise<ApiResponse<Product[]>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await apiClient<ApiResponse<any[]>>(API_ENDPOINTS.products.featured);
    if (res.success && Array.isArray(res.data)) {
      return {
        ...res,
        data: res.data.map(normalizeProduct),
      };
    }
    return res as unknown as ApiResponse<Product[]>;
  }),
};
