import { ID } from "@/types/common";

export interface Coupon {
  id: ID;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
}
