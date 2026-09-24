"use client";

import { useEffect, useState } from "react";
import { Order } from "../types";
import { orderService } from "../services/orderService";

export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    orderService
      .getOrderById(id)
      .then((res) => setOrder(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  return { order, loading };
}
