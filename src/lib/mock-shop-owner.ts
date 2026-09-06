export type ShopOrderStatus = "new" | "preparing" | "ready" | "completed" | "cancelled";

export interface ShopOrder {
  id: string;
  customerName: string;
  items: string;
  itemCount: number;
  total: number;
  status: ShopOrderStatus;
  placedAt: string;
  method: "delivery" | "pickup";
}

export const shopOrders: ShopOrder[] = [
  { id: "ES-10502", customerName: "Priya Sharma", items: "Milk, eggs, sourdough +2", itemCount: 5, total: 24.10, status: "new", placedAt: "2 min ago", method: "delivery" },
  { id: "ES-10501", customerName: "Marcus Tran", items: "Cold brew concentrate", itemCount: 1, total: 8.99, status: "new", placedAt: "6 min ago", method: "pickup" },
  { id: "ES-10498", customerName: "Alicia Torres", items: "Avocados x2, sparkling water", itemCount: 3, total: 20.49, status: "preparing", placedAt: "14 min ago", method: "delivery" },
  { id: "ES-10495", customerName: "Devon Kim", items: "Cage-free eggs, milk", itemCount: 2, total: 9.78, status: "preparing", placedAt: "22 min ago", method: "delivery" },
  { id: "ES-10490", customerName: "Nora Jansen", items: "Sourdough loaf x2", itemCount: 2, total: 13.00, status: "ready", placedAt: "31 min ago", method: "pickup" },
  { id: "ES-10488", customerName: "Sam Ortiz", items: "Cold brew, avocados", itemCount: 2, total: 15.49, status: "completed", placedAt: "1 hour ago", method: "delivery" },
  { id: "ES-10484", customerName: "Elena Vance", items: "Eggs, milk, sourdough", itemCount: 3, total: 14.78, status: "completed", placedAt: "2 hours ago", method: "delivery" },
  { id: "ES-10479", customerName: "Tom Bailey", items: "Sparkling water x2", itemCount: 2, total: 15.98, status: "cancelled", placedAt: "3 hours ago", method: "pickup" },
];

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  image?: string;
}

export const inventory: InventoryItem[] = [
  { id: "milk-1gal", name: "Organic Whole Milk, 1 Gal", category: "Dairy", price: 4.29, stock: 42, lowStockThreshold: 10 },
  { id: "cold-brew", name: "Cold Brew Concentrate", category: "Beverages", price: 8.99, stock: 18, lowStockThreshold: 10 },
  { id: "eggs-dozen", name: "Cage-Free Eggs, Dozen", category: "Dairy", price: 5.49, stock: 6, lowStockThreshold: 10 },
  { id: "sourdough-corner", name: "Sea Salt Sourdough", price: 5.0, category: "Bakery", stock: 3, lowStockThreshold: 8 },
  { id: "avocados-4pk", name: "Avocados, 4-pack", category: "Produce", price: 6.5, stock: 27, lowStockThreshold: 10 },
  { id: "sparkling-water", name: "Sparkling Water, 12-pack", category: "Beverages", price: 7.99, stock: 0, lowStockThreshold: 10 },
];

export interface Customer {
  id: string;
  name: string;
  initials: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  lastOrder: string;
}

export const customers: Customer[] = [
  { id: "c1", name: "Priya Sharma", initials: "PS", email: "priya.s@example.com", ordersCount: 24, totalSpent: 512.30, lastOrder: "2 min ago" },
  { id: "c2", name: "Marcus Tran", initials: "MT", email: "marcus.t@example.com", ordersCount: 11, totalSpent: 203.40, lastOrder: "6 min ago" },
  { id: "c3", name: "Alicia Torres", initials: "AT", email: "alicia.t@example.com", ordersCount: 18, totalSpent: 388.10, lastOrder: "14 min ago" },
  { id: "c4", name: "Devon Kim", initials: "DK", email: "devon.k@example.com", ordersCount: 7, totalSpent: 96.20, lastOrder: "22 min ago" },
  { id: "c5", name: "Nora Jansen", initials: "NJ", email: "nora.j@example.com", ordersCount: 32, totalSpent: 721.85, lastOrder: "31 min ago" },
];

export interface ShopReview {
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  date: string;
  comment: string;
  reply?: string;
}

export const shopReviews: ShopReview[] = [
  { id: "r1", authorName: "Priya S.", authorInitials: "PS", rating: 5, date: "2d ago", comment: "Fast delivery and everything was fresh. My go-to for weekly groceries now." },
  { id: "r2", authorName: "Marcus T.", authorInitials: "MT", rating: 4, date: "1w ago", comment: "Great selection, wish they had more organic options.", reply: "Thanks Marcus! We're adding 6 new organic lines next month." },
  { id: "r3", authorName: "Alicia T.", authorInitials: "AT", rating: 5, date: "3w ago", comment: "Comparing prices across shops before ordering saves me real money every week." },
];

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "sale" | "payout" | "fee" | "refund";
  amount: number;
}

export const transactions: Transaction[] = [
  { id: "t1", date: "Jul 10", description: "Order #ES-10502", type: "sale", amount: 24.10 },
  { id: "t2", date: "Jul 10", description: "Order #ES-10501", type: "sale", amount: 8.99 },
  { id: "t3", date: "Jul 9", description: "Weekly payout", type: "payout", amount: -842.30 },
  { id: "t4", date: "Jul 9", description: "Platform fee", type: "fee", amount: -42.10 },
  { id: "t5", date: "Jul 8", description: "Refund — Order #ES-10479", type: "refund", amount: -15.98 },
  { id: "t6", date: "Jul 8", description: "Order #ES-10490", type: "sale", amount: 13.00 },
];

export interface Promotion {
  id: string;
  title: string;
  discount: string;
  status: "active" | "scheduled" | "ended";
  dateRange: string;
  redemptions: number;
}

export const promotions: Promotion[] = [
  { id: "p1", title: "15% off first order", discount: "15% off", status: "active", dateRange: "Jul 1 – Jul 31", redemptions: 84 },
  { id: "p2", title: "Free delivery weekend", discount: "Free delivery", status: "scheduled", dateRange: "Jul 19 – Jul 20", redemptions: 0 },
  { id: "p3", title: "Summer produce sale", discount: "20% off produce", status: "ended", dateRange: "Jun 1 – Jun 15", redemptions: 231 },
];

export interface Conversation {
  id: string;
  customerName: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: { fromShop: boolean; text: string; time: string }[];
}

export const conversations: Conversation[] = [
  {
    id: "conv1", customerName: "Priya Sharma", initials: "PS", lastMessage: "Can I add a bag of ice to my order?", time: "2 min ago", unread: true,
    messages: [
      { fromShop: false, text: "Hi! Can I add a bag of ice to my order?", time: "2 min ago" },
    ],
  },
  {
    id: "conv2", customerName: "Marcus Tran", initials: "MT", lastMessage: "Thanks for the quick delivery!", time: "1 hour ago", unread: false,
    messages: [
      { fromShop: false, text: "Order arrived, thank you!", time: "1 hour ago" },
      { fromShop: true, text: "Glad it arrived quickly — thanks for ordering with us!", time: "58 min ago" },
    ],
  },
  {
    id: "conv3", customerName: "Nora Jansen", initials: "NJ", lastMessage: "Is the sourdough baked today?", time: "3 hours ago", unread: false,
    messages: [
      { fromShop: false, text: "Is the sourdough baked today?", time: "3 hours ago" },
      { fromShop: true, text: "Yes, fresh out of the oven this morning!", time: "3 hours ago" },
    ],
  },
];

// Last 14 days — used by Overview + Analytics charts
export const revenueSeries = [
  { day: "Jun 27", revenue: 412, orders: 18 },
  { day: "Jun 28", revenue: 389, orders: 15 },
  { day: "Jun 29", revenue: 456, orders: 20 },
  { day: "Jun 30", revenue: 502, orders: 22 },
  { day: "Jul 1", revenue: 478, orders: 19 },
  { day: "Jul 2", revenue: 534, orders: 24 },
  { day: "Jul 3", revenue: 601, orders: 27 },
  { day: "Jul 4", revenue: 588, orders: 25 },
  { day: "Jul 5", revenue: 512, orders: 21 },
  { day: "Jul 6", revenue: 467, orders: 18 },
  { day: "Jul 7", revenue: 543, orders: 23 },
  { day: "Jul 8", revenue: 621, orders: 28 },
  { day: "Jul 9", revenue: 598, orders: 26 },
  { day: "Jul 10", revenue: 645, orders: 29 },
];

export const topProducts = [
  { name: "Organic Whole Milk", unitsSold: 142 },
  { name: "Sourdough Loaf", unitsSold: 118 },
  { name: "Cage-Free Eggs", unitsSold: 96 },
  { name: "Cold Brew Concentrate", unitsSold: 84 },
  { name: "Avocados, 4-pack", unitsSold: 71 },
];
