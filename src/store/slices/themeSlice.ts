// =============================================================================
// Happy Store — Theme Slice
// Mirrors the existing ThemeProvider state into Redux for consistency.
// The ThemeProvider still controls the DOM class, this slice just tracks state.
// =============================================================================

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/constants";

type ThemePreference = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeState {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
}

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const pref = readStoredPreference();
const initialState: ThemeState = {
  preference: pref,
  resolvedTheme: pref === "system" ? getSystemTheme() : pref,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemePreference(state, action: PayloadAction<ThemePreference>) {
      state.preference = action.payload;
      state.resolvedTheme =
        action.payload === "system" ? getSystemTheme() : action.payload;
      localStorage.setItem(STORAGE_KEYS.THEME, action.payload);
    },
    setResolvedTheme(state, action: PayloadAction<ResolvedTheme>) {
      state.resolvedTheme = action.payload;
    },
    toggleTheme(state) {
      const next = state.resolvedTheme === "dark" ? "light" : "dark";
      state.preference = next;
      state.resolvedTheme = next;
      localStorage.setItem(STORAGE_KEYS.THEME, next);
    },
  },
});

export const { setThemePreference, setResolvedTheme, toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
