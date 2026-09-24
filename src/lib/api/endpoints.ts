export const API_ENDPOINTS = {
  products: {
    list: "/products",
    detail: (slug: string) => `/products/${slug}`,
    featured: "/products?featured=true",
  },
  categories: {
    list: "/categories",
    detail: (slug: string) => `/categories/${slug}`,
  },
  collections: {
    list: "/collections",
    detail: (slug: string) => `/collections/${slug}`,
  },
  orders: {
    create: "/orders",
    detail: (id: string) => `/orders/${id}`,
    confirmation: (orderNumber: string) => `/orders/confirmation/${orderNumber}`,
    submitPaymentProof: (orderNumberOrId: string) => `/orders/${orderNumberOrId}/payment-proof`,
  },
  settings: {
    get: "/settings",
  },
  reviews: {
    byProduct: (productId: string) => `/reviews/product/${productId}`,
    create: "/reviews",
  },
  coupons: {
    validate: "/coupons/validate",
  },
  journal: {
    list: "/journal",
    detail: (slug: string) => `/journal/${slug}`,
  },
  blog: {
    list: "/blog",
    detail: (slug: string) => `/blog/${slug}`,
  },
  newsletter: {
    subscribe: "/newsletter/subscribe",
  },
  admin: {
    stats: "/admin/dashboard",
    products: "/admin/products",
    orders: "/admin/orders",
    customers: "/admin/customers",
    reviews: "/admin/reviews",
    inventory: "/admin/inventory",
    coupons: "/admin/coupons",
    categories: "/admin/categories",
    collections: "/admin/collections",
    journal: "/admin/journal",
    settings: "/admin/settings",
  },
} as const;
