// =============================================================================
// Happy Store — useOrders Hook (TanStack Query)
// =============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import type { PlaceOrderPayload } from "@/types";
import { QUERY_KEYS } from "@/constants";

export function useOrdersQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS],
    queryFn: async () => {
      const res = await orderService.getOrders();
      return res.data;
    },
  });
}

export function useOrderById(orderId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.ORDER(orderId ?? ""),
    queryFn: async () => {
      if (!orderId) return null;
      const res = await orderService.getOrderById(orderId);
      return res.data;
    },
    enabled: !!orderId,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PlaceOrderPayload) => {
      const res = await orderService.placeOrder(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await orderService.cancelOrder(orderId);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
    },
  });
}
