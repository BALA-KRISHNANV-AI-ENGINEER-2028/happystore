import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../common/redis/redis.module';
import { nanoid } from 'nanoid';

export interface SessionData {
  sessionId: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  lastActive: string;
}

@Injectable()
export class TokenService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  // ─── Verification Tokens ──────────────────────────────────────────────────
  async createVerificationToken(userId: string): Promise<string> {
    const token = nanoid(32);
    // Expire in 24 hours
    await this.redis.set(`verify:token:${token}`, userId, 'EX', 60 * 60 * 24);
    return token;
  }

  async verifyEmailToken(token: string): Promise<string | null> {
    const key = `verify:token:${token}`;
    const userId = await this.redis.get(key);
    if (userId) {
      await this.redis.del(key);
    }
    return userId;
  }

  // ─── Reset Password Tokens ────────────────────────────────────────────────
  async createResetToken(userId: string): Promise<string> {
    const token = nanoid(32);
    // Expire in 1 hour
    await this.redis.set(`reset:token:${token}`, userId, 'EX', 60 * 60);
    return token;
  }

  async verifyResetToken(token: string): Promise<string | null> {
    const key = `reset:token:${token}`;
    const userId = await this.redis.get(key);
    if (userId) {
      await this.redis.del(key); // Token is one-time use
    }
    return userId;
  }

  // ─── Session & Device Tracking ────────────────────────────────────────────
  async createSession(userId: string, ip: string, userAgent: string): Promise<string> {
    const sessionId = nanoid(24);
    const sessionKey = `sessions:${userId}`;
    
    const sessionData: SessionData = {
      sessionId,
      ip,
      userAgent,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    // Store in a hash map for easy retrieval/updating
    await this.redis.hset(sessionKey, sessionId, JSON.stringify(sessionData));
    
    // Optionally set an expiry if you want sessions to naturally die, though refresh tokens handle auth.
    // For now, let's keep it indefinitely or until logged out.
    
    return sessionId;
  }

  async updateSessionActivity(userId: string, sessionId: string): Promise<void> {
    const sessionKey = `sessions:${userId}`;
    const dataStr = await this.redis.hget(sessionKey, sessionId);
    if (dataStr) {
      const data: SessionData = JSON.parse(dataStr);
      data.lastActive = new Date().toISOString();
      await this.redis.hset(sessionKey, sessionId, JSON.stringify(data));
    }
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    await this.redis.hdel(`sessions:${userId}`, sessionId);
  }

  async revokeAllSessions(userId: string): Promise<void> {
    await this.redis.del(`sessions:${userId}`);
  }

  async getActiveSessions(userId: string): Promise<SessionData[]> {
    const sessions = await this.redis.hgetall(`sessions:${userId}`);
    return Object.values(sessions).map(s => JSON.parse(s) as SessionData);
  }

  // ─── OAuth CSRF State (Google, etc.) ──────────────────────────────────────
  /** Generates and stores a one-time anti-CSRF state value for an OAuth redirect. Expires in 5 minutes. */
  async createOAuthState(): Promise<string> {
    const state = nanoid(32);
    await this.redis.set(`oauth:state:${state}`, '1', 'EX', 60 * 5);
    return state;
  }

  /** Validates and consumes (one-time use) an OAuth state value. Returns false if missing/expired/already used. */
  async consumeOAuthState(state: string): Promise<boolean> {
    const key = `oauth:state:${state}`;
    const exists = await this.redis.get(key);
    if (!exists) return false;
    await this.redis.del(key);
    return true;
  }

  // ─── OAuth Token Exchange Codes ───────────────────────────────────────────
  /**
   * Stores a short-lived, one-time exchange code for a completed OAuth login result.
   * Used so the backend never puts access/refresh tokens directly in a redirect URL
   * (browser history, server logs, Referer headers). Expires in 60 seconds.
   */
  async createExchangeCode(payload: Record<string, unknown>): Promise<string> {
    const code = nanoid(32);
    await this.redis.set(`oauth:exchange:${code}`, JSON.stringify(payload), 'EX', 60);
    return code;
  }

  /** Validates and consumes (one-time use) an OAuth exchange code, returning its stored payload. */
  async consumeExchangeCode<T = Record<string, unknown>>(code: string): Promise<T | null> {
    const key = `oauth:exchange:${code}`;
    const data = await this.redis.get(key);
    if (!data) return null;
    await this.redis.del(key);
    return JSON.parse(data) as T;
  }
}
