// =============================================================================
// Happy Store — useNotifications Hook (TanStack Query)
// =============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { QUERY_KEYS } from "@/constants";

export function useNotificationsQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS],
    queryFn: async () => {
      const res = await notificationService.getNotifications();
      return res.data;
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await notificationService.markAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await notificationService.markAllRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}
