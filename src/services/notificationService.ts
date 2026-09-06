// =============================================================================
// Happy Store — Notification Service
// =============================================================================

import { mockGet, mockPatch } from "./apiClient";
import type { ApiResponse, Notification } from "@/types";

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Your order is on the way", description: "Corner Market · arriving in 12 minutes", time: "2 min ago", tone: "accent", read: false },
  { id: "n2", title: "Order delivered", description: "Green Leaf Pharmacy", time: "3 days ago", tone: "success", read: true },
  { id: "n3", title: "New offer nearby", description: "15% off at Rivera Bakery this week", time: "1 week ago", tone: "info", read: true },
];

let notifications = [...MOCK_NOTIFICATIONS];

export const notificationService = {
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return mockGet(notifications, { latencyMs: 150 });
  },

  async markAsRead(id: string): Promise<ApiResponse<null>> {
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    return mockPatch(null, { latencyMs: 100 });
  },

  async markAllRead(): Promise<ApiResponse<null>> {
    notifications = notifications.map((n) => ({ ...n, read: true }));
    return mockPatch(null, { latencyMs: 150 });
  },
};
