// =============================================================================
// Happy Store — Cart Service
// Thin wrapper around the in-memory/localStorage cart.
// In Phase 3 this calls the real cart API instead.
// =============================================================================

import { mockGet, mockPost, mockPatch, mockDelete } from "./apiClient";
import type { ApiResponse, Cart, CartItem } from "@/types";
import { STORAGE_KEYS } from "@/constants";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
}

function buildCart(items: CartItem[]): Cart {
  return {
    items,
    totalItems: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
  };
}

export const cartService = {
  async getCart(): Promise<ApiResponse<Cart>> {
    return mockGet(buildCart(readCart()), { latencyMs: 50 });
  },

  async addItem(
    item: Omit<CartItem, "quantity">,
    quantity = 1,
  ): Promise<ApiResponse<Cart>> {
    const items = readCart();
    const existing = items.find((i) => i.productId === item.productId);
    let updated: CartItem[];
    if (existing) {
      updated = items.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: i.quantity + quantity }
          : i,
      );
    } else {
      updated = [...items, { ...item, quantity }];
    }
    writeCart(updated);
    return mockPost(buildCart(updated), { latencyMs: 200 });
  },

  async updateQuantity(
    productId: string,
    quantity: number,
  ): Promise<ApiResponse<Cart>> {
    const items = readCart();
    const updated =
      quantity <= 0
        ? items.filter((i) => i.productId !== productId)
        : items.map((i) => (i.productId === productId ? { ...i, quantity } : i));
    writeCart(updated);
    return mockPatch(buildCart(updated), { latencyMs: 200 });
  },

  async removeItem(productId: string): Promise<ApiResponse<Cart>> {
    const updated = readCart().filter((i) => i.productId !== productId);
    writeCart(updated);
    return mockPatch(buildCart(updated), { latencyMs: 200 });
  },

  async clearCart(): Promise<ApiResponse<null>> {
    writeCart([]);
    return mockDelete({ latencyMs: 100 });
  },
};
