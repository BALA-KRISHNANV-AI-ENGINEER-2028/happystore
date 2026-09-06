// =============================================================================
// Happy Store — useCategories Hook (TanStack Query)
// =============================================================================

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/categoryService";
import { QUERY_KEYS } from "@/constants";

export function useCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      const res = await categoryService.getCategories();
      return res.data;
    },
  });
}
