import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationTone } from '@prisma/client';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationsGateway.name);

  // Map of userId -> Set of socketIds
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(private readonly notificationsService: NotificationsService) {}

  afterInit(server: Server) {
    this.logger.log('Notifications WebSocket Gateway initialized');
  }

  handleConnection(client: AuthenticatedSocket) {
    const userId = client.handshake.auth?.userId || client.handshake.query?.userId as string;
    client.userId = userId;

    if (userId) {
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      // Join a user-specific room for targeted notification delivery
      client.join(`user:${userId}`);
      this.logger.log(`User ${userId} connected to notifications (socketId: ${client.id})`);

      // Deliver unread count on connect
      this.notificationsService.getUnreadCount(userId).then((count) => {
        client.emit('notifications:unread_count', { count });
      });
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const sockets = this.userSockets.get(client.userId);
      sockets?.delete(client.id);
      if (sockets?.size === 0) {
        this.userSockets.delete(client.userId);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /** Mark a notification as read via WebSocket */
  @SubscribeMessage('notification:read')
  async handleMarkRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { notificationId: string }
  ) {
    if (!client.userId) return;
    await this.notificationsService.markAsRead(client.userId, data.notificationId);
    const count = await this.notificationsService.getUnreadCount(client.userId);
    client.emit('notifications:unread_count', { count });
    return { event: 'notification:read_ack', data: { notificationId: data.notificationId } };
  }

  /** Mark all notifications as read */
  @SubscribeMessage('notifications:read_all')
  async handleReadAll(@ConnectedSocket() client: AuthenticatedSocket) {
    if (!client.userId) return;
    await this.notificationsService.markAllAsRead(client.userId);
    client.emit('notifications:unread_count', { count: 0 });
    return { event: 'notifications:all_read' };
  }

  /**
   * Push a real-time notification to a specific user.
   * Called by other services (OrdersService, ChatService etc.).
   */
  async pushToUser(userId: string, notification: {
    title: string;
    description: string;
    tone?: NotificationTone;
  }) {
    // Persist to DB
    const saved = await this.notificationsService.createNotification({
      userId,
      title: notification.title,
      description: notification.description,
      tone: notification.tone,
    });

    // Emit via WebSocket to all the user's connected sockets
    this.server.to(`user:${userId}`).emit('notification:new', saved);

    // Update unread count for the user
    const count = await this.notificationsService.getUnreadCount(userId);
    this.server.to(`user:${userId}`).emit('notifications:unread_count', { count });

    return saved;
  }

  /** Broadcast a notification to multiple users (e.g. promotions) */
  async broadcast(userIds: string[], title: string, description: string, tone = NotificationTone.INFO) {
    await this.notificationsService.broadcastNotification(userIds, title, description, tone);
    userIds.forEach((userId) => {
      this.server.to(`user:${userId}`).emit('notification:new', { title, description, tone });
    });
  }
}
