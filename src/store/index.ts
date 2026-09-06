// =============================================================================
// Happy Store — Redux Store
// =============================================================================

import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { authReducer } from "./slices/authSlice";
import { themeReducer } from "./slices/themeSlice";
import { cartReducer } from "./slices/cartSlice";
import { notificationsReducer } from "./slices/notificationsSlice";
import { userPreferencesReducer } from "./slices/userPreferencesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    cart: cartReducer,
    notifications: notificationsReducer,
    userPreferences: userPreferencesReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Pre-typed hooks so components don't need to import RootState everywhere
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
