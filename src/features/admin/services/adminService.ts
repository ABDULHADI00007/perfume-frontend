import { apiClient } from "@/lib/api/client";
import {
  AdminBlogPost,
  AdminCategory,
  AdminCollection,
  AdminCoupon,
  AdminCustomer,
  AdminInventoryItem,
  AdminOrder,
  AdminProduct,
  AdminReview,
  AdminSettings,
  AdminSubscriber,
  ApiResponse,
  DashboardOverviewStats,
} from "../types";

// ==========================================
// IN-MEMORY STALE-WHILE-REVALIDATE CACHE
// ==========================================
const cacheMap = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes in-memory cache

function getCached<T>(key: string): T | null {
  const item = cacheMap.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    cacheMap.delete(key);
    return null;
  }
  return item.data as T;
}

function setCached<T>(key: string, data: T): T {
  cacheMap.set(key, { data, timestamp: Date.now() });
  return data;
}

export function clearAdminCache(prefix?: string): void {
  if (!prefix) {
    cacheMap.clear();
    return;
  }
  for (const key of cacheMap.keys()) {
    if (key.startsWith(prefix)) {
      cacheMap.delete(key);
    }
  }
}

export const adminService = {
  // Synchronous Cache Accessors
  getCachedDashboard(): DashboardOverviewStats | null {
    return getCached<DashboardOverviewStats>("dashboard");
  },
  getCachedOrders(params: Record<string, unknown> = {}): { orders: AdminOrder[]; meta?: ApiResponse<AdminOrder[]>["meta"] } | null {
    return getCached(`orders:${JSON.stringify(params)}`);
  },
  getCachedProducts(params: Record<string, unknown> = {}): { products: AdminProduct[]; meta?: ApiResponse<AdminProduct[]>["meta"] } | null {
    return getCached(`products:${JSON.stringify(params)}`);
  },
  getCachedCategories(): AdminCategory[] | null {
    return getCached("categories");
  },
  getCachedCollections(): AdminCollection[] | null {
    return getCached("collections");
  },
  getCachedInventory(params: Record<string, unknown> = {}): { items: AdminInventoryItem[]; meta?: ApiResponse<AdminInventoryItem[]>["meta"] } | null {
    return getCached(`inventory:${JSON.stringify(params)}`);
  },
  getCachedCustomers(params: Record<string, unknown> = {}): { customers: AdminCustomer[]; meta?: ApiResponse<AdminCustomer[]>["meta"] } | null {
    return getCached(`customers:${JSON.stringify(params)}`);
  },
  getCachedCoupons(params: Record<string, unknown> = {}): { coupons: AdminCoupon[]; meta?: ApiResponse<AdminCoupon[]>["meta"] } | null {
    return getCached(`coupons:${JSON.stringify(params)}`);
  },
  getCachedReviews(): AdminReview[] | null {
    return getCached("reviews");
  },
  getCachedBlogPosts(params: Record<string, unknown> = {}): { posts: AdminBlogPost[]; meta?: ApiResponse<AdminBlogPost[]>["meta"] } | null {
    return getCached(`blog:${JSON.stringify(params)}`);
  },
  getCachedSubscribers(params: Record<string, unknown> = {}): { subscribers: AdminSubscriber[]; meta?: ApiResponse<AdminSubscriber[]>["meta"] } | null {
    return getCached(`newsletter:${JSON.stringify(params)}`);
  },
  getCachedSettings(): AdminSettings | null {
    return getCached("settings");
  },

  // ==========================================
  // DASHBOARD
  // ==========================================
  async getDashboardOverview(skipCache = false): Promise<DashboardOverviewStats> {
    const key = "dashboard";
    if (!skipCache) {
      const cached = getCached<DashboardOverviewStats>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<DashboardOverviewStats>>("/admin/dashboard");
    return setCached(key, response.data);
  },

  // ==========================================
  // ORDERS
  // ==========================================
  async getOrders(
    params: {
      page?: number;
      limit?: number;
      orderStatus?: string;
      paymentStatus?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
    } = {},
    skipCache = false
  ): Promise<{ orders: AdminOrder[]; meta?: ApiResponse<AdminOrder[]>["meta"] }> {
    const key = `orders:${JSON.stringify(params)}`;
    if (!skipCache) {
      const cached = getCached<{ orders: AdminOrder[]; meta?: ApiResponse<AdminOrder[]>["meta"] }>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminOrder[]>>("/orders", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    const result = {
      orders: response.data || [],
      meta: response.meta,
    };
    return setCached(key, result);
  },

  async getOrderById(id: string, skipCache = false): Promise<AdminOrder> {
    const key = `order:${id}`;
    if (!skipCache) {
      const cached = getCached<AdminOrder>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminOrder>>(`/orders/${id}`);
    return setCached(key, response.data);
  },

  async approvePayment(orderId: string): Promise<AdminOrder> {
    clearAdminCache("orders");
    clearAdminCache(`order:${orderId}`);
    clearAdminCache("dashboard");
    const response = await apiClient<ApiResponse<AdminOrder>>(`/orders/${orderId}/payment/approve`, {
      method: "POST",
    });
    return response.data;
  },

  async rejectPayment(orderId: string, reason: string): Promise<AdminOrder> {
    clearAdminCache("orders");
    clearAdminCache(`order:${orderId}`);
    clearAdminCache("dashboard");
    const response = await apiClient<ApiResponse<AdminOrder>>(`/orders/${orderId}/payment/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
    return response.data;
  },

  async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<AdminOrder> {
    clearAdminCache("orders");
    clearAdminCache(`order:${orderId}`);
    clearAdminCache("dashboard");
    const response = await apiClient<ApiResponse<AdminOrder>>(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    });
    return response.data;
  },

  async updatePaymentStatus(orderId: string, paymentStatus: string, notes?: string): Promise<AdminOrder> {
    clearAdminCache("orders");
    clearAdminCache(`order:${orderId}`);
    clearAdminCache("dashboard");
    const response = await apiClient<ApiResponse<AdminOrder>>(`/orders/${orderId}/payment-status`, {
      method: "PATCH",
      body: JSON.stringify({ paymentStatus, notes }),
    });
    return response.data;
  },

  async updateShippingInfo(
    orderId: string,
    shippingData: {
      carrier?: string;
      trackingNumber?: string;
      trackingUrl?: string;
      estimatedDelivery?: string;
      shippedAt?: string;
      deliveredAt?: string;
    }
  ): Promise<AdminOrder> {
    clearAdminCache("orders");
    clearAdminCache(`order:${orderId}`);
    const response = await apiClient<ApiResponse<AdminOrder>>(`/orders/${orderId}/shipping`, {
      method: "PATCH",
      body: JSON.stringify(shippingData),
    });
    return response.data;
  },

  async cancelOrder(orderId: string, reason?: string): Promise<AdminOrder> {
    clearAdminCache("orders");
    clearAdminCache(`order:${orderId}`);
    clearAdminCache("dashboard");
    const response = await apiClient<ApiResponse<AdminOrder>>(`/orders/${orderId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
    return response.data;
  },

  // ==========================================
  // PRODUCTS
  // ==========================================
  async getProducts(
    params: {
      page?: number;
      limit?: number;
      category?: string;
      collection?: string;
      search?: string;
      status?: string;
      sort?: string;
    } = {},
    skipCache = false
  ): Promise<{ products: AdminProduct[]; meta?: ApiResponse<AdminProduct[]>["meta"] }> {
    const key = `products:${JSON.stringify(params)}`;
    if (!skipCache) {
      const cached = getCached<{ products: AdminProduct[]; meta?: ApiResponse<AdminProduct[]>["meta"] }>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminProduct[]>>("/products", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    const result = {
      products: response.data || [],
      meta: response.meta,
    };
    return setCached(key, result);
  },

  async getProductById(id: string, skipCache = false): Promise<AdminProduct> {
    const key = `product:${id}`;
    if (!skipCache) {
      const cached = getCached<AdminProduct>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminProduct>>(`/products/id/${id}`);
    return setCached(key, response.data);
  },

  async createProduct(productData: Partial<AdminProduct>): Promise<AdminProduct> {
    clearAdminCache("products");
    clearAdminCache("dashboard");
    const response = await apiClient<ApiResponse<AdminProduct>>("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
    return response.data;
  },

  async updateProduct(id: string, productData: Partial<AdminProduct>): Promise<AdminProduct> {
    clearAdminCache("products");
    clearAdminCache(`product:${id}`);
    clearAdminCache("dashboard");
    const response = await apiClient<ApiResponse<AdminProduct>>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
    return response.data;
  },

  async archiveProduct(id: string): Promise<void> {
    clearAdminCache("products");
    clearAdminCache(`product:${id}`);
    clearAdminCache("dashboard");
    await apiClient<ApiResponse<unknown>>(`/products/${id}`, {
      method: "DELETE",
    });
  },

  async restoreProduct(id: string): Promise<AdminProduct> {
    clearAdminCache("products");
    clearAdminCache(`product:${id}`);
    clearAdminCache("dashboard");
    const response = await apiClient<ApiResponse<AdminProduct>>(`/products/${id}/restore`, {
      method: "PATCH",
    });
    return response.data;
  },

  // ==========================================
  // CATEGORIES
  // ==========================================
  async getCategories(skipCache = false): Promise<AdminCategory[]> {
    const key = "categories";
    if (!skipCache) {
      const cached = getCached<AdminCategory[]>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminCategory[]>>("/categories");
    const result = response.data || [];
    return setCached(key, result);
  },

  async getCategoryByIdOrSlug(id: string, skipCache = false): Promise<AdminCategory> {
    const key = `category:${id}`;
    if (!skipCache) {
      const cached = getCached<AdminCategory>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminCategory>>(`/categories/${id}`);
    return setCached(key, response.data);
  },

  async createCategory(categoryData: Partial<AdminCategory>): Promise<AdminCategory> {
    clearAdminCache("categories");
    const response = await apiClient<ApiResponse<AdminCategory>>("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
    return response.data;
  },

  async updateCategory(id: string, categoryData: Partial<AdminCategory>): Promise<AdminCategory> {
    clearAdminCache("categories");
    clearAdminCache(`category:${id}`);
    const response = await apiClient<ApiResponse<AdminCategory>>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
    return response.data;
  },

  async archiveCategory(id: string): Promise<AdminCategory> {
    clearAdminCache("categories");
    clearAdminCache(`category:${id}`);
    const response = await apiClient<ApiResponse<AdminCategory>>(`/categories/${id}/archive`, {
      method: "PATCH",
    });
    return response.data;
  },

  async deleteCategory(id: string): Promise<void> {
    clearAdminCache("categories");
    await apiClient<ApiResponse<unknown>>(`/categories/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // COLLECTIONS
  // ==========================================
  async getCollections(skipCache = false): Promise<AdminCollection[]> {
    const key = "collections";
    if (!skipCache) {
      const cached = getCached<AdminCollection[]>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminCollection[]>>("/collections");
    const result = response.data || [];
    return setCached(key, result);
  },

  async getCollectionByIdOrSlug(id: string, skipCache = false): Promise<AdminCollection> {
    const key = `collection:${id}`;
    if (!skipCache) {
      const cached = getCached<AdminCollection>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminCollection>>(`/collections/${id}`);
    return setCached(key, response.data);
  },

  async createCollection(collectionData: Partial<AdminCollection>): Promise<AdminCollection> {
    clearAdminCache("collections");
    const response = await apiClient<ApiResponse<AdminCollection>>("/collections", {
      method: "POST",
      body: JSON.stringify(collectionData),
    });
    return response.data;
  },

  async updateCollection(id: string, collectionData: Partial<AdminCollection>): Promise<AdminCollection> {
    clearAdminCache("collections");
    clearAdminCache(`collection:${id}`);
    const response = await apiClient<ApiResponse<AdminCollection>>(`/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(collectionData),
    });
    return response.data;
  },

  async archiveCollection(id: string): Promise<AdminCollection> {
    clearAdminCache("collections");
    clearAdminCache(`collection:${id}`);
    const response = await apiClient<ApiResponse<AdminCollection>>(`/collections/${id}/archive`, {
      method: "PATCH",
    });
    return response.data;
  },

  async deleteCollection(id: string): Promise<void> {
    clearAdminCache("collections");
    await apiClient<ApiResponse<unknown>>(`/collections/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // INVENTORY
  // ==========================================
  async getInventory(
    params: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
      lowStock?: string;
    } = {},
    skipCache = false
  ): Promise<{ items: AdminInventoryItem[]; meta?: ApiResponse<AdminInventoryItem[]>["meta"] }> {
    const key = `inventory:${JSON.stringify(params)}`;
    if (!skipCache) {
      const cached = getCached<{ items: AdminInventoryItem[]; meta?: ApiResponse<AdminInventoryItem[]>["meta"] }>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminInventoryItem[]>>("/inventory", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    const result = {
      items: response.data || [],
      meta: response.meta,
    };
    return setCached(key, result);
  },

  async updateInventoryQuantity(id: string, quantity: number, reason?: string): Promise<AdminInventoryItem> {
    clearAdminCache("inventory");
    clearAdminCache("dashboard");
    const response = await apiClient<ApiResponse<AdminInventoryItem>>(`/inventory/${id}/quantity`, {
      method: "PATCH",
      body: JSON.stringify({ quantity, reason }),
    });
    return response.data;
  },

  async adjustInventoryStock(data: {
    variantSku: string;
    productId?: string;
    adjustment: number;
    reason: string;
  }): Promise<AdminInventoryItem> {
    clearAdminCache("inventory");
    clearAdminCache("dashboard");
    const response = await apiClient<ApiResponse<AdminInventoryItem>>("/inventory/adjust", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  },

  // ==========================================
  // CUSTOMERS
  // ==========================================
  async getCustomers(
    params: {
      page?: number;
      limit?: number;
      search?: string;
    } = {},
    skipCache = false
  ): Promise<{ customers: AdminCustomer[]; meta?: ApiResponse<AdminCustomer[]>["meta"] }> {
    const key = `customers:${JSON.stringify(params)}`;
    if (!skipCache) {
      const cached = getCached<{ customers: AdminCustomer[]; meta?: ApiResponse<AdminCustomer[]>["meta"] }>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminCustomer[]>>("/customers", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    const result = {
      customers: response.data || [],
      meta: response.meta,
    };
    return setCached(key, result);
  },

  async getCustomerById(id: string, skipCache = false): Promise<AdminCustomer> {
    const key = `customer:${id}`;
    if (!skipCache) {
      const cached = getCached<AdminCustomer>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminCustomer>>(`/customers/${id}`);
    return setCached(key, response.data);
  },

  async updateCustomer(id: string, data: Partial<AdminCustomer>): Promise<AdminCustomer> {
    clearAdminCache("customers");
    clearAdminCache(`customer:${id}`);
    const response = await apiClient<ApiResponse<AdminCustomer>>(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async updateCustomerStatus(id: string, status: "active" | "inactive" | "blocked"): Promise<AdminCustomer> {
    clearAdminCache("customers");
    clearAdminCache(`customer:${id}`);
    const response = await apiClient<ApiResponse<AdminCustomer>>(`/customers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return response.data;
  },

  // ==========================================
  // COUPONS
  // ==========================================
  async getCoupons(
    params: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    } = {},
    skipCache = false
  ): Promise<{ coupons: AdminCoupon[]; meta?: ApiResponse<AdminCoupon[]>["meta"] }> {
    const key = `coupons:${JSON.stringify(params)}`;
    if (!skipCache) {
      const cached = getCached<{ coupons: AdminCoupon[]; meta?: ApiResponse<AdminCoupon[]>["meta"] }>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminCoupon[]>>("/coupons", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    const result = {
      coupons: response.data || [],
      meta: response.meta,
    };
    return setCached(key, result);
  },

  async getCouponById(id: string, skipCache = false): Promise<AdminCoupon> {
    const key = `coupon:${id}`;
    if (!skipCache) {
      const cached = getCached<AdminCoupon>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminCoupon>>(`/coupons/${id}`);
    return setCached(key, response.data);
  },

  async createCoupon(data: Partial<AdminCoupon>): Promise<AdminCoupon> {
    clearAdminCache("coupons");
    const response = await apiClient<ApiResponse<AdminCoupon>>("/coupons", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async updateCoupon(id: string, data: Partial<AdminCoupon>): Promise<AdminCoupon> {
    clearAdminCache("coupons");
    clearAdminCache(`coupon:${id}`);
    const response = await apiClient<ApiResponse<AdminCoupon>>(`/coupons/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async deactivateCoupon(id: string): Promise<AdminCoupon> {
    clearAdminCache("coupons");
    clearAdminCache(`coupon:${id}`);
    const response = await apiClient<ApiResponse<AdminCoupon>>(`/coupons/${id}/status`, {
      method: "PATCH",
    });
    return response.data;
  },

  async deleteCoupon(id: string): Promise<void> {
    clearAdminCache("coupons");
    await apiClient<ApiResponse<unknown>>(`/coupons/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // REVIEWS
  // ==========================================
  async getAdminReviews(skipCache = false): Promise<AdminReview[]> {
    const key = "reviews";
    if (!skipCache) {
      const cached = getCached<AdminReview[]>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminReview[]>>("/reviews");
    const result = response.data || [];
    return setCached(key, result);
  },

  async moderateReview(id: string, status: "pending" | "approved" | "rejected"): Promise<AdminReview> {
    clearAdminCache("reviews");
    const response = await apiClient<ApiResponse<AdminReview>>(`/reviews/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return response.data;
  },

  async deleteReview(id: string): Promise<void> {
    clearAdminCache("reviews");
    await apiClient<ApiResponse<unknown>>(`/reviews/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // BLOG / JOURNAL
  // ==========================================
  async getAdminBlogPosts(
    params: {
      page?: number;
      limit?: number;
      status?: string;
      category?: string;
      search?: string;
    } = {},
    skipCache = false
  ): Promise<{ posts: AdminBlogPost[]; meta?: ApiResponse<AdminBlogPost[]>["meta"] }> {
    const key = `blog:${JSON.stringify(params)}`;
    if (!skipCache) {
      const cached = getCached<{ posts: AdminBlogPost[]; meta?: ApiResponse<AdminBlogPost[]>["meta"] }>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminBlogPost[]>>("/blog/admin/all", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    const result = {
      posts: response.data || [],
      meta: response.meta,
    };
    return setCached(key, result);
  },

  async getAdminBlogPostById(id: string, skipCache = false): Promise<AdminBlogPost> {
    const key = `blogPost:${id}`;
    if (!skipCache) {
      const cached = getCached<AdminBlogPost>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminBlogPost>>(`/blog/admin/${id}`);
    return setCached(key, response.data);
  },

  async createBlogPost(data: Partial<AdminBlogPost>): Promise<AdminBlogPost> {
    clearAdminCache("blog");
    const response = await apiClient<ApiResponse<AdminBlogPost>>("/blog", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async updateBlogPost(id: string, data: Partial<AdminBlogPost>): Promise<AdminBlogPost> {
    clearAdminCache("blog");
    clearAdminCache(`blogPost:${id}`);
    const response = await apiClient<ApiResponse<AdminBlogPost>>(`/blog/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async publishBlogPost(id: string): Promise<AdminBlogPost> {
    clearAdminCache("blog");
    clearAdminCache(`blogPost:${id}`);
    const response = await apiClient<ApiResponse<AdminBlogPost>>(`/blog/${id}/publish`, {
      method: "PATCH",
    });
    return response.data;
  },

  async unpublishBlogPost(id: string): Promise<AdminBlogPost> {
    clearAdminCache("blog");
    clearAdminCache(`blogPost:${id}`);
    const response = await apiClient<ApiResponse<AdminBlogPost>>(`/blog/${id}/unpublish`, {
      method: "PATCH",
    });
    return response.data;
  },

  async archiveBlogPost(id: string): Promise<AdminBlogPost> {
    clearAdminCache("blog");
    clearAdminCache(`blogPost:${id}`);
    const response = await apiClient<ApiResponse<AdminBlogPost>>(`/blog/${id}/archive`, {
      method: "PATCH",
    });
    return response.data;
  },

  async deleteBlogPost(id: string): Promise<void> {
    clearAdminCache("blog");
    await apiClient<ApiResponse<unknown>>(`/blog/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // NEWSLETTER
  // ==========================================
  async getSubscribers(
    params: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    } = {},
    skipCache = false
  ): Promise<{ subscribers: AdminSubscriber[]; meta?: ApiResponse<AdminSubscriber[]>["meta"] }> {
    const key = `newsletter:${JSON.stringify(params)}`;
    if (!skipCache) {
      const cached = getCached<{ subscribers: AdminSubscriber[]; meta?: ApiResponse<AdminSubscriber[]>["meta"] }>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminSubscriber[]>>("/newsletter", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    const result = {
      subscribers: response.data || [],
      meta: response.meta,
    };
    return setCached(key, result);
  },

  async updateSubscriberStatus(id: string, status: "subscribed" | "unsubscribed"): Promise<AdminSubscriber> {
    clearAdminCache("newsletter");
    const response = await apiClient<ApiResponse<AdminSubscriber>>(`/newsletter/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return response.data;
  },

  async deleteSubscriber(id: string): Promise<void> {
    clearAdminCache("newsletter");
    await apiClient<ApiResponse<unknown>>(`/newsletter/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // SETTINGS
  // ==========================================
  async getSettings(skipCache = false): Promise<AdminSettings> {
    const key = "settings";
    if (!skipCache) {
      const cached = getCached<AdminSettings>(key);
      if (cached) return cached;
    }
    const response = await apiClient<ApiResponse<AdminSettings>>("/settings");
    const result = response.data || {};
    return setCached(key, result);
  },

  async updateSettings(data: Partial<AdminSettings>): Promise<AdminSettings> {
    clearAdminCache("settings");
    const response = await apiClient<ApiResponse<AdminSettings>>("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  },
};
