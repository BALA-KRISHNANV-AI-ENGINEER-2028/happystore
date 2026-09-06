// =============================================================================
// Happy Store — Wishlist Service
// =============================================================================

import { mockGet, mockPost, mockDelete } from "./apiClient";
import type { ApiResponse, Product } from "@/types";
import { mockProducts } from "@/lib/mock-products";

const WISHLIST_KEY = "happystore-wishlist";

function readWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeWishlist(ids: string[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
}

export const wishlistService = {
  async getWishlist(): Promise<ApiResponse<Product[]>> {
    const ids = readWishlist();
    const items = (mockProducts as unknown as Product[]).filter((p) => ids.includes(p.id));
    return mockGet(items, { latencyMs: 80 });
  },

  async addToWishlist(productId: string): Promise<ApiResponse<string[]>> {
    const ids = readWishlist();
    if (!ids.includes(productId)) {
      ids.push(productId);
      writeWishlist(ids);
    }
    return mockPost(ids, { latencyMs: 200 });
  },

  async removeFromWishlist(productId: string): Promise<ApiResponse<null>> {
    const ids = readWishlist().filter((id) => id !== productId);
    writeWishlist(ids);
    return mockDelete({ latencyMs: 150 });
  },

  isInWishlist(productId: string): boolean {
    return readWishlist().includes(productId);
  },
};
