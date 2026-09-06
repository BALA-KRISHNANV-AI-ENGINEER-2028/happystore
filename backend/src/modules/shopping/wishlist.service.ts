import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../common/redis/redis.module';

const RECENTLY_VIEWED_MAX = 20;
const TTL_30_DAYS = 60 * 60 * 24 * 30;

@Injectable()
export class WishlistService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  // ─── Favorite Shops ─────────────────────────────────────────────────────────

  async getFavoriteShops(userId: string): Promise<string[]> {
    return this.redis.smembers(`favorites:shops:${userId}`);
  }

  async addFavoriteShop(userId: string, shopId: string): Promise<void> {
    await this.redis.sadd(`favorites:shops:${userId}`, shopId);
    await this.redis.expire(`favorites:shops:${userId}`, TTL_30_DAYS);
  }

  async removeFavoriteShop(userId: string, shopId: string): Promise<void> {
    await this.redis.srem(`favorites:shops:${userId}`, shopId);
  }

  async isFavoriteShop(userId: string, shopId: string): Promise<boolean> {
    const result = await this.redis.sismember(`favorites:shops:${userId}`, shopId);
    return result === 1;
  }

  // ─── Favorite Products ───────────────────────────────────────────────────────

  async getFavoriteProducts(userId: string): Promise<string[]> {
    return this.redis.smembers(`favorites:products:${userId}`);
  }

  async addFavoriteProduct(userId: string, productId: string): Promise<void> {
    await this.redis.sadd(`favorites:products:${userId}`, productId);
    await this.redis.expire(`favorites:products:${userId}`, TTL_30_DAYS);
  }

  async removeFavoriteProduct(userId: string, productId: string): Promise<void> {
    await this.redis.srem(`favorites:products:${userId}`, productId);
  }

  async isFavoriteProduct(userId: string, productId: string): Promise<boolean> {
    const result = await this.redis.sismember(`favorites:products:${userId}`, productId);
    return result === 1;
  }

  // ─── Recently Viewed ─────────────────────────────────────────────────────────

  async getRecentlyViewedProducts(userId: string): Promise<string[]> {
    // Redis list: most recent first (lpush prepends)
    return this.redis.lrange(`recently_viewed:products:${userId}`, 0, RECENTLY_VIEWED_MAX - 1);
  }

  async trackProductView(userId: string, productId: string): Promise<void> {
    const key = `recently_viewed:products:${userId}`;
    // Remove the item first to avoid duplicates, then prepend
    await this.redis.lrem(key, 0, productId);
    await this.redis.lpush(key, productId);
    // Trim to max size
    await this.redis.ltrim(key, 0, RECENTLY_VIEWED_MAX - 1);
    await this.redis.expire(key, TTL_30_DAYS);
  }

  async getRecentlyViewedShops(userId: string): Promise<string[]> {
    return this.redis.lrange(`recently_viewed:shops:${userId}`, 0, RECENTLY_VIEWED_MAX - 1);
  }

  async trackShopView(userId: string, shopId: string): Promise<void> {
    const key = `recently_viewed:shops:${userId}`;
    await this.redis.lrem(key, 0, shopId);
    await this.redis.lpush(key, shopId);
    await this.redis.ltrim(key, 0, RECENTLY_VIEWED_MAX - 1);
    await this.redis.expire(key, TTL_30_DAYS);
  }

  async clearRecentlyViewed(userId: string): Promise<void> {
    await Promise.all([
      this.redis.del(`recently_viewed:products:${userId}`),
      this.redis.del(`recently_viewed:shops:${userId}`),
    ]);
  }
}
