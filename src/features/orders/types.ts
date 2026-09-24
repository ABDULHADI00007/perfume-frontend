import { ID, Timestamps } from "@/types/common";
import { PaymentMethod, BankTransferSettings, StoreSettingsData } from "@/features/checkout/types";

export type OrderStatus =
  | "pending"
  | "awaiting_payment_verification"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "payment_rejected";

export type PaymentStatus =
  | "pending"
  | "pending_verification"
  | "paid"
  | "rejected"
  | "failed"
  | "refunded"
  | "partially_refunded";

export interface PaymentProof {
  url: string;
  storageKey?: string;
  originalName?: string;
  mimeType?: "image/jpeg" | "image/png" | "image/webp" | "application/pdf";
  uploadedAt?: string;
}

export interface SubmitPaymentProofPayload {
  url: string;
  storageKey?: string;
  originalName?: string;
  mimeType?: "image/jpeg" | "image/png" | "image/webp" | "application/pdf";
}

export interface OrderItemSnapshot {
  _id?: string;
  product: string;
  name: string;
  sku: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

export interface CustomerSnapshot {
  name: string;
  email: string;
  phone?: string;
}

export interface ShippingAddressSnapshot {
  fullName: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderConfirmation {
  _id?: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentInfo?: {
    provider?: string;
    paymentMethod?: string;
    transactionId?: string;
    paidAt?: string;
  };
  paymentProof?: PaymentProof;
  items: OrderItemSnapshot[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  currency: string;
  customerSnapshot: CustomerSnapshot;
  shippingAddress: ShippingAddressSnapshot;
  createdAt: string;
}

// Backward compatible Order and OrderItem interfaces
export interface OrderItem {
  productId: ID;
  title: string;
  quantity: number;
  price: number;
}

export interface Order extends Timestamps {
  id: ID;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  customerEmail: string;
}

export type { BankTransferSettings, StoreSettingsData, PaymentMethod };

