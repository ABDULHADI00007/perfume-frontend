import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/api";
import {
  Order,
  OrderConfirmation,
  SubmitPaymentProofPayload,
  StoreSettingsData,
} from "../types";

export const orderService = {
  /**
   * Get single order by ID (internal / admin)
   */
  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return apiClient<ApiResponse<Order>>(API_ENDPOINTS.orders.detail(id));
  },

  /**
   * Get sanitized customer order confirmation by order number (Public)
   */
  async getOrderConfirmation(
    orderNumber: string
  ): Promise<ApiResponse<OrderConfirmation>> {
    return apiClient<ApiResponse<OrderConfirmation>>(
      API_ENDPOINTS.orders.confirmation(orderNumber.toUpperCase().trim())
    );
  },

  /**
   * Submit payment proof for a Bank Transfer order (Public)
   */
  async submitPaymentProof(
    orderNumberOrId: string,
    payload: SubmitPaymentProofPayload
  ): Promise<ApiResponse<OrderConfirmation>> {
    return apiClient<ApiResponse<OrderConfirmation>>(
      API_ENDPOINTS.orders.submitPaymentProof(orderNumberOrId.trim()),
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  /**
   * Fetch store settings (for dynamic bank transfer details)
   */
  async getStoreSettings(): Promise<ApiResponse<StoreSettingsData>> {
    return apiClient<ApiResponse<StoreSettingsData>>(API_ENDPOINTS.settings.get);
  },
};

