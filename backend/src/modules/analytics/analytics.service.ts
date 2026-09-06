import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../common/redis/redis.module';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  /** Dashboard summary for a shop owner */
  async getShopDashboard(shopId: string) {
    const cacheKey = `analytics:dashboard:${shopId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Run all queries in parallel
    const [
      todaysOrders,
      totalOrderCount,
      revenueResult,
      lowStockProducts,
      recentReviews,
      topProducts,
    ] = await Promise.all([
      // Today's orders
      this.prisma.order.findMany({
        where: { shopId, placedAt: { gte: today, lte: todayEnd } },
        include: { lineItems: true, customer: { select: { fullName: true, initials: true } } },
        orderBy: { placedAt: 'desc' },
      }),
      // Total order count
      this.prisma.order.count({ where: { shopId } }),
      // Revenue aggregate
      this.prisma.order.aggregate({
        where: { shopId, status: { in: ['DELIVERED'] } },
        _sum: { total: true },
      }),
      // Low stock products (outOfStock)
      this.prisma.product.findMany({
        where: { shopId, outOfStock: true },
        select: { id: true, name: true, price: true },
        take: 10,
      }),
      // Recent reviews for the shop
      this.prisma.review.findMany({
        where: { shopId },
        orderBy: { date: 'desc' },
        take: 5,
        select: { id: true, authorName: true, rating: true, comment: true, date: true },
      }),
      // Top selling products (by quantity in delivered orders)
      this.getTopSellingProducts(shopId),
    ]);

    // Sales series — last 7 days
    const salesSeries = await this.getRevenueSeriesLast7Days(shopId);

    const result = {
      todaysOrderCount: todaysOrders.length,
      todaysRevenue: todaysOrders.reduce((sum, o) => sum + o.total, 0),
      totalRevenue: revenueResult._sum.total ?? 0,
      totalOrders: totalOrderCount,
      pendingOrders: todaysOrders.filter((o) => o.status === 'PENDING').length,
      activeOrders: todaysOrders.filter((o) =>
        ['ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(o.status)
      ).length,
      recentOrders: todaysOrders.slice(0, 5),
      lowStockProducts,
      recentReviews,
      topProducts,
      salesSeries,
    };

    // Cache for 5 minutes
    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 300);

    return result;
  }

  /** Revenue series for the last 7 days */
  private async getRevenueSeriesLast7Days(shopId: string) {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayOrders = await this.prisma.order.findMany({
        where: { shopId, placedAt: { gte: date, lte: dayEnd } },
        select: { total: true },
      });

      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toISOString().split('T')[0],
        orders: dayOrders.length,
        revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      });
    }
    return days;
  }

  /** Top selling products by units sold (in completed orders) */
  private async getTopSellingProducts(shopId: string) {
    const lineItems = await this.prisma.orderLineItem.findMany({
      where: { order: { shopId, status: 'DELIVERED' } },
      select: { productId: true, name: true, quantity: true },
    });

    const aggregated: Record<string, { name: string; productId: string; unitsSold: number }> = {};
    lineItems.forEach((item) => {
      if (!aggregated[item.productId]) {
        aggregated[item.productId] = { productId: item.productId, name: item.name, unitsSold: 0 };
      }
      aggregated[item.productId].unitsSold += item.quantity;
    });

    return Object.values(aggregated)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);
  }

  /** Admin platform-level analytics */
  async getPlatformStats() {
    const cacheKey = 'analytics:platform';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [totalUsers, totalShops, totalOrders, platformRevenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.shop.count({ where: { status: 'APPROVED' } }),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { status: 'DELIVERED' },
        _sum: { total: true },
      }),
    ]);

    const result = {
      totalUsers,
      totalShops,
      totalOrders,
      platformRevenue: platformRevenue._sum.total ?? 0,
    };

    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 600);

    return result;
  }

  /** Invalidate dashboard cache for a shop (call after order status update) */
  async invalidateDashboardCache(shopId: string) {
    await this.redis.del(`analytics:dashboard:${shopId}`);
  }
}
