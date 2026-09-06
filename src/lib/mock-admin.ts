export const platformRevenueSeries = [
  { day: "Jun 27", revenue: 18400, orders: 812 },
  { day: "Jun 28", revenue: 17200, orders: 764 },
  { day: "Jun 29", revenue: 19800, orders: 890 },
  { day: "Jun 30", revenue: 21500, orders: 945 },
  { day: "Jul 1", revenue: 20100, orders: 902 },
  { day: "Jul 2", revenue: 22800, orders: 1010 },
  { day: "Jul 3", revenue: 24600, orders: 1088 },
  { day: "Jul 4", revenue: 23900, orders: 1050 },
  { day: "Jul 5", revenue: 21200, orders: 940 },
  { day: "Jul 6", revenue: 19600, orders: 870 },
  { day: "Jul 7", revenue: 22400, orders: 998 },
  { day: "Jul 8", revenue: 25100, orders: 1122 },
  { day: "Jul 9", revenue: 24300, orders: 1080 },
  { day: "Jul 10", revenue: 26200, orders: 1164 },
];

export type UserRole = "customer" | "shop_owner" | "admin";
export type UserStatus = "active" | "suspended";

export interface AdminUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
  orders: number;
}

export const adminUsers: AdminUser[] = [
  { id: "u1", name: "Jordan Rivera", initials: "JR", email: "jordan@example.com", role: "customer", status: "active", joined: "Mar 2023", orders: 46 },
  { id: "u2", name: "Priya Sharma", initials: "PS", email: "priya.s@example.com", role: "customer", status: "active", joined: "Jan 2024", orders: 24 },
  { id: "u3", name: "Marcus Rivera", initials: "MR", email: "marcus@riverabakery.com", role: "shop_owner", status: "active", joined: "Nov 2022", orders: 0 },
  { id: "u4", name: "Devon Kim", initials: "DK", email: "devon.k@example.com", role: "customer", status: "suspended", joined: "Aug 2023", orders: 7 },
  { id: "u5", name: "Elena Vance", initials: "EV", email: "elena@greenleafrx.com", role: "shop_owner", status: "active", joined: "Feb 2023", orders: 0 },
  { id: "u6", name: "Sam Ortiz", initials: "SO", email: "sam.o@example.com", role: "customer", status: "active", joined: "May 2024", orders: 12 },
];

export type ShopStatus = "approved" | "pending" | "suspended";

export interface AdminShop {
  id: string;
  name: string;
  owner: string;
  category: string;
  status: ShopStatus;
  rating: number;
  joined: string;
  revenue: number;
}

export const adminShops: AdminShop[] = [
  { id: "corner-market", name: "Corner Market", owner: "Jamie Osei", category: "Grocery", status: "approved", rating: 4.8, joined: "Jan 2023", revenue: 84210 },
  { id: "rivera-bakery", name: "Rivera Bakery", owner: "Marcus Rivera", category: "Bakery", status: "approved", rating: 4.6, joined: "Nov 2022", revenue: 52340 },
  { id: "green-leaf-pharmacy", name: "Green Leaf Pharmacy", owner: "Elena Vance", category: "Pharmacy", status: "approved", rating: 4.4, joined: "Feb 2023", revenue: 61200 },
  { id: "sunny-side-cafe", name: "Sunny Side Cafe", owner: "Sam Delgado", category: "Cafe", status: "pending", rating: 0, joined: "Jul 2026", revenue: 0 },
  { id: "harbor-general", name: "Harbor General Store", owner: "Tasha Lin", category: "General", status: "approved", rating: 4.2, joined: "Sep 2023", revenue: 28430 },
  { id: "maple-diner", name: "Maple Street Diner", owner: "Frank Costa", category: "Dining", status: "suspended", rating: 3.9, joined: "Apr 2022", revenue: 41010 },
];

export interface AdminProduct {
  id: string;
  name: string;
  shopName: string;
  category: string;
  price: number;
  flagged: boolean;
}

export const adminProducts: AdminProduct[] = [
  { id: "p1", name: "Organic Whole Milk, 1 Gal", shopName: "Corner Market", category: "Groceries", price: 4.29, flagged: false },
  { id: "p2", name: "Sourdough Loaf", shopName: "Rivera Bakery", category: "Bakery", price: 6.5, flagged: false },
  { id: "p3", name: "Allergy Relief, 30ct", shopName: "Green Leaf Pharmacy", category: "Pharmacy", price: 12.99, flagged: false },
  { id: "p4", name: "\"Miracle\" Detox Tea", shopName: "Harbor General Store", category: "General", price: 24.99, flagged: true },
  { id: "p5", name: "Family Meal Combo", shopName: "Maple Street Diner", category: "Dining", price: 28.0, flagged: false },
];

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export const adminCategories: AdminCategory[] = [
  { id: "c1", name: "Groceries", slug: "groceries", productCount: 5 },
  { id: "c2", name: "Bakery", slug: "bakery", productCount: 4 },
  { id: "c3", name: "Cafe", slug: "cafe", productCount: 2 },
  { id: "c4", name: "Pharmacy", slug: "pharmacy", productCount: 3 },
  { id: "c5", name: "General", slug: "general", productCount: 2 },
  { id: "c6", name: "Dining", slug: "dining", productCount: 2 },
];

export interface AdminOrder {
  id: string;
  customerName: string;
  shopName: string;
  total: number;
  status: "placed" | "preparing" | "on_the_way" | "delivered" | "cancelled";
  date: string;
}

export const adminOrders: AdminOrder[] = [
  { id: "ES-10502", customerName: "Priya Sharma", shopName: "Corner Market", total: 24.10, status: "placed", date: "2 min ago" },
  { id: "ES-10501", customerName: "Marcus Tran", shopName: "Corner Market", total: 8.99, status: "placed", date: "6 min ago" },
  { id: "ES-10498", customerName: "Alicia Torres", shopName: "Corner Market", total: 20.49, status: "preparing", date: "14 min ago" },
  { id: "ES-10490", customerName: "Nora Jansen", shopName: "Rivera Bakery", total: 13.00, status: "on_the_way", date: "31 min ago" },
  { id: "ES-10484", customerName: "Elena Vance", shopName: "Green Leaf Pharmacy", total: 14.78, status: "delivered", date: "2 hours ago" },
  { id: "ES-10479", customerName: "Tom Bailey", shopName: "Maple Street Diner", total: 15.98, status: "cancelled", date: "3 hours ago" },
];

export const revenueByCategory = [
  { category: "Groceries", revenue: 84210 },
  { category: "Pharmacy", revenue: 61200 },
  { category: "Bakery", revenue: 52340 },
  { category: "Dining", revenue: 41010 },
  { category: "General", revenue: 28430 },
];

export interface AdminReport {
  id: string;
  title: string;
  period: string;
  size: string;
}

export const adminReports: AdminReport[] = [
  { id: "r1", title: "Platform revenue summary", period: "June 2026", size: "1.2 MB" },
  { id: "r2", title: "Shop performance ranking", period: "Q2 2026", size: "640 KB" },
  { id: "r3", title: "User growth & retention", period: "June 2026", size: "410 KB" },
  { id: "r4", title: "Commission & payouts", period: "June 2026", size: "780 KB" },
];

export interface AdminNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: "warning" | "info" | "error";
}

export const adminNotifications: AdminNotification[] = [
  { id: "n1", title: "New shop pending approval", description: "Sunny Side Cafe submitted an application", time: "10 min ago", tone: "info" },
  { id: "n2", title: "Product flagged by users", description: "\"Miracle\" Detox Tea reported 4 times this week", time: "1 hour ago", tone: "warning" },
  { id: "n3", title: "Payment processor delay", description: "Payout processing delayed by ~2 hours", time: "3 hours ago", tone: "error" },
  { id: "n4", title: "Shop suspended", description: "Maple Street Diner suspended for policy violation", time: "1 day ago", tone: "warning" },
];

export interface CmsBanner {
  id: string;
  title: string;
  placement: string;
  status: "published" | "draft";
}

export const cmsBanners: CmsBanner[] = [
  { id: "b1", title: "Summer produce sale hero banner", placement: "Landing hero", status: "published" },
  { id: "b2", title: "Refer a neighbor promo strip", placement: "Home page", status: "published" },
  { id: "b3", title: "Holiday hours notice", placement: "Site-wide banner", status: "draft" },
];

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export const adminRoles: AdminRole[] = [
  { id: "role-admin", name: "Super Admin", description: "Full access to all platform settings and data", permissions: ["Manage users", "Manage shops", "Manage finances", "Manage roles", "View audit logs"], userCount: 2 },
  { id: "role-support", name: "Support Agent", description: "Can view and assist with orders and user issues", permissions: ["View users", "View orders", "Issue refunds"], userCount: 6 },
  { id: "role-content", name: "Content Manager", description: "Manages CMS content and promotions", permissions: ["Manage CMS", "Manage promotions"], userCount: 3 },
];

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
}

export const auditLogs: AuditLogEntry[] = [
  { id: "a1", actor: "Jamie Osei (admin)", action: "Suspended shop", target: "Maple Street Diner", time: "1 day ago" },
  { id: "a2", actor: "Jamie Osei (admin)", action: "Approved shop", target: "Harbor General Store", time: "3 days ago" },
  { id: "a3", actor: "Priya Sharma (support)", action: "Issued refund", target: "Order #ES-10312", time: "4 days ago" },
  { id: "a4", actor: "System", action: "Flagged product", target: "\"Miracle\" Detox Tea", time: "5 days ago" },
  { id: "a5", actor: "Jamie Osei (admin)", action: "Updated role permissions", target: "Support Agent", time: "1 week ago" },
];

export interface SystemService {
  id: string;
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: string;
}

export const systemServices: SystemService[] = [
  { id: "s1", name: "Web application", status: "operational", uptime: "99.99%" },
  { id: "s2", name: "Order processing", status: "operational", uptime: "99.97%" },
  { id: "s3", name: "Payments", status: "degraded", uptime: "99.42%" },
  { id: "s4", name: "Notifications", status: "operational", uptime: "99.95%" },
  { id: "s5", name: "Search", status: "operational", uptime: "99.99%" },
];
