"use client";

import { useState } from "react";
import { Coupon } from "../types";

export function useCoupon() {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyCoupon = async (code: string) => {
    if (!code) {
      setError("Coupon code cannot be empty");
      return;
    }
    // Coupon validation signature
    setError(null);
  };

  return { coupon, setCoupon, applyCoupon, error };
}
