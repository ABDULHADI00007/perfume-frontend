import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/api";
import { Category } from "../types";

export const categoryService = {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient<ApiResponse<Category[]>>(API_ENDPOINTS.categories.list);
  },

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    return apiClient<ApiResponse<Category>>(API_ENDPOINTS.categories.detail(slug));
  },
};
