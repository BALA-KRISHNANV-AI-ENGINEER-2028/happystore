// =============================================================================
// Happy Store — Order Service
// =============================================================================

import { mockGet, mockPost, mockPatch } from "./apiClient";
import type { ApiResponse, Order, PlaceOrderPayload } from "@/types";
import { STORAGE_KEYS } from "@/constants";

let orderCounter = 10503;

function seedOrders(): Order[] {
  const now = Date.now();
  return [
    {
      id: "HS-10482",
      shopId: "corner-market",
      shopName: "Corner Market",
      items: [
        { productId: "milk-1gal", name: "Organic Whole Milk, 1 Gal", price: 4.29, quantity: 1 },
        { productId: "eggs-dozen", name: "Cage-Free Eggs, Dozen", price: 5.49, quantity: 1 },
        { productId: "sourdough-loaf", name: "Sea Salt Sourdough", price: 5.0, quantity: 2 },
      ],
      subtotal: 19.78,
      deliveryFee: 0,
      tax: 1.58,
      total: 21.36,
      status: "on_the_way",
      method: "delivery",
      address: "214 Maple Street, Springfield",
      placedAt: new Date(now - 1000 * 60 * 22).toISOString(),
      etaMinutes: 8,
    },
    {
      id: "HS-10471",
      shopId: "green-leaf-pharmacy",
      shopName: "Green Leaf Pharmacy",
      items: [
        { productId: "allergy-relief", name: "Allergy Relief, 30ct", price: 12.99, quantity: 1 },
        { productId: "vitamin-d3", name: "Vitamin D3, 90ct", price: 9.49, quantity: 1 },
      ],
      subtotal: 22.48,
      deliveryFee: 3.99,
      tax: 1.8,
      total: 28.27,
      status: "delivered",
      method: "delivery",
      address: "214 Maple Street, Springfield",
      placedAt: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
      etaMinutes: 0,
    },
    {
      id: "HS-10460",
      shopId: "rivera-bakery",
      shopName: "Rivera Bakery",
      items: [
        { productId: "sourdough-loaf", name: "Sourdough Loaf", price: 6.5, quantity: 1 },
        { productId: "croissant-4pk", name: "Croissant, 4-pack", price: 7.2, quantity: 1 },
      ],
      subtotal: 13.7,
      deliveryFee: 0,
      tax: 1.1,
      total: 14.8,
      status: "cancelled",
      method: "pickup",
      placedAt: new Date(now - 1000 * 60 * 60 * 24 * 9).toISOString(),
      etaMinutes: 0,
    },
  ];
}

function readOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (raw) return JSON.parse(raw) as Order[];
  } catch {
    // fall through to seed
  }
  return seedOrders();
}

function writeOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

export const orderService = {
  async getOrders(): Promise<ApiResponse<Order[]>> {
    return mockGet(readOrders(), { latencyMs: 200 });
  },

  async getOrderById(id: string): Promise<ApiResponse<Order | null>> {
    const order = readOrders().find((o) => o.id === id) ?? null;
    return mockGet(order, { latencyMs: 150 });
  },

  async placeOrder(payload: PlaceOrderPayload): Promise<ApiResponse<Order>> {
    const order: Order = {
      ...payload,
      id: `HS-${orderCounter++}`,
      status: "placed",
      placedAt: new Date().toISOString(),
    };
    const orders = [order, ...readOrders()];
    writeOrders(orders);
    return mockPost(order, { latencyMs: 1000 });
  },

  async cancelOrder(id: string): Promise<ApiResponse<Order | null>> {
    const orders = readOrders().map((o) =>
      o.id === id ? { ...o, status: "cancelled" as const } : o,
    );
    writeOrders(orders);
    const order = orders.find((o) => o.id === id) ?? null;
    return mockPatch(order, { latencyMs: 400 });
  },
};
