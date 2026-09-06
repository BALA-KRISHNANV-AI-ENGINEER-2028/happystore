// =============================================================================
// Happy Store — useSearch Hook (TanStack Query)
// =============================================================================

import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/services/searchService";
import { QUERY_KEYS } from "@/constants";

export function useSearch(query: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SEARCH(query),
    queryFn: async () => {
      const res = await searchService.search(query);
      return res.data;
    },
    enabled: query.length >= 2,
  });
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ["search-suggestions", query],
    queryFn: async () => {
      const res = await searchService.getSearchSuggestions(query);
      return res.data;
    },
    enabled: query.length >= 2,
  });
}
