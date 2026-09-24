import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/api";

export const newsletterService = {
  async subscribe(email: string): Promise<ApiResponse<{ subscribed: boolean }>> {
    return apiClient<ApiResponse<{ subscribed: boolean }>>(API_ENDPOINTS.newsletter.subscribe, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};
