// =============================================================================
// Happy Store — Notifications Slice
// =============================================================================

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "@/types";

interface NotificationsState {
  items: Notification[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
};

function countUnread(items: Notification[]): number {
  return items.filter((n) => !n.read).length;
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload;
      state.unreadCount = countUnread(action.payload);
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload);
      state.unreadCount = countUnread(state.items);
    },
    markRead(state, action: PayloadAction<string>) {
      const notif = state.items.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
      state.unreadCount = countUnread(state.items);
    },
    markAllRead(state) {
      state.items.forEach((n) => { n.read = true; });
      state.unreadCount = 0;
    },
  },
});

export const { setNotifications, addNotification, markRead, markAllRead } =
  notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
