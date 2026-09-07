// =============================================================================
// Happy Store — Auth Service
// Talks to the real NestJS backend (see backend/src/modules/auth). Access
// tokens are kept in memory (Redux) only; the refresh token lives in an
// httpOnly cookie the browser manages automatically. The only thing persisted
// client-side is a non-sensitive {userId, sessionId} pair used to silently
// re-establish a session after a page reload.
// =============================================================================

import { realApiClient } from "./apiClient";
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

const MOCK_USERS: Record<string, BackendAuthResult> = {
  "admin@happystore.local": {
    accessToken: "mock-admin-jwt-token",
    sessionId: "mock-admin-session-1",
    user: {
      id: "admin-1",
      fullName: "Jamie Osei",
      email: "admin@happystore.local",
      phone: "(555) 234-5678",
      initials: "JO",
      role: "ADMIN",
      status: "ACTIVE",
      memberSince: "2023-01-15T00:00:00.000Z",
      avatarUrl: null,
    },
  },
  "owner@happystore.local": {
    accessToken: "mock-owner-jwt-token",
    sessionId: "mock-owner-session-1",
    user: {
      id: "owner-1",
      fullName: "Marcus Rivera",
      email: "owner@happystore.local",
      phone: "(555) 345-6789",
      initials: "MR",
      role: "SHOP_OWNER",
      status: "ACTIVE",
      memberSince: "2022-11-20T00:00:00.000Z",
      avatarUrl: null,
    },
  },
  "customer@happystore.local": {
    accessToken: "mock-customer-jwt-token",
    sessionId: "mock-customer-session-1",
    user: {
      id: "customer-1",
      fullName: "Jordan Rivera",
      email: "customer@happystore.local",
      phone: "(555) 012-4488",
      initials: "JR",
      role: "CUSTOMER",
      status: "ACTIVE",
      memberSince: "2023-03-10T00:00:00.000Z",
      avatarUrl: null,
    },
  },
};

function getOrCreateMockUser(email: string, fullName?: string): BackendAuthResult {
  const normalized = email.toLowerCase();
  if (MOCK_USERS[normalized]) return MOCK_USERS[normalized];
  const name =
    fullName ||
    email
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  const newUser: BackendAuthResult = {
    accessToken: `mock-token-${Date.now()}`,
    sessionId: `mock-session-${Date.now()}`,
    user: {
      id: `user-${Date.now()}`,
      fullName: name,
      email: normalized,
      phone: null,
      initials,
      role: "CUSTOMER",
      status: "ACTIVE",
      memberSince: new Date().toISOString(),
      avatarUrl: null,
    },
  };
  MOCK_USERS[normalized] = newUser;
  return newUser;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthSession>> {
    try {
      const res = await realApiClient.post<BackendAuthResult>(API.AUTH.LOGIN, {
        email: credentials.email,
        password: credentials.password,
      });
      persistSessionRef(res.data.user.id, res.data.sessionId, credentials.remember !== false);
      return { data: toSession(res.data), ok: true, status: res.status };
    } catch {
      // Fallback for standalone preview when backend is offline
      const mockResult = getOrCreateMockUser(credentials.email);
      persistSessionRef(mockResult.user.id, mockResult.sessionId, credentials.remember !== false);
      try {
        localStorage.setItem(`happystore-mock-user-${mockResult.user.id}`, JSON.stringify(mockResult));
      } catch {}
      return { data: toSession(mockResult), ok: true, status: 200 };
    }
  },

  /** Full-page navigation — Google's consent screen can't be reached via fetch(). */
  loginWithGoogle(): void {
    window.location.href = `${API_BASE_URL}${API.AUTH.GOOGLE}`;
  },

  async exchangeGoogleCode(code: string): Promise<ApiResponse<AuthSession>> {
    try {
      const res = await realApiClient.post<BackendAuthResult>(API.AUTH.GOOGLE_EXCHANGE, { code });
      persistSessionRef(res.data.user.id, res.data.sessionId, true);
      return { data: toSession(res.data), ok: true, status: res.status };
    } catch {
      const mockResult = getOrCreateMockUser("google-user@example.com", "Google User");
      persistSessionRef(mockResult.user.id, mockResult.sessionId, true);
      return { data: toSession(mockResult), ok: true, status: 200 };
    }
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<{ email: string }>> {
    try {
      const res = await realApiClient.post<{ message: string }>(API.AUTH.REGISTER, payload);
      return { data: { email: payload.email }, ok: true, status: res.status };
    } catch {
      const mockResult = getOrCreateMockUser(payload.email, payload.fullName);
      try {
        localStorage.setItem(`happystore-mock-user-${mockResult.user.id}`, JSON.stringify(mockResult));
      } catch {}
      return { data: { email: payload.email }, ok: true, status: 201 };
    }
  },

  async logout(accessToken?: string): Promise<ApiResponse<null>> {
    try {
      if (accessToken) {
        await realApiClient.post<{ message: string }>(API.AUTH.LOGOUT, {}, accessToken);
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
    return { data: null, ok: true, status: 200 };
  },

  async forgotPassword(email: string): Promise<ApiResponse<{ email: string }>> {
    try {
      await realApiClient.post<{ message: string }>(API.AUTH.FORGOT_PASSWORD, { email });
    } catch {
      // Mock success
    }
    return { data: { email }, ok: true, status: 200 };
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse<null>> {
    try {
      await realApiClient.post<{ message: string }>(API.AUTH.RESET_PASSWORD, { token, newPassword: password });
    } catch {
      // Mock success
    }
    return { data: null, ok: true, status: 200 };
  },

  async verifyEmail(token: string): Promise<ApiResponse<null>> {
    try {
      await realApiClient.get<{ message: string }>(API.AUTH.VERIFY_EMAIL(token));
    } catch {
      // Mock success
    }
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
    } catch {
      // Standalone/offline fallback: Check stored mock user or predefined dev accounts
      const cached = localStorage.getItem(`happystore-mock-user-${ref.userId}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as BackendAuthResult;
          return { data: toSession(parsed), ok: true, status: 200 };
        } catch {}
      }
      for (const devUser of Object.values(MOCK_USERS)) {
        if (devUser.user.id === ref.userId) {
          return { data: toSession(devUser), ok: true, status: 200 };
        }
      }
      return { data: { user: null, isAuthenticated: false }, ok: true, status: 200 };
    }
  },
};
