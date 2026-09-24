export type PaymentMethod = "cash_on_delivery" | "bank_transfer";

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CheckoutAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItemInput {
  productId: string;
  sku: string;
  size?: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItemInput[];
  shippingAddress: CheckoutAddress;
  billingAddress?: CheckoutAddress;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
  idempotencyKey?: string;
}

export interface BankTransferSettings {
  enabled: boolean;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  instructions: string;
}

export interface StoreSettingsData {
  _id?: string;
  store: {
    name: string;
    slogan: string;
    supportEmail: string;
    supportPhone?: string;
    address?: string;
  };
  currency: {
    code: string;
    symbol: string;
    format: string;
  };
  shipping: {
    freeShippingThreshold: number;
    flatRateFee: number;
    defaultCarrier: string;
  };
  tax: {
    enableTax: boolean;
    defaultTaxPercentage: number;
    taxIncludedInPrice: boolean;
  };
  payment: {
    cod: {
      enabled: boolean;
    };
    bankTransfer: BankTransferSettings;
  };
}

export interface CreatedOrder {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: PaymentMethod;
  customerSnapshot: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: CheckoutAddress;
  items: Array<{
    product: string;
    name: string;
    sku: string;
    size: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    image?: string;
  }>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  currency: string;
  couponCode?: string;
  createdAt: string;
}

export interface CouponValidationData {
  coupon: {
    _id: string;
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    description?: string;
  };
  subtotal: number;
  discountAmount: number;
  finalSubtotal: number;
}
