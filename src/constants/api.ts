// =============================================================================
// Happy Store — API Endpoint Constants
// These are the endpoint paths used by the API client. In Phase 3, these will
// be prefixed with the real backend base URL.
// =============================================================================

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const API = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: (token: string) => `/auth/verify/${token}`,
    PROFILE: "/auth/profile",
    REFRESH: "/auth/refresh",
    GOOGLE: "/auth/google",
    GOOGLE_EXCHANGE: "/auth/google/exchange",
  },

  // Users / Profile
  USERS: {
    ME: "/users/me",
    UPDATE: "/users/me",
    ADDRESSES: "/users/me/addresses",
    ADDRESS: (id: string) => `/users/me/addresses/${id}`,
    PAYMENT_METHODS: "/users/me/payment-methods",
    PAYMENT_METHOD: (id: string) => `/users/me/payment-methods/${id}`,
  },

  // Shops
  SHOPS: {
    LIST: "/shops",
    NEARBY: "/shops/nearby",
    DETAIL: (id: string) => `/shops/${id}`,
    SEARCH: "/shops/search",
    PRODUCTS: (id: string) => `/shops/${id}/products`,
    REVIEWS: (id: string) => `/shops/${id}/reviews`,
  },

  // Products
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string) => `/products/${id}`,
    RELATED: (id: string) => `/products/${id}/related`,
    SEARCH: "/products/search",
  },

  // Categories
  CATEGORIES: {
    LIST: "/categories",
    DETAIL: (slug: string) => `/categories/${slug}`,
  },

  // Cart
  CART: {
    GET: "/cart",
    ADD: "/cart/items",
    UPDATE: (productId: string) => `/cart/items/${productId}`,
    REMOVE: (productId: string) => `/cart/items/${productId}`,
    CLEAR: "/cart",
  },

  // Wishlist
  WISHLIST: {
    GET: "/wishlist",
    ADD: "/wishlist",
    REMOVE: (productId: string) => `/wishlist/${productId}`,
  },

  // Orders
  ORDERS: {
    LIST: "/orders",
    DETAIL: (id: string) => `/orders/${id}`,
    PLACE: "/orders",
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },

  // Payments
  PAYMENTS: {
    PROCESS: "/payments",
    METHODS: "/payments/methods",
  },

  // Reviews
  REVIEWS: {
    LIST: (shopId: string) => `/shops/${shopId}/reviews`,
    SUBMIT: (shopId: string) => `/shops/${shopId}/reviews`,
    REPLY: (shopId: string, reviewId: string) =>
      `/shops/${shopId}/reviews/${reviewId}/reply`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
  },

  // Messages
  MESSAGES: {
    CONVERSATIONS: "/messages/conversations",
    CONVERSATION: (id: string) => `/messages/conversations/${id}`,
    SEND: (id: string) => `/messages/conversations/${id}/messages`,
  },

  // Search
  SEARCH: {
    QUERY: "/search",
    SUGGESTIONS: "/search/suggestions",
  },

  // Analytics (shop owner)
  ANALYTICS: {
    OVERVIEW: "/analytics/overview",
    REVENUE: "/analytics/revenue",
    TOP_PRODUCTS: "/analytics/top-products",
    CUSTOMERS: "/analytics/customers",
  },

  // Admin
  ADMIN: {
    USERS: {
      LIST: "/admin/users",
      DETAIL: (id: string) => `/admin/users/${id}`,
      UPDATE_STATUS: (id: string) => `/admin/users/${id}/status`,
    },
    SHOPS: {
      LIST: "/admin/shops",
      DETAIL: (id: string) => `/admin/shops/${id}`,
      APPROVE: (id: string) => `/admin/shops/${id}/approve`,
      SUSPEND: (id: string) => `/admin/shops/${id}/suspend`,
    },
    PRODUCTS: {
      LIST: "/admin/products",
      FLAG: (id: string) => `/admin/products/${id}/flag`,
    },
    CATEGORIES: {
      LIST: "/admin/categories",
      CREATE: "/admin/categories",
      UPDATE: (id: string) => `/admin/categories/${id}`,
      DELETE: (id: string) => `/admin/categories/${id}`,
    },
    ORDERS: {
      LIST: "/admin/orders",
    },
    REPORTS: {
      LIST: "/admin/reports",
      DOWNLOAD: (id: string) => `/admin/reports/${id}/download`,
    },
    REVENUE: "/admin/revenue",
    ANALYTICS: "/admin/analytics",
    NOTIFICATIONS: "/admin/notifications",
    CMS: {
      BANNERS: "/admin/cms/banners",
      BANNER: (id: string) => `/admin/cms/banners/${id}`,
    },
    ROLES: {
      LIST: "/admin/roles",
      UPDATE: (id: string) => `/admin/roles/${id}`,
    },
    AUDIT_LOGS: "/admin/audit-logs",
    SYSTEM_HEALTH: "/admin/system/health",
    SETTINGS: "/admin/settings",
  },
} as const;
