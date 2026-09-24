export type AdminRole =
  | "superadmin"
  | "admin"
  | "scent_specialist"
  | "inventory_manager"
  | "staff";

export type AdminPermission =
  | "users.read"
  | "users.create"
  | "users.update"
  | "users.delete"
  | "products.read"
  | "products.create"
  | "products.update"
  | "products.archive"
  | "inventory.read"
  | "inventory.adjust"
  | "orders.read"
  | "orders.update"
  | "orders.cancel"
  | "customers.read"
  | "customers.update"
  | "reviews.read"
  | "reviews.moderate"
  | "coupons.read"
  | "coupons.create"
  | "coupons.update"
  | "categories.manage"
  | "collections.manage"
  | "blog.manage"
  | "newsletter.manage"
  | "settings.read"
  | "settings.update";

export interface AdminUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: AdminRole;
  status: "active" | "inactive" | "suspended";
  lastLogin?: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

export interface DashboardOverviewStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

export interface AdminOrderItem {
  _id?: string;
  productId: string | { _id: string; name: string; sku?: string; images?: { url: string }[] };
  sku: string;
  name?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface AdminOrderAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface AdminPaymentProof {
  proofUrl?: string;
  url?: string;
  storageKey?: string;
  originalName?: string;
  mimeType?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  status?: "pending" | "approved" | "rejected";
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: AdminOrderItem[];
  shippingAddress: AdminOrderAddress;
  billingAddress?: AdminOrderAddress;
  paymentMethod: "cash_on_delivery" | "bank_transfer" | "cod";
  paymentStatus:
    | "pending"
    | "pending_verification"
    | "paid"
    | "rejected"
    | "failed"
    | "refunded"
    | "partially_refunded";
  orderStatus:
    | "pending"
    | "awaiting_payment_verification"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded"
    | "payment_rejected";
  paymentProof?: AdminPaymentProof;
  subtotal: number;
  discountAmount?: number;
  shippingFee: number;
  taxAmount?: number;
  totalAmount: number;
  currency?: string;
  couponCode?: string;
  shippingInfo?: {
    carrier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
  notes?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProductImage {
  url: string;
  altText?: string;
  publicId?: string;
  isPrimary?: boolean;
}

export interface AdminProductVariant {
  _id?: string;
  size: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock?: number;
  barcode?: string;
  status?: "active" | "inactive";
}

export interface AdminProduct {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  brand?: string;
  sku: string;
  barcode?: string;
  status: "active" | "draft" | "archived";
  price: number;
  compareAtPrice?: number;
  currency?: string;
  images: AdminProductImage[];
  category: string | { _id: string; name: string; slug?: string };
  collections?: Array<string | { _id: string; name: string; slug?: string }>;
  fragrance?: {
    concentration?: string;
    longevity?: string;
    sillage?: string;
    gender?: "Men" | "Women" | "Unisex";
    topNotes?: string[];
    heartNotes?: string[];
    baseNotes?: string[];
  };
  scentFamily?: string[];
  season?: string[];
  occasions?: string[];
  variants: AdminProductVariant[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
  };
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url?: string;
    altText?: string;
    publicId?: string;
  };
  sortOrder?: number;
  status: "active" | "inactive";
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCollection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url?: string;
    altText?: string;
    publicId?: string;
  };
  products?: Array<string | { _id: string; name: string; slug?: string }>;
  sortOrder?: number;
  status: "active" | "inactive";
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminInventoryItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug?: string;
    sku?: string;
    images?: { url: string }[];
  };
  variantSku: string;
  size?: string;
  quantity: number;
  reservedQuantity?: number;
  availableQuantity?: number;
  lowStockThreshold?: number;
  status?: "in_stock" | "low_stock" | "out_of_stock";
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCustomer {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  status?: "active" | "inactive" | "blocked";
  notes?: string;
  totalOrders?: number;
  totalSpent?: number;
  orders?: AdminOrder[];
  createdAt: string;
  updatedAt?: string;
}

export interface AdminCoupon {
  _id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  usageCount?: number;
  perCustomerLimit?: number;
  startsAt?: string;
  expiresAt: string;
  status: "active" | "inactive" | "expired";
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminReview {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug?: string;
    images?: { url: string }[];
  };
  customerName: string;
  customerEmail: string;
  rating: number;
  title?: string;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface AdminBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: {
    url?: string;
    altText?: string;
  };
  category?: string;
  tags?: string[];
  status: "draft" | "published" | "archived";
  author?: {
    name?: string;
    email?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}


export interface AdminSubscriber {
  _id: string;
  email: string;
  status: "subscribed" | "unsubscribed";
  source?: string;
  subscribedAt?: string;
  createdAt: string;
}

export interface AdminSettings {
  store?: {
    name?: string;
    slogan?: string;
    logo?: string;
    supportEmail?: string;
    supportPhone?: string;
    address?: string;
  };
  currency?: {
    code?: string;
    symbol?: string;
    format?: string;
  };
  shipping?: {
    freeShippingThreshold?: number;
    flatRateFee?: number;
    defaultCarrier?: string;
  };
  tax?: {
    enableTax?: boolean;
    defaultTaxPercentage?: number;
    taxIncludedInPrice?: boolean;
  };
  payment?: {
    cod?: {
      enabled?: boolean;
    };
    bankTransfer?: {
      enabled?: boolean;
      bankName?: string;
      accountTitle?: string;
      accountNumber?: string;
      iban?: string;
      instructions?: string;
    };
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
    pinterest?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
  maintenanceMode?: {
    enabled?: boolean;
    message?: string;
  };
}
