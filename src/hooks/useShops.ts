// =============================================================================
// Happy Store — useShops Hook (TanStack Query)
// =============================================================================

import { useQuery } from "@tanstack/react-query";
import { shopService } from "@/services/shopService";
import { QUERY_KEYS } from "@/constants";

export function useShops() {
  return useQuery({
    queryKey: [QUERY_KEYS.SHOPS],
    queryFn: async () => {
      const res = await shopService.getShops();
      return res.data;
    },
  });
}

export function useShopById(shopId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.SHOP(shopId ?? ""),
    queryFn: async () => {
      if (!shopId) return null;
      const res = await shopService.getShopById(shopId);
      return res.data;
    },
    enabled: !!shopId,
  });
}

export function useNearbyShops(maxMiles = 5) {
  return useQuery({
    queryKey: [QUERY_KEYS.NEARBY_SHOPS, maxMiles],
    queryFn: async () => {
      const res = await shopService.getNearbyShops(maxMiles);
      return res.data;
    },
  });
}
