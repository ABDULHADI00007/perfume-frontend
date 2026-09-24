"use client";

import { useState } from "react";
import { CreateOrderPayload, CreatedOrder } from "../types";
import { checkoutService } from "../services/checkoutService";

export function useCheckout() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submitOrder = async (payload: CreateOrderPayload): Promise<CreatedOrder | null> => {
    setError(null);
    setLoading(true);
    try {
      const res = await checkoutService.createOrder(payload);
      if (res.success && res.data) {
        return res.data;
      }
      setError(res.message || "Failed to place order");
      return null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to place order";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submitOrder, loading, error };
}
