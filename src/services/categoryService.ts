// =============================================================================
// Happy Store — Category Service
// =============================================================================

import { mockGet } from "./apiClient";
import type { ApiResponse, Category } from "@/types";
import { categoryList } from "@/lib/mock-products";

export const categoryService = {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return mockGet(categoryList as unknown as Category[]);
  },

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category | null>> {
    const category = (categoryList as unknown as Category[]).find((c) => c.slug === slug) ?? null;
    return mockGet(category);
  },
};
