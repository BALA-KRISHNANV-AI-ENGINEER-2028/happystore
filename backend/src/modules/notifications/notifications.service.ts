import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { NotificationTone } from '@prisma/client';
import { paginate, buildPaginatedResult, PaginationParams } from '../../common/utils/pagination.util';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserNotifications(userId: string, params: PaginationParams, unreadOnly?: boolean) {
    const { skip, take } = paginate(params);
    const where = {
      userId,
      ...(unreadOnly && { read: false }),
    };

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return buildPaginatedResult(notifications, total, params);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { userId, read: false } });
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async createNotification(data: {
    userId: string;
    title: string;
    description: string;
    tone?: NotificationTone;
  }) {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        tone: data.tone || NotificationTone.INFO,
      },
    });
  }

  /** Create notifications for multiple users at once (bulk broadcast) */
  async broadcastNotification(userIds: string[], title: string, description: string, tone = NotificationTone.INFO) {
    return this.prisma.notification.createMany({
      data: userIds.map((userId) => ({ userId, title, description, tone })),
    });
  }

  async deleteNotification(userId: string, notificationId: string) {
    return this.prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });
  }
}
