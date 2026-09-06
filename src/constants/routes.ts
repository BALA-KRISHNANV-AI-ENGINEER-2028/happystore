// =============================================================================
// Happy Store — Route Constants
// Single source of truth for all application routes. Import these instead of
// hardcoding strings in Link/navigate() calls.
// =============================================================================

export const ROUTES = {
  // Public
  LANDING: "/",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  GOOGLE_CALLBACK: "/auth/google/callback",

  // Customer app
  HOME: "/home",
  SHOPS: "/shops",
  SHOP_DETAILS: (shopId: string) => `/shops/${shopId}`,
  CATEGORIES: "/categories",
  CATEGORY_PRODUCTS: (slug: string) => `/categories/${slug}`,
  PRODUCTS: "/products",
  PRODUCT_DETAILS: (productId: string) => `/products/${productId}`,
  SEARCH: "/search",
  OFFERS: "/offers",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  ORDER_DETAILS: (orderId: string) => `/orders/${orderId}`,
  NOTIFICATIONS: "/notifications",
  WISHLIST: "/wishlist",
  ACCOUNT: "/account",
  SETTINGS: "/settings",
  SUPPORT: "/support",

  // Shop owner dashboard
  SHOP_DASHBOARD: "/dashboard/shop",
  SHOP_ORDERS: "/dashboard/shop/orders",
  SHOP_INVENTORY: "/dashboard/shop/inventory",
  SHOP_PRODUCTS: "/dashboard/shop/products",
  SHOP_PROMOTIONS: "/dashboard/shop/promotions",
  SHOP_ANALYTICS: "/dashboard/shop/analytics",
  SHOP_CUSTOMERS: "/dashboard/shop/customers",
  SHOP_REVIEWS: "/dashboard/shop/reviews",
  SHOP_FINANCE: "/dashboard/shop/finance",
  SHOP_REPORTS: "/dashboard/shop/reports",
  SHOP_MESSAGES: "/dashboard/shop/messages",
  SHOP_SETTINGS: "/dashboard/shop/settings",

  // Admin dashboard
  ADMIN_DASHBOARD: "/dashboard/admin",
  ADMIN_USERS: "/dashboard/admin/users",
  ADMIN_SHOPS: "/dashboard/admin/shops",
  ADMIN_PRODUCTS: "/dashboard/admin/products",
  ADMIN_CATEGORIES: "/dashboard/admin/categories",
  ADMIN_ORDERS: "/dashboard/admin/orders",
  ADMIN_REPORTS: "/dashboard/admin/reports",
  ADMIN_REVENUE: "/dashboard/admin/revenue",
  ADMIN_ANALYTICS: "/dashboard/admin/analytics",
  ADMIN_NOTIFICATIONS: "/dashboard/admin/notifications",
  ADMIN_CMS: "/dashboard/admin/cms",
  ADMIN_ROLES: "/dashboard/admin/roles",
  ADMIN_AUDIT_LOGS: "/dashboard/admin/audit-logs",
  ADMIN_SYSTEM_HEALTH: "/dashboard/admin/system-health",
  ADMIN_SETTINGS: "/dashboard/admin/settings",

  // Dev tools
  DEV_TOKENS: "/dev/tokens",
  DEV_COMPONENTS: "/dev/components",
} as const;
