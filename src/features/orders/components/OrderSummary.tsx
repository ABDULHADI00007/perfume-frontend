import React from "react";
import { Order } from "../types";

export interface OrderSummaryProps {
  order: Order;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  return (
    <div className="border border-neutral-200 p-6">
      <h3 className="text-lg font-serif">Order #{order.orderNumber}</h3>
    </div>
  );
};
