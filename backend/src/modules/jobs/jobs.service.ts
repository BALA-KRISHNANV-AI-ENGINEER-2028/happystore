import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../common/redis/redis.module';

export type JobType =
  | 'send_email'
  | 'send_notification'
  | 'process_order'
  | 'refresh_cache'
  | 'aggregate_analytics';

export interface Job<T = any> {
  id: string;
  type: JobType;
  payload: T;
  createdAt: string;
  attempts?: number;
  maxAttempts?: number;
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  private readonly QUEUE_PREFIX = 'jobs:queue:';
  private readonly MAX_ATTEMPTS = 3;

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  /** Enqueue a job into a Redis list */
  async enqueue<T>(type: JobType, payload: T): Promise<string> {
    const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const job: Job<T> = {
      id,
      type,
      payload,
      createdAt: new Date().toISOString(),
      attempts: 0,
      maxAttempts: this.MAX_ATTEMPTS,
    };
    const queueKey = `${this.QUEUE_PREFIX}${type}`;
    await this.redis.rpush(queueKey, JSON.stringify(job));
    this.logger.log(`Enqueued job [${type}] id=${id}`);
    return id;
  }

  /** Dequeue the next job from a specific queue */
  async dequeue<T>(type: JobType): Promise<Job<T> | null> {
    const queueKey = `${this.QUEUE_PREFIX}${type}`;
    const raw = await this.redis.lpop(queueKey);
    if (!raw) return null;
    return JSON.parse(raw) as Job<T>;
  }

  /** Get current queue depth (pending jobs count) */
  async queueDepth(type: JobType): Promise<number> {
    const queueKey = `${this.QUEUE_PREFIX}${type}`;
    return this.redis.llen(queueKey);
  }

  /** Enqueue an email job */
  async enqueueEmail(to: string, subject: string, html: string): Promise<string> {
    return this.enqueue('send_email', { to, subject, html });
  }

  /** Enqueue a notification job */
  async enqueueNotification(userId: string, title: string, description: string, tone = 'INFO'): Promise<string> {
    return this.enqueue('send_notification', { userId, title, description, tone });
  }

  /** Enqueue a cache refresh job */
  async enqueueCacheRefresh(keys: string[]): Promise<string> {
    return this.enqueue('refresh_cache', { keys });
  }

  /** Enqueue analytics aggregation job */
  async enqueueAnalyticsAggregation(shopId: string): Promise<string> {
    return this.enqueue('aggregate_analytics', { shopId });
  }

  /** Get stats across all queues */
  async getQueueStats(): Promise<Record<JobType, number>> {
    const types: JobType[] = [
      'send_email',
      'send_notification',
      'process_order',
      'refresh_cache',
      'aggregate_analytics',
    ];

    const depths = await Promise.all(types.map((type) => this.queueDepth(type)));

    return types.reduce((acc, type, i) => {
      acc[type] = depths[i];
      return acc;
    }, {} as Record<JobType, number>);
  }
}
