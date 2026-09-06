import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../common/redis/redis.module';
import { OrderStatus } from '@prisma/client';

export interface TimelineEntry {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

@Injectable()
export class OrderTimelineService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private getTimelineKey(orderId: string): string {
    return `order:timeline:${orderId}`;
  }

  async addTimelineEntry(orderId: string, status: OrderStatus, description?: string): Promise<void> {
    const key = this.getTimelineKey(orderId);
    const entry: TimelineEntry = {
      status,
      timestamp: new Date().toISOString(),
      description: description || this.getDefaultDescription(status),
    };
    
    // Append to Redis list, and set 7 days TTL (same as cart)
    await this.redis.rpush(key, JSON.stringify(entry));
    await this.redis.expire(key, 60 * 60 * 24 * 7);
  }

  async getTimeline(orderId: string): Promise<TimelineEntry[]> {
    const key = this.getTimelineKey(orderId);
    const rawList = await this.redis.lrange(key, 0, -1);
    
    if (rawList.length === 0) {
      // Return a default initial entry based on standard lifecycle
      return [
        {
          status: OrderStatus.PENDING,
          timestamp: new Date().toISOString(),
          description: this.getDefaultDescription(OrderStatus.PENDING),
        }
      ];
    }

    return rawList.map((raw) => JSON.parse(raw) as TimelineEntry);
  }

  async clearTimeline(orderId: string): Promise<void> {
    const key = this.getTimelineKey(orderId);
    await this.redis.del(key);
  }

  private getDefaultDescription(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Your order has been placed and is waiting for shop acceptance.';
      case OrderStatus.ACCEPTED:
        return 'The shop has accepted your order and will start preparing it soon.';
      case OrderStatus.PREPARING:
        return 'The shop is preparing your order.';
      case OrderStatus.READY:
        return 'Your order is ready for pickup or delivery dispatch.';
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'The courier is delivering your order to your address.';
      case OrderStatus.DELIVERED:
        return 'Your order has been successfully delivered. Enjoy!';
      case OrderStatus.CANCELLED:
        return 'Your order has been cancelled.';
      case OrderStatus.REFUNDED:
        return 'Your payment has been refunded.';
      default:
        return 'Order status updated.';
    }
  }
}
