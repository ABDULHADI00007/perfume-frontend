"use client";

import { useEffect, useState } from "react";
import { Review } from "../types";
import { reviewService } from "../services/reviewService";

export function useReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!productId) return;
    reviewService
      .getReviewsByProduct(productId)
      .then((res) => setReviews(res.data || []))
      .finally(() => setLoading(false));
  }, [productId]);

  return { reviews, loading };
}
