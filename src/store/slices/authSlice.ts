// =============================================================================
// Happy Store — Auth Slice
// =============================================================================

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthSession, User, UserRole } from "@/types";
import { authService } from "@/services/authService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** True once the initial silent-session check (on app boot) has settled.
   *  Route guards wait for this before redirecting, so a valid session isn't
   *  bounced to /login while the refresh call is still in flight. */
  isInitialized: boolean;
  role: UserRole | null;
  error: string | null;
  /** Short-lived JWT — kept in memory only, never persisted. */
  accessToken: string | null;
  sessionId: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  role: null,
  error: null,
  accessToken: null,
  sessionId: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string; remember?: boolean }) => {
    const res = await authService.login(credentials);
    return res.data;
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload: { fullName: string; email: string; password: string }) => {
    const res = await authService.register(payload);
    return res.data;
  },
);

export const exchangeGoogleCodeThunk = createAsyncThunk(
  "auth/exchangeGoogleCode",
  async (code: string) => {
    const res = await authService.exchangeGoogleCode(code);
    return res.data;
  },
);

export const logoutThunk = createAsyncThunk<void, void, { state: { auth: AuthState } }>(
  "auth/logout",
  async (_arg, { getState }) => {
    const { accessToken } = getState().auth;
    await authService.logout(accessToken ?? undefined);
  },
);

export const initSessionThunk = createAsyncThunk("auth/initSession", async () => {
  const res = await authService.getSession();
  return res.data;
});

function applySession(state: AuthState, session: AuthSession) {
  state.user = session.user;
  state.isAuthenticated = session.isAuthenticated;
  state.role = session.user?.role ?? null;
  state.accessToken = session.token ?? null;
  state.sessionId = session.sessionId ?? null;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.role = action.payload.role;
    },
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.error = null;
      state.accessToken = null;
      state.sessionId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        applySession(state, action.payload);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Login failed";
      })
      .addCase(exchangeGoogleCodeThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exchangeGoogleCodeThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        applySession(state, action.payload);
      })
      .addCase(exchangeGoogleCodeThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Google sign-in failed";
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.role = null;
        state.accessToken = null;
        state.sessionId = null;
      })
      .addCase(initSessionThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initSessionThunk.fulfilled, (state, action) => {
        applySession(state, action.payload);
        state.isLoading = false;
        state.isInitialized = true;
      })
      .addCase(initSessionThunk.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
