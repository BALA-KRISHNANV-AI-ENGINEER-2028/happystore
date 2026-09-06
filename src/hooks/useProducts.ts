// =============================================================================
// Happy Store — useProducts Hook (TanStack Query)
// =============================================================================

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import { QUERY_KEYS } from "@/constants";

export function useProducts(filters?: {
  shopId?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, filters],
    queryFn: async () => {
      const res = await productService.getProducts(filters);
      return res.data;
    },
  });
}

export function useProductById(productId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT(productId ?? ""),
    queryFn: async () => {
      if (!productId) return null;
      const res = await productService.getProductById(productId);
      return res.data;
    },
    enabled: !!productId,
  });
}

export function useRelatedProducts(productId: string | undefined, limit = 4) {
  return useQuery({
    queryKey: QUERY_KEYS.RELATED_PRODUCTS(productId ?? ""),
    queryFn: async () => {
      if (!productId) return [];
      const res = await productService.getRelatedProducts(productId, limit);
      return res.data;
    },
    enabled: !!productId,
  });
}
