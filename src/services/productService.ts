// =============================================================================
// Happy Store — Product Service
// =============================================================================

import { mockGet } from "./apiClient";
import type { ApiResponse, PaginatedResponse, Product } from "@/types";
import { mockProducts } from "@/lib/mock-products";

export const productService = {
  async getProducts(filters?: {
    shopId?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const { shopId, category, page = 1, pageSize = 12 } = filters ?? {};
    let items = mockProducts as unknown as Product[];
    if (shopId) items = items.filter((p) => p.shopId === shopId);
    if (category) items = items.filter((p) => p.category === category);
    const total = items.length;
    const paged = items.slice((page - 1) * pageSize, page * pageSize);
    return mockGet({
      items: paged,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  },

  async getProductById(id: string): Promise<ApiResponse<Product | null>> {
    const product = (mockProducts as unknown as Product[]).find((p) => p.id === id) ?? null;
    return mockGet(product);
  },

  async getRelatedProducts(
    productId: string,
    limit = 4,
  ): Promise<ApiResponse<Product[]>> {
    const product = (mockProducts as unknown as Product[]).find((p) => p.id === productId);
    if (!product) return mockGet([]);
    const related = (mockProducts as unknown as Product[])
      .filter((p) => p.category === product.category && p.id !== productId)
      .slice(0, limit);
    return mockGet(related);
  },

  async searchProducts(
    query: string,
    page = 1,
    pageSize = 12,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const q = query.toLowerCase();
    const filtered = (mockProducts as unknown as Product[]).filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.shopName.toLowerCase().includes(q),
    );
    const total = filtered.length;
    const items = filtered.slice((page - 1) * pageSize, page * pageSize);
    return mockGet({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  },
};
