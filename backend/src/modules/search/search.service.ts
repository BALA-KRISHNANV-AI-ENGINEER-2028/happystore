import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../common/redis/redis.module';
import { buildPaginatedResult } from '../../common/utils/pagination.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis
  ) {}

  async searchShops(
    query: string,
    lat?: number,
    lng?: number,
    radiusKm: number = 10,
    page = 1,
    limit = 20,
    openNow = false,
    category?: string,
    sortBy: 'distance' | 'rating' | 'name' = 'rating',
  ) {
    const skip = (page - 1) * limit;

    let shops: any[] = [];
    let total = 0;

    if (lat && lng) {
      // PostGIS spatial query with open-now, category, and sort support
      const radiusMeters = radiusKm * 1000;
      const orderClause = sortBy === 'distance'
        ? Prisma.sql`ORDER BY distance ASC`
        : sortBy === 'name'
        ? Prisma.sql`ORDER BY name ASC`
        : Prisma.sql`ORDER BY rating DESC`;

      const rawShops = await this.prisma.$queryRaw<any[]>`
        SELECT *,
               ST_Distance(location::geography, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography) AS distance
        FROM "Shop"
        WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography, ${radiusMeters})
          AND status = 'APPROVED'
          ${openNow ? Prisma.sql`AND open = true` : Prisma.empty}
          ${category ? Prisma.sql`AND category = ${category}` : Prisma.empty}
          ${query ? Prisma.sql`AND name ILIKE ${'%' + query + '%'}` : Prisma.empty}
        ${orderClause}
        LIMIT ${limit} OFFSET ${skip}
      `;

      const countRes = await this.prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) as count FROM "Shop"
        WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography, ${radiusMeters})
          AND status = 'APPROVED'
          ${openNow ? Prisma.sql`AND open = true` : Prisma.empty}
          ${category ? Prisma.sql`AND category = ${category}` : Prisma.empty}
          ${query ? Prisma.sql`AND name ILIKE ${'%' + query + '%'}` : Prisma.empty}
      `;

      shops = rawShops;
      total = Number(countRes[0]?.count ?? 0);
    } else {
      // Standard text search without geolocation
      const whereClause: Prisma.ShopWhereInput = {
        status: 'APPROVED',
        ...(openNow && { open: true }),
        ...(category && { category }),
        ...(query && { name: { contains: query, mode: 'insensitive' } }),
      };

      const orderBy: Prisma.ShopOrderByWithRelationInput =
        sortBy === 'name' ? { name: 'asc' } : { rating: 'desc' };

      const [count, data] = await Promise.all([
        this.prisma.shop.count({ where: whereClause }),
        this.prisma.shop.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy,
        }),
      ]);
      shops = data;
      total = count;
    }

    return buildPaginatedResult(shops, total, { page, limit });
  }

  async searchProducts(
    query: string,
    category?: string,
    shopId?: string,
    page = 1,
    limit = 20,
    minPrice?: number,
    maxPrice?: number,
    sortBy: 'price_asc' | 'price_desc' | 'rating' = 'rating',
  ) {
    const cacheKey = `search:products:${query}:${category}:${shopId}:${minPrice}:${maxPrice}:${sortBy}:${page}:${limit}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const skip = (page - 1) * limit;

    const whereClause: Prisma.ProductWhereInput = {
      ...(query && {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      }),
      ...(category && { categorySlug: category }),
      ...(shopId && { shopId }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sortBy === 'price_asc'
        ? { price: 'asc' }
        : sortBy === 'price_desc'
        ? { price: 'desc' }
        : { rating: 'desc' };

    const [total, data] = await Promise.all([
      this.prisma.product.count({ where: whereClause }),
      this.prisma.product.findMany({
        where: whereClause,
        include: { shop: { select: { name: true } } },
        skip,
        take: limit,
        orderBy,
      }),
    ]);

    const result = buildPaginatedResult(data, total, { page, limit });
    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 300);

    return result;
  }

  async getAutocomplete(query: string) {
    if (!query || query.length < 2) return { shops: [], products: [] };

    const cacheKey = `autocomplete:${query.toLowerCase()}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [shops, products] = await Promise.all([
      this.prisma.shop.findMany({
        where: { name: { contains: query, mode: 'insensitive' }, status: 'APPROVED' },
        take: 5,
        select: { id: true, name: true, category: true },
      }),
      this.prisma.product.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        take: 7,
        select: { id: true, name: true, categorySlug: true },
      }),
    ]);

    const result = { shops, products };
    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);

    return result;
  }

  /** Track a user's search query in Redis sorted set for popularity + user history */
  async trackSearch(userId: string, query: string): Promise<void> {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed || trimmed.length < 2) return;

    const userKey = `recent:${userId}`;
    const globalKey = 'popular:searches';
    const timestamp = Date.now();

    // User recent: sorted set keyed by timestamp; keep last 20
    await this.redis.zadd(userKey, timestamp, trimmed);
    const count = await this.redis.zcard(userKey);
    if (count > 20) {
      await this.redis.zremrangebyrank(userKey, 0, count - 21);
    }
    await this.redis.expire(userKey, 60 * 60 * 24 * 30); // 30 days

    // Global popular: sorted set with score = hit count
    await this.redis.zincrby(globalKey, 1, trimmed);
  }

  /** Get recent searches for a user (most recent first) */
  async getRecentSearches(userId: string): Promise<string[]> {
    const key = `recent:${userId}`;
    return this.redis.zrevrange(key, 0, 9); // last 10
  }

  /** Clear user's recent search history */
  async clearRecentSearches(userId: string): Promise<void> {
    await this.redis.del(`recent:${userId}`);
  }

  /** Get global top popular search terms */
  async getPopularSearches(limit = 10): Promise<string[]> {
    return this.redis.zrevrange('popular:searches', 0, limit - 1);
  }
}
