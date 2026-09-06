// =============================================================================
// Happy Store — useWishlist Hook (TanStack Query)
// =============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/services/wishlistService";
import { QUERY_KEYS } from "@/constants";

export function useWishlist() {
  return useQuery({
    queryKey: [QUERY_KEYS.WISHLIST],
    queryFn: async () => {
      const res = await wishlistService.getWishlist();
      return res.data;
    },
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await wishlistService.addToWishlist(productId);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      await wishlistService.removeFromWishlist(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
    },
  });
}
