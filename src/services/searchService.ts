// =============================================================================
// Happy Store — Search Service
// =============================================================================

import { mockGet } from "./apiClient";
import type { ApiResponse, SearchResult, SearchSuggestion } from "@/types";
import { mockProducts } from "@/lib/mock-products";
import { mockShops } from "@/lib/mock-shops";

export const searchService = {
  async search(query: string): Promise<ApiResponse<SearchResult>> {
    const q = query.toLowerCase();
    const shops = mockShops
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q),
      )
      .slice(0, 6);
    const products = mockProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.shopName.toLowerCase().includes(q),
      )
      .slice(0, 12);
    return mockGet({ shops, products } as SearchResult, { latencyMs: 250 });
  },

  async getSearchSuggestions(query: string): Promise<ApiResponse<SearchSuggestion[]>> {
    if (query.length < 2) return mockGet([], { latencyMs: 50 });
    const q = query.toLowerCase();
    const shopSuggestions: SearchSuggestion[] = mockShops
      .filter((s) => s.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((s) => ({ type: "shop", label: s.name, id: s.id }));
    const productSuggestions: SearchSuggestion[] = mockProducts
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((p) => ({ type: "product", label: p.name, id: p.id }));
    return mockGet([...shopSuggestions, ...productSuggestions], { latencyMs: 100 });
  },
};
