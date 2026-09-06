// =============================================================================
// Happy Store — Auth Service
// Talks to the real NestJS backend (see backend/src/modules/auth). Access
// tokens are kept in memory (Redux) only; the refresh token lives in an
// httpOnly cookie the browser manages automatically. The only thing persisted
// client-side is a non-sensitive {userId, sessionId} pair used to silently
// re-establish a session after a page reload.
// =============================================================================

import { realApiClient, ApiError } from "./apiClient";
import { API, API_BASE_URL } from "@/constants/api";
import type { ApiResponse, AuthSession, LoginCredentials, RegisterPayload, User, UserRole, UserStatus } from "@/types";
import { STORAGE_KEYS } from "@/constants";

// ---------------------------------------------------------------------------
// Backend DTO shapes (see backend/src/modules/auth)
// ---------------------------------------------------------------------------

interface BackendUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  initials: string;
  role: "CUSTOMER" | "SHOP_OWNER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  memberSince: string; // ISO date
  avatarUrl?: string | null;
}

interface BackendAuthResult {
  accessToken: string;
  sessionId?: string;
  user: BackendUser;
}

/** Non-sensitive correlators persisted in localStorage to silently refresh a session on reload. */
interface StoredSessionRef {
  userId: string;
  sessionId?: string;
}

function mapRole(role: BackendUser["role"]): UserRole {
  return role.toLowerCase() as UserRole;
}

function mapStatus(status: BackendUser["status"]): UserStatus {
  return status.toLowerCase() as UserStatus;
}

function formatMemberSince(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function mapUser(u: BackendUser): User {
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone ?? undefined,
    initials: u.initials,
    role: mapRole(u.role),
    status: mapStatus(u.status),
    memberSince: formatMemberSince(u.memberSince),
    avatarUrl: u.avatarUrl ?? undefined,
  };
}

function persistSessionRef(userId: string, sessionId: string | undefined, remember: boolean) {
  if (!remember) {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    return;
  }
  const ref: StoredSessionRef = { userId, sessionId };
  localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(ref));
}

function toSession(result: BackendAuthResult): AuthSession {
  return {
    user: mapUser(result.user),
    isAuthenticated: true,
    token: result.accessToken,
    sessionId: result.sessionId,
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthSession>> {
    const res = await realApiClient.post<BackendAuthResult>(API.AUTH.LOGIN, {
      email: credentials.email,
      password: credentials.password,
    });
    persistSessionRef(res.data.user.id, res.data.sessionId, credentials.remember !== false);
    return { data: toSession(res.data), ok: true, status: res.status };
  },

  /** Full-page navigation — Google's consent screen can't be reached via fetch(). */
  loginWithGoogle(): void {
    window.location.href = `${API_BASE_URL}${API.AUTH.GOOGLE}`;
  },

  async exchangeGoogleCode(code: string): Promise<ApiResponse<AuthSession>> {
    const res = await realApiClient.post<BackendAuthResult>(API.AUTH.GOOGLE_EXCHANGE, { code });
    persistSessionRef(res.data.user.id, res.data.sessionId, true);
    return { data: toSession(res.data), ok: true, status: res.status };
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<{ email: string }>> {
    const res = await realApiClient.post<{ message: string }>(API.AUTH.REGISTER, payload);
    return { data: { email: payload.email }, ok: true, status: res.status };
  },

  async logout(accessToken?: string): Promise<ApiResponse<null>> {
    try {
      if (accessToken) {
        await realApiClient.post<{ message: string }>(API.AUTH.LOGOUT, {}, accessToken);
      }
    } catch {
      // Even if the server call fails (expired token, offline, etc.), still
      // clear the local session — the user's intent to log out always wins.
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
    return { data: null, ok: true, status: 200 };
  },

  async forgotPassword(email: string): Promise<ApiResponse<{ email: string }>> {
    await realApiClient.post<{ message: string }>(API.AUTH.FORGOT_PASSWORD, { email });
    return { data: { email }, ok: true, status: 200 };
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse<null>> {
    await realApiClient.post<{ message: string }>(API.AUTH.RESET_PASSWORD, { token, newPassword: password });
    return { data: null, ok: true, status: 200 };
  },

  async verifyEmail(token: string): Promise<ApiResponse<null>> {
    await realApiClient.get<{ message: string }>(API.AUTH.VERIFY_EMAIL(token));
    return { data: null, ok: true, status: 200 };
  },

  /**
   * Called once on app boot. Attempts a silent refresh using the non-sensitive
   * {userId, sessionId} left over from a previous login, relying on the
   * browser to attach the httpOnly refresh-token cookie automatically.
   */
  async getSession(): Promise<ApiResponse<AuthSession>> {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (!raw) {
      return { data: { user: null, isAuthenticated: false }, ok: true, status: 200 };
    }

    let ref: StoredSessionRef;
    try {
      ref = JSON.parse(raw) as StoredSessionRef;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      return { data: { user: null, isAuthenticated: false }, ok: true, status: 200 };
    }

    if (!ref?.userId) {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      return { data: { user: null, isAuthenticated: false }, ok: true, status: 200 };
    }

    try {
      const refreshRes = await realApiClient.post<BackendAuthResult>(API.AUTH.REFRESH, {
        userId: ref.userId,
        sessionId: ref.sessionId,
      });
      const session = toSession(refreshRes.data);
      persistSessionRef(refreshRes.data.user.id, refreshRes.data.sessionId, true);
      return { data: session, ok: true, status: 200 };
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        // Backend unreachable (offline, server down) — don't destroy a
        // session the user might still legitimately have; just report
        // signed-out for this load and let them retry.
        return { data: { user: null, isAuthenticated: false }, ok: true, status: 200 };
      }
      // Expired/invalid refresh token — the session really is over.
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      return { data: { user: null, isAuthenticated: false }, ok: true, status: 200 };
    }
  },
};
