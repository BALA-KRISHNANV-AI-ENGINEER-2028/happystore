// =============================================================================
// Happy Store — Cart Slice
// Provides Redux-based cart state. The existing CartProvider context remains
// functional — this slice is available for components that prefer Redux.
// =============================================================================

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "@/types";
import { STORAGE_KEYS } from "@/constants";

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function computeState(items: CartItem[]): CartState {
  return {
    items,
    totalItems: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
  };
}

function persist(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
}

const initialState: CartState = computeState(readStoredCart());

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{ item: Omit<CartItem, "quantity">; quantity?: number }>,
    ) {
      const { item, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }
      const updated = computeState(state.items);
      state.totalItems = updated.totalItems;
      state.subtotal = updated.subtotal;
      persist(state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      const updated = computeState(state.items);
      state.totalItems = updated.totalItems;
      state.subtotal = updated.subtotal;
      persist(state.items);
    },
    updateCartQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.productId !== productId);
      } else {
        const item = state.items.find((i) => i.productId === productId);
        if (item) item.quantity = quantity;
      }
      const updated = computeState(state.items);
      state.totalItems = updated.totalItems;
      state.subtotal = updated.subtotal;
      persist(state.items);
    },
    clearCart(state) {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;
      persist([]);
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;
