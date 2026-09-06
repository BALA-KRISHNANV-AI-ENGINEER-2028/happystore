// =============================================================================
// Happy Store — User Preferences Slice
// =============================================================================

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/constants";

interface UserPreferencesState {
  defaultAddressId: string | null;
  preferredPaymentMethodId: string | null;
  orderUpdates: boolean;
  deliveryAlerts: boolean;
  specialOffers: boolean;
  newShopsNearby: boolean;
  weeklyNewsletter: boolean;
}

function readPreferences(): UserPreferencesState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (raw) return JSON.parse(raw) as UserPreferencesState;
  } catch {
    // ignore
  }
  return {
    defaultAddressId: "home",
    preferredPaymentMethodId: "visa-4242",
    orderUpdates: true,
    deliveryAlerts: true,
    specialOffers: true,
    newShopsNearby: false,
    weeklyNewsletter: false,
  };
}

const initialState = readPreferences();

function persist(state: UserPreferencesState) {
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(state));
}

const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    setDefaultAddress(state, action: PayloadAction<string>) {
      state.defaultAddressId = action.payload;
      persist(state);
    },
    setPreferredPayment(state, action: PayloadAction<string>) {
      state.preferredPaymentMethodId = action.payload;
      persist(state);
    },
    updateNotificationPref(
      state,
      action: PayloadAction<{ key: keyof Omit<UserPreferencesState, "defaultAddressId" | "preferredPaymentMethodId">; value: boolean }>,
    ) {
      (state[action.payload.key] as boolean) = action.payload.value;
      persist(state);
    },
  },
});

export const { setDefaultAddress, setPreferredPayment, updateNotificationPref } =
  userPreferencesSlice.actions;
export const userPreferencesReducer = userPreferencesSlice.reducer;
