// =============================================================================
// Happy Store — Shared Types
// All domain types live here. Services, hooks, and components import from this
// file. This is the single source of truth for the data shape.
// =============================================================================

// ---------------------------------------------------------------------------
// Primitives & Utilities
// ---------------------------------------------------------------------------

export type UUID = string;
export type ISO8601 = string; // e.g. "2026-07-14T12:00:00.000Z"

/** Standard API envelope returned by every service method. */
export interface ApiResponse<T> {
  data: T;
  ok: boolean;
  status: number;
  message?: string;
}

/** Paginated list response. */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Auth / User
// ---------------------------------------------------------------------------

export type UserRole = "customer" | "shop_owner" | "admin";
export type UserStatus = "active" | "suspended";

export interface User {
  id: UUID;
  fullName: string;
  email: string;
  phone?: string;
  initials: string;
  role: UserRole;
  status: UserStatus;
  memberSince: string;
  avatarUrl?: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
  /** Server-issued session identifier, required alongside the refresh-token
   *  cookie to silently refresh an access token after a page reload. */
  sessionId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

// ---------------------------------------------------------------------------
// Address & Payment
// ---------------------------------------------------------------------------

export interface Address {
  id: UUID;
  label: string;
  detail: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: UUID;
  brand: string;
  last4: string;
  expiry: string;
  isDefault?: boolean;
}

// ---------------------------------------------------------------------------
// Shop
// ---------------------------------------------------------------------------

export type ShopStatus = "approved" | "pending" | "suspended";

export interface Shop {
  id: UUID;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance: string;
  distanceMiles: number;
  open: boolean;
  promoted?: boolean;
  description: string;
  address: string;
  hours: { day: string; hours: string }[];
  reviews: Review[];
  ratingBreakdown: [number, number, number, number, number]; // 5→1 star percentages
  status?: ShopStatus;
}

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------

export interface Category {
  slug: string;
  label: string;
  productCount?: number;
}

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------

export interface Product {
  id: UUID;
  name: string;
  description: string;
  shopId: UUID;
  shopName: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  unit?: string;
  outOfStock?: boolean;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
}

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

export interface CartItem {
  productId: UUID;
  name: string;
  shopId: UUID;
  shopName: string;
  price: number;
  unit?: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

// ---------------------------------------------------------------------------
// Order
// ---------------------------------------------------------------------------

export type OrderStatus =
  | "placed"
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "cancelled";

export interface OrderLineItem {
  productId: UUID;
  name: string;
  price: number;
  quantity: number;
  unit?: string;
}

export interface Order {
  id: string; // e.g. "HS-10502"
  shopId: UUID;
  shopName: string;
  items: OrderLineItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  method: "delivery" | "pickup";
  address?: string;
  placedAt: ISO8601;
  etaMinutes: number;
}

export interface PlaceOrderPayload {
  shopId: UUID;
  shopName: string;
  items: OrderLineItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  method: "delivery" | "pickup";
  address?: string;
  etaMinutes: number;
}

// ---------------------------------------------------------------------------
// Review
// ---------------------------------------------------------------------------

export interface Review {
  id: UUID;
  authorName: string;
  authorInitials: string;
  rating: number;
  date: string;
  comment: string;
  reply?: string;
}

// ---------------------------------------------------------------------------
// Notification
// ---------------------------------------------------------------------------

export type NotificationTone = "info" | "warning" | "error" | "success" | "accent";

export interface Notification {
  id: UUID;
  title: string;
  description: string;
  time: string;
  tone: NotificationTone;
  read?: boolean;
}

// ---------------------------------------------------------------------------
// Message / Conversation
// ---------------------------------------------------------------------------

export interface Message {
  fromShop: boolean;
  text: string;
  time: string;
}

export interface Conversation {
  id: UUID;
  customerName: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: Message[];
}

// ---------------------------------------------------------------------------
// Payment / Finance
// ---------------------------------------------------------------------------

export type TransactionType = "sale" | "payout" | "fee" | "refund";

export interface Transaction {
  id: UUID;
  date: string;
  description: string;
  type: TransactionType;
  amount: number;
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export interface RevenueSeries {
  day: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  name: string;
  unitsSold: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface SearchResult {
  shops: Shop[];
  products: Product[];
}

export interface SearchSuggestion {
  type: "shop" | "product" | "category";
  label: string;
  id: string;
}
