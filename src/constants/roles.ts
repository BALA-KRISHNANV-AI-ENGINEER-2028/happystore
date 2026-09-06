// =============================================================================
// Happy Store — Role & Permission Constants
// =============================================================================

export const USER_ROLES = {
  CUSTOMER: "customer",
  SHOP_OWNER: "shop_owner",
  ADMIN: "admin",
} as const;

export type UserRoleValue = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/** Permissions are grouped by role for easy role-guard checks. */
export const ROLE_PERMISSIONS: Record<UserRoleValue, string[]> = {
  customer: [
    "view:shops",
    "view:products",
    "manage:cart",
    "manage:wishlist",
    "place:orders",
    "view:orders",
    "write:reviews",
    "manage:profile",
  ],
  shop_owner: [
    "view:shops",
    "view:products",
    "manage:own_shop",
    "manage:own_products",
    "manage:own_inventory",
    "view:own_orders",
    "view:own_analytics",
    "view:own_customers",
    "manage:own_promotions",
    "view:own_messages",
  ],
  admin: [
    "manage:users",
    "manage:shops",
    "manage:products",
    "manage:categories",
    "view:all_orders",
    "manage:cms",
    "manage:roles",
    "view:audit_logs",
    "view:system_health",
    "manage:settings",
  ],
};

// ---------------------------------------------------------------------------
// Business Constants
// ---------------------------------------------------------------------------

export const BUSINESS = {
  /** Minimum order amount for free delivery (USD). */
  FREE_DELIVERY_THRESHOLD: 35,

  /** Default delivery fee when not free (USD). */
  DEFAULT_DELIVERY_FEE: 3.99,

  /** Platform commission rate (%). */
  COMMISSION_RATE: 8,

  /** Maximum distance (miles) for "nearby" shops. */
  NEARBY_MAX_MILES: 5,

  /** Tax rate applied at checkout (%). */
  TAX_RATE: 0.08,

  /** Maximum items per cart. */
  MAX_CART_ITEMS: 50,

  /** Low stock threshold for inventory warnings. */
  LOW_STOCK_THRESHOLD: 10,
} as const;

// ---------------------------------------------------------------------------
// Validation Rules (kept in sync with Zod schemas)
// ---------------------------------------------------------------------------

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  FULL_NAME_MIN_LENGTH: 2,
  REVIEW_COMMENT_MIN_LENGTH: 10,
  REVIEW_COMMENT_MAX_LENGTH: 500,
} as const;

// ---------------------------------------------------------------------------
// Local Storage Keys
// ---------------------------------------------------------------------------

export const STORAGE_KEYS = {
  THEME: "happystore-theme",
  CART: "happystore-cart",
  ORDERS: "happystore-orders",
  AUTH: "happystore-auth",
  USER_PREFERENCES: "happystore-preferences",
} as const;

// ---------------------------------------------------------------------------
// Query Keys (TanStack Query)
// ---------------------------------------------------------------------------

export const QUERY_KEYS = {
  SHOPS: "shops",
  SHOP: (id: string) => ["shop", id] as const,
  NEARBY_SHOPS: "nearby-shops",
  PRODUCTS: "products",
  PRODUCT: (id: string) => ["product", id] as const,
  RELATED_PRODUCTS: (id: string) => ["related-products", id] as const,
  CATEGORIES: "categories",
  ORDERS: "orders",
  ORDER: (id: string) => ["order", id] as const,
  WISHLIST: "wishlist",
  NOTIFICATIONS: "notifications",
  SEARCH: (q: string) => ["search", q] as const,
  PROFILE: "profile",
  ADDRESSES: "addresses",
  PAYMENT_METHODS: "payment-methods",

  // Admin
  ADMIN_USERS: "admin-users",
  ADMIN_SHOPS: "admin-shops",
  ADMIN_PRODUCTS: "admin-products",
  ADMIN_ORDERS: "admin-orders",
  ADMIN_ANALYTICS: "admin-analytics",
} as const;
