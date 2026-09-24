import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/api";
import { Review } from "../types";

export const reviewService = {
  async getReviewsByProduct(productId: string): Promise<ApiResponse<Review[]>> {
    return apiClient<ApiResponse<Review[]>>(API_ENDPOINTS.reviews.byProduct(productId));
  },
};
