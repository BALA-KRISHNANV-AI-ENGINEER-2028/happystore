// =============================================================================
// Happy Store — Shop Service
// =============================================================================

import { mockGet } from "./apiClient";
import type { ApiResponse, PaginatedResponse, Shop } from "@/types";
import { mockShops } from "@/lib/mock-shops";

export const shopService = {
  async getShops(): Promise<ApiResponse<Shop[]>> {
    return mockGet(mockShops as unknown as Shop[]);
  },

  async getShopById(id: string): Promise<ApiResponse<Shop | null>> {
    const shop = mockShops.find((s) => s.id === id) ?? null;
    return mockGet(shop as Shop | null);
  },

  async getNearbyShops(maxMiles = 5): Promise<ApiResponse<Shop[]>> {
    const nearby = mockShops.filter((s) => s.distanceMiles <= maxMiles) as unknown as Shop[];
    return mockGet(nearby);
  },

  async searchShops(
    query: string,
    page = 1,
    pageSize = 12,
  ): Promise<ApiResponse<PaginatedResponse<Shop>>> {
    const q = query.toLowerCase();
    const filtered = (mockShops as unknown as Shop[]).filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    );
    const total = filtered.length;
    const items = filtered.slice((page - 1) * pageSize, page * pageSize);
    return mockGet({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  },
};
