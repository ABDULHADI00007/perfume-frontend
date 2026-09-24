"use client";

import { useEffect, useState } from "react";
import { Product } from "../types";
import { productService } from "../services/productService";

export function useProducts(params?: Record<string, string | number>) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const serializedParams = JSON.stringify(params);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    productService
      .getProducts(params)
      .then((res) => {
        if (isMounted) {
          setProducts(res.data || []);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to fetch products");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedParams]);

  return { products, loading, error };
}
