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

export const adminService = {
  // ==========================================
  // DASHBOARD
  // ==========================================
  async getDashboardOverview(): Promise<DashboardOverviewStats> {
    const response = await apiClient<ApiResponse<DashboardOverviewStats>>("/admin/dashboard");
    return response.data;
  },

  // ==========================================
  // ORDERS
  // ==========================================
  async getOrders(params: {
    page?: number;
    limit?: number;
    orderStatus?: string;
    paymentStatus?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<{ orders: AdminOrder[]; meta?: ApiResponse<AdminOrder[]>["meta"] }> {
    const response = await apiClient<ApiResponse<AdminOrder[]>>("/orders", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    return {
      orders: response.data || [],
      meta: response.meta,
    };
  },

  async getOrderById(id: string): Promise<AdminOrder> {
    const response = await apiClient<ApiResponse<AdminOrder>>(`/orders/${id}`);
    return response.data;
  },

  async approvePayment(orderId: string): Promise<AdminOrder> {
    const response = await apiClient<ApiResponse<AdminOrder>>(`/orders/${orderId}/payment/approve`, {
      method: "POST",
    });
    return response.data;
  },

  async rejectPayment(orderId: string, reason: string): Promise<AdminOrder> {
    const response = await apiClient<ApiResponse<AdminOrder>>(`/orders/${orderId}/payment/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
    return response.data;
  },

  async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<AdminOrder> {
    const response = await apiClient<ApiResponse<AdminOrder>>(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
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
    const response = await apiClient<ApiResponse<AdminOrder>>(`/orders/${orderId}/shipping`, {
      method: "PATCH",
      body: JSON.stringify(shippingData),
    });
    return response.data;
  },

  async cancelOrder(orderId: string, reason?: string): Promise<AdminOrder> {
    const response = await apiClient<ApiResponse<AdminOrder>>(`/orders/${orderId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
    return response.data;
  },

  // ==========================================
  // PRODUCTS
  // ==========================================
  async getProducts(params: {
    page?: number;
    limit?: number;
    category?: string;
    collection?: string;
    search?: string;
    status?: string;
    sort?: string;
  } = {}): Promise<{ products: AdminProduct[]; meta?: ApiResponse<AdminProduct[]>["meta"] }> {
    const response = await apiClient<ApiResponse<AdminProduct[]>>("/products", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    return {
      products: response.data || [],
      meta: response.meta,
    };
  },

  async getProductById(id: string): Promise<AdminProduct> {
    const response = await apiClient<ApiResponse<AdminProduct>>(`/products/id/${id}`);
    return response.data;
  },

  async createProduct(productData: Partial<AdminProduct>): Promise<AdminProduct> {
    const response = await apiClient<ApiResponse<AdminProduct>>("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
    return response.data;
  },

  async updateProduct(id: string, productData: Partial<AdminProduct>): Promise<AdminProduct> {
    const response = await apiClient<ApiResponse<AdminProduct>>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
    return response.data;
  },

  async archiveProduct(id: string): Promise<void> {
    await apiClient<ApiResponse<unknown>>(`/products/${id}`, {
      method: "DELETE",
    });
  },

  async restoreProduct(id: string): Promise<AdminProduct> {
    const response = await apiClient<ApiResponse<AdminProduct>>(`/products/${id}/restore`, {
      method: "PATCH",
    });
    return response.data;
  },

  // ==========================================
  // CATEGORIES
  // ==========================================
  async getCategories(): Promise<AdminCategory[]> {
    const response = await apiClient<ApiResponse<AdminCategory[]>>("/categories");
    return response.data || [];
  },

  async getCategoryByIdOrSlug(id: string): Promise<AdminCategory> {
    const response = await apiClient<ApiResponse<AdminCategory>>(`/categories/${id}`);
    return response.data;
  },

  async createCategory(categoryData: Partial<AdminCategory>): Promise<AdminCategory> {
    const response = await apiClient<ApiResponse<AdminCategory>>("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
    return response.data;
  },

  async updateCategory(id: string, categoryData: Partial<AdminCategory>): Promise<AdminCategory> {
    const response = await apiClient<ApiResponse<AdminCategory>>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
    return response.data;
  },

  async archiveCategory(id: string): Promise<AdminCategory> {
    const response = await apiClient<ApiResponse<AdminCategory>>(`/categories/${id}/archive`, {
      method: "PATCH",
    });
    return response.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient<ApiResponse<unknown>>(`/categories/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // COLLECTIONS
  // ==========================================
  async getCollections(): Promise<AdminCollection[]> {
    const response = await apiClient<ApiResponse<AdminCollection[]>>("/collections");
    return response.data || [];
  },

  async getCollectionByIdOrSlug(id: string): Promise<AdminCollection> {
    const response = await apiClient<ApiResponse<AdminCollection>>(`/collections/${id}`);
    return response.data;
  },

  async createCollection(collectionData: Partial<AdminCollection>): Promise<AdminCollection> {
    const response = await apiClient<ApiResponse<AdminCollection>>("/collections", {
      method: "POST",
      body: JSON.stringify(collectionData),
    });
    return response.data;
  },

  async updateCollection(id: string, collectionData: Partial<AdminCollection>): Promise<AdminCollection> {
    const response = await apiClient<ApiResponse<AdminCollection>>(`/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(collectionData),
    });
    return response.data;
  },

  async archiveCollection(id: string): Promise<AdminCollection> {
    const response = await apiClient<ApiResponse<AdminCollection>>(`/collections/${id}/archive`, {
      method: "PATCH",
    });
    return response.data;
  },

  async deleteCollection(id: string): Promise<void> {
    await apiClient<ApiResponse<unknown>>(`/collections/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // INVENTORY
  // ==========================================
  async getInventory(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    lowStock?: string;
  } = {}): Promise<{ items: AdminInventoryItem[]; meta?: ApiResponse<AdminInventoryItem[]>["meta"] }> {
    const response = await apiClient<ApiResponse<AdminInventoryItem[]>>("/inventory", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    return {
      items: response.data || [],
      meta: response.meta,
    };
  },

  async updateInventoryQuantity(id: string, quantity: number, reason?: string): Promise<AdminInventoryItem> {
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
    const response = await apiClient<ApiResponse<AdminInventoryItem>>("/inventory/adjust", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  },

  // ==========================================
  // CUSTOMERS
  // ==========================================
  async getCustomers(params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<{ customers: AdminCustomer[]; meta?: ApiResponse<AdminCustomer[]>["meta"] }> {
    const response = await apiClient<ApiResponse<AdminCustomer[]>>("/customers", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    return {
      customers: response.data || [],
      meta: response.meta,
    };
  },

  async getCustomerById(id: string): Promise<AdminCustomer> {
    const response = await apiClient<ApiResponse<AdminCustomer>>(`/customers/${id}`);
    return response.data;
  },

  async updateCustomer(id: string, data: Partial<AdminCustomer>): Promise<AdminCustomer> {
    const response = await apiClient<ApiResponse<AdminCustomer>>(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async updateCustomerStatus(id: string, status: "active" | "inactive" | "blocked"): Promise<AdminCustomer> {
    const response = await apiClient<ApiResponse<AdminCustomer>>(`/customers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return response.data;
  },

  // ==========================================
  // COUPONS
  // ==========================================
  async getCoupons(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}): Promise<{ coupons: AdminCoupon[]; meta?: ApiResponse<AdminCoupon[]>["meta"] }> {
    const response = await apiClient<ApiResponse<AdminCoupon[]>>("/coupons", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    return {
      coupons: response.data || [],
      meta: response.meta,
    };
  },

  async getCouponById(id: string): Promise<AdminCoupon> {
    const response = await apiClient<ApiResponse<AdminCoupon>>(`/coupons/${id}`);
    return response.data;
  },

  async createCoupon(data: Partial<AdminCoupon>): Promise<AdminCoupon> {
    const response = await apiClient<ApiResponse<AdminCoupon>>("/coupons", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async updateCoupon(id: string, data: Partial<AdminCoupon>): Promise<AdminCoupon> {
    const response = await apiClient<ApiResponse<AdminCoupon>>(`/coupons/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async deactivateCoupon(id: string): Promise<AdminCoupon> {
    const response = await apiClient<ApiResponse<AdminCoupon>>(`/coupons/${id}/status`, {
      method: "PATCH",
    });
    return response.data;
  },

  async deleteCoupon(id: string): Promise<void> {
    await apiClient<ApiResponse<unknown>>(`/coupons/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // REVIEWS
  // ==========================================
  async getAdminReviews(): Promise<AdminReview[]> {
    const response = await apiClient<ApiResponse<AdminReview[]>>("/reviews");
    return response.data || [];
  },

  async moderateReview(id: string, status: "pending" | "approved" | "rejected"): Promise<AdminReview> {
    const response = await apiClient<ApiResponse<AdminReview>>(`/reviews/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return response.data;
  },

  async deleteReview(id: string): Promise<void> {
    await apiClient<ApiResponse<unknown>>(`/reviews/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // BLOG / JOURNAL
  // ==========================================
  async getAdminBlogPosts(params: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  } = {}): Promise<{ posts: AdminBlogPost[]; meta?: ApiResponse<AdminBlogPost[]>["meta"] }> {
    const response = await apiClient<ApiResponse<AdminBlogPost[]>>("/blog/admin/all", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    return {
      posts: response.data || [],
      meta: response.meta,
    };
  },

  async getAdminBlogPostById(id: string): Promise<AdminBlogPost> {
    const response = await apiClient<ApiResponse<AdminBlogPost>>(`/blog/admin/${id}`);
    return response.data;
  },

  async createBlogPost(data: Partial<AdminBlogPost>): Promise<AdminBlogPost> {
    const response = await apiClient<ApiResponse<AdminBlogPost>>("/blog", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async updateBlogPost(id: string, data: Partial<AdminBlogPost>): Promise<AdminBlogPost> {
    const response = await apiClient<ApiResponse<AdminBlogPost>>(`/blog/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async publishBlogPost(id: string): Promise<AdminBlogPost> {
    const response = await apiClient<ApiResponse<AdminBlogPost>>(`/blog/${id}/publish`, {
      method: "PATCH",
    });
    return response.data;
  },

  async unpublishBlogPost(id: string): Promise<AdminBlogPost> {
    const response = await apiClient<ApiResponse<AdminBlogPost>>(`/blog/${id}/unpublish`, {
      method: "PATCH",
    });
    return response.data;
  },

  async archiveBlogPost(id: string): Promise<AdminBlogPost> {
    const response = await apiClient<ApiResponse<AdminBlogPost>>(`/blog/${id}/archive`, {
      method: "PATCH",
    });
    return response.data;
  },

  async deleteBlogPost(id: string): Promise<void> {
    await apiClient<ApiResponse<unknown>>(`/blog/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // NEWSLETTER
  // ==========================================
  async getSubscribers(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}): Promise<{ subscribers: AdminSubscriber[]; meta?: ApiResponse<AdminSubscriber[]>["meta"] }> {
    const response = await apiClient<ApiResponse<AdminSubscriber[]>>("/newsletter", {
      params: params as Record<string, string | number | boolean | undefined>,
    });
    return {
      subscribers: response.data || [],
      meta: response.meta,
    };
  },

  async updateSubscriberStatus(id: string, status: "subscribed" | "unsubscribed"): Promise<AdminSubscriber> {
    const response = await apiClient<ApiResponse<AdminSubscriber>>(`/newsletter/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return response.data;
  },

  async deleteSubscriber(id: string): Promise<void> {
    await apiClient<ApiResponse<unknown>>(`/newsletter/${id}`, {
      method: "DELETE",
    });
  },

  // ==========================================
  // SETTINGS
  // ==========================================
  async getSettings(): Promise<AdminSettings> {
    const response = await apiClient<ApiResponse<AdminSettings>>("/settings");
    return response.data || {};
  },

  async updateSettings(data: Partial<AdminSettings>): Promise<AdminSettings> {
    const response = await apiClient<ApiResponse<AdminSettings>>("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  },
};
