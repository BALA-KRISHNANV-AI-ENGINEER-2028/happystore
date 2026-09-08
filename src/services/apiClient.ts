// =============================================================================
// Happy Store — Mock API Client
// Simulates a real HTTP client with typed responses, simulated network latency,
// and a consistent error model. In Phase 3, replace the mock implementation
// with real fetch/axios calls — all service signatures remain unchanged.
// =============================================================================

import type { ApiResponse } from "@/types";
import { API_BASE_URL } from "@/constants/api";

// Simulated base latency range (ms)
const MIN_DELAY = 120;
const MAX_DELAY = 380;

function delay(ms?: number): Promise<void> {
  const wait = ms ?? Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY);
  return new Promise((res) => setTimeout(res, wait));
}

/** Mock error class that mirrors what a real API would throw. */
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(
    status: number,
    message: string,
    code?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Wraps data in the standard ApiResponse envelope.
 * Used by mock service implementations.
 */
export async function mockGet<T>(
  data: T,
  options?: { latencyMs?: number; errorRate?: number },
): Promise<ApiResponse<T>> {
  await delay(options?.latencyMs);

  // Simulate occasional errors in development for resilience testing
  if (options?.errorRate && Math.random() < options.errorRate) {
    throw new ApiError(500, "Simulated server error", "SIMULATED_ERROR");
  }

  return { data, ok: true, status: 200 };
}

export async function mockPost<T>(
  data: T,
  options?: { latencyMs?: number },
): Promise<ApiResponse<T>> {
  await delay(options?.latencyMs ?? 600);
  return { data, ok: true, status: 201 };
}

export async function mockPatch<T>(
  data: T,
  options?: { latencyMs?: number },
): Promise<ApiResponse<T>> {
  await delay(options?.latencyMs ?? 500);
  return { data, ok: true, status: 200 };
}

export async function mockDelete(
  options?: { latencyMs?: number },
): Promise<ApiResponse<null>> {
  await delay(options?.latencyMs ?? 300);
  return { data: null, ok: true, status: 204 };
}

/**
 * The apiClient namespace — will be replaced with real HTTP calls in Phase 3.
 * Shape kept stable so service files don't need to change.
 */
export const apiClient = {
  get: mockGet,
  post: mockPost,
  patch: mockPatch,
  delete: mockDelete,
};

// =============================================================================
// Real HTTP client — used by authService for the live NestJS backend.
// Kept separate from the mock helpers above so every other (still-mocked)
// service in this app is unaffected.
// =============================================================================

interface RealRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  accessToken?: string;
}

/** Shape of NestJS's ValidationPipe / HttpException error bodies. */
interface BackendErrorBody {
  message?: string | string[];
  error?: string;
}

async function request<T>(path: string, options: RealRequestOptions = {}): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      // Required so the httpOnly refresh-token cookie is sent/received,
      // including on cross-port localhost dev requests.
      credentials: "include",
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Could not reach the server. Check your connection and try again.", "NETWORK_ERROR");
  }

  // 204 / empty bodies (e.g. logout, clear cart) — nothing to parse.
  const text = await response.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { message: text };
    }
  }

  if (!response.ok) {
    // Error responses come from GlobalExceptionFilter (backend/src/common/filters),
    // NOT the success interceptor below — shape is { statusCode, error, message, path, timestamp }.
    const body = (parsed ?? {}) as BackendErrorBody;
    const message = Array.isArray(body.message) ? body.message.join(", ") : body.message;
    throw new ApiError(response.status, message ?? "Something went wrong. Please try again.", body.error);
  }

  // Every successful backend response is wrapped by a global ResponseInterceptor
  // (backend/src/common/interceptors/response.interceptor.ts) as
  // { success: true, data: <actual payload>, timestamp } — unwrap it here so
  // every caller of realApiClient just works with the real payload shape.
  const unwrapped =
    parsed && typeof parsed === "object" && "success" in parsed && "data" in parsed
      ? (parsed as { data: T }).data
      : (parsed as T);

  return { data: unwrapped, ok: true, status: response.status };
}

export const realApiClient = {
  get: <T>(path: string, accessToken?: string) => request<T>(path, { method: "GET", accessToken }),
  post: <T>(path: string, body?: unknown, accessToken?: string) =>
    request<T>(path, { method: "POST", body, accessToken }),
  patch: <T>(path: string, body?: unknown, accessToken?: string) =>
    request<T>(path, { method: "PATCH", body, accessToken }),
  delete: <T>(path: string, accessToken?: string) => request<T>(path, { method: "DELETE", accessToken }),
};
