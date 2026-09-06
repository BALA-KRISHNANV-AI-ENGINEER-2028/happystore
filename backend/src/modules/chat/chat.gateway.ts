import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  role?: string;
  fullName?: string;
}

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  // Map of userId -> Set of socketIds (a user can have multiple connections)
  private readonly onlineUsers = new Map<string, Set<string>>();

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    this.logger.log('Chat WebSocket Gateway initialized');
  }

  handleConnection(client: AuthenticatedSocket) {
    // In production: verify JWT token from handshake auth
    const userId = client.handshake.auth?.userId || client.handshake.query?.userId as string;
    const role   = client.handshake.auth?.role   || client.handshake.query?.role as string;
    const name   = client.handshake.auth?.name   || 'Anonymous';

    client.userId   = userId;
    client.role     = role;
    client.fullName = name;

    if (userId) {
      if (!this.onlineUsers.has(userId)) {
        this.onlineUsers.set(userId, new Set());
      }
      this.onlineUsers.get(userId)!.add(client.id);

      // Notify others that this user is online
      client.broadcast.emit('user:online', { userId });
    }

    this.logger.log(`Client connected: ${client.id} (userId: ${userId})`);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.userId;
    if (userId) {
      const sockets = this.onlineUsers.get(userId);
      sockets?.delete(client.id);
      if (sockets?.size === 0) {
        this.onlineUsers.delete(userId);
        // Notify others that this user is offline
        this.server.emit('user:offline', { userId });
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /** Join a specific conversation room */
  @SubscribeMessage('conversation:join')
  handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string }
  ) {
    client.join(`conv:${data.conversationId}`);
    this.logger.log(`Client ${client.id} joined conversation ${data.conversationId}`);
    return { event: 'conversation:joined', data: { conversationId: data.conversationId } };
  }

  /** Leave a conversation room */
  @SubscribeMessage('conversation:leave')
  handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string }
  ) {
    client.leave(`conv:${data.conversationId}`);
    return { event: 'conversation:left', data: { conversationId: data.conversationId } };
  }

  /** Send a message in a conversation */
  @SubscribeMessage('message:send')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: {
      conversationId: string;
      text: string;
      fromShop: boolean;
    }
  ) {
    if (!client.userId || !data.text?.trim()) return;

    try {
      const message = await this.chatService.saveMessage({
        conversationId: data.conversationId,
        senderId: client.userId,
        fromShop: data.fromShop,
        text: data.text.trim(),
      });

      const payload = {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        senderName: client.fullName,
        fromShop: message.fromShop,
        text: message.text,
        createdAt: message.createdAt,
        read: false,
      };

      // Broadcast to everyone in the conversation room (including sender)
      this.server.to(`conv:${data.conversationId}`).emit('message:new', payload);

      return { event: 'message:sent', data: payload };
    } catch (err) {
      this.logger.error('Failed to save message', err);
      return { event: 'message:error', data: { error: 'Failed to send message' } };
    }
  }

  /** Typing indicator — emitted when user starts typing */
  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string }
  ) {
    client.to(`conv:${data.conversationId}`).emit('typing:start', {
      userId: client.userId,
      name: client.fullName,
      conversationId: data.conversationId,
    });
  }

  /** Typing indicator — emitted when user stops typing */
  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string }
  ) {
    client.to(`conv:${data.conversationId}`).emit('typing:stop', {
      userId: client.userId,
      conversationId: data.conversationId,
    });
  }

  /** Mark messages as read */
  @SubscribeMessage('message:read')
  handleMessageRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string }
  ) {
    client.to(`conv:${data.conversationId}`).emit('message:read', {
      conversationId: data.conversationId,
      readByUserId: client.userId,
      readAt: new Date().toISOString(),
    });
  }

  /** Check online status of specific users */
  @SubscribeMessage('user:status')
  handleUserStatus(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { userIds: string[] }
  ) {
    const statuses = data.userIds.reduce((acc, uid) => {
      acc[uid] = this.onlineUsers.has(uid) ? 'online' : 'offline';
      return acc;
    }, {} as Record<string, string>);

    return { event: 'user:statuses', data: statuses };
  }

  /** Push a message programmatically from another service (e.g. notifications) */
  sendToUser(userId: string, event: string, payload: any) {
    const sockets = this.onlineUsers.get(userId);
    if (sockets) {
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit(event, payload);
      });
    }
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }
}
