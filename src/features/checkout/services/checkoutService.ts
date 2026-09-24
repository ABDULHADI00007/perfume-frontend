import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/types/api";
import {
  CreateOrderPayload,
  CreatedOrder,
  StoreSettingsData,
  CouponValidationData,
} from "../types";

export const checkoutService = {
  /**
   * Authoritative Order Creation via Backend
   */
  async createOrder(payload: CreateOrderPayload): Promise<ApiResponse<CreatedOrder>> {
    return apiClient<ApiResponse<CreatedOrder>>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch Public Store Settings (shipping thresholds, tax, real bank transfer details)
   */
  async getStoreSettings(): Promise<ApiResponse<StoreSettingsData>> {
    return apiClient<ApiResponse<StoreSettingsData>>("/settings");
  },

  /**
   * Validate Coupon against authoritative backend
   */
  async validateCoupon(
    code: string,
    subtotal: number,
    customerEmail?: string
  ): Promise<ApiResponse<CouponValidationData>> {
    return apiClient<ApiResponse<CouponValidationData>>("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({
        code: code.trim().toUpperCase(),
        subtotal,
        customerEmail: customerEmail ? customerEmail.trim().toLowerCase() : undefined,
      }),
    });
  },

  /**
   * Retrieve Public Order Confirmation Snapshot
   */
  async getOrderConfirmation(orderNumber: string): Promise<ApiResponse<CreatedOrder>> {
    return apiClient<ApiResponse<CreatedOrder>>(`/orders/confirmation/${orderNumber}`);
  },
};
