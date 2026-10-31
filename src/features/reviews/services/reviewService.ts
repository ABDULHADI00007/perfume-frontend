import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/api";
import { Review, CreateReviewInput } from "../types";

export const reviewService = {
  async getReviewsByProduct(productId: string): Promise<ApiResponse<Review[]>> {
    return apiClient<ApiResponse<Review[]>>(API_ENDPOINTS.reviews.byProduct(productId));
  },

  async createReview(data: CreateReviewInput): Promise<ApiResponse<Review>> {
    return apiClient<ApiResponse<Review>>(API_ENDPOINTS.reviews.create, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
