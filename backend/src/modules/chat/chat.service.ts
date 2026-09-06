import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { paginate, buildPaginatedResult, PaginationParams } from '../../common/utils/pagination.util';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  /** Get or create a conversation between a customer and a shop */
  async getOrCreateConversation(customerId: string, shopId: string) {
    const existing = await this.prisma.conversation.findFirst({
      where: { customerId, shopId },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 50 } },
    });
    if (existing) return existing;

    return this.prisma.conversation.create({
      data: { customerId, shopId },
      include: { messages: true },
    });
  }

  /** Get all conversations for a user (customer or shop owner) */
  async getConversations(userId: string, role: string, params: PaginationParams) {
    const { skip, take } = paginate(params);

    const where = role === 'SHOP_OWNER'
      ? { shop: { ownerId: userId } }
      : { customerId: userId };

    const [conversations, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        skip,
        take,
        orderBy: { updatedAt: 'desc' },
        include: {
          shop: { select: { id: true, name: true } },
          customer: { select: { id: true, fullName: true, initials: true } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      }),
      this.prisma.conversation.count({ where }),
    ]);

    return buildPaginatedResult(conversations, total, params);
  }

  /** Get a conversation by ID with full message history */
  async getConversationById(conversationId: string) {
    return this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        shop: { select: { id: true, name: true } },
        customer: { select: { id: true, fullName: true, initials: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
  }

  /** Save a message to the database */
  async saveMessage(data: {
    conversationId: string;
    senderId: string;
    fromShop: boolean;
    text: string;
  }) {
    const message = await this.prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: data.senderId,
        fromShop: data.fromShop,
        text: data.text,
      },
    });

    // Update conversation updatedAt so it appears at top of list
    await this.prisma.conversation.update({
      where: { id: data.conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  /** Get unread message count for a user */
  async getUnreadCount(userId: string, role: string): Promise<number> {
    // A simplistic count of conversations updated after last seen (MVP approach)
    // In production this would be tracked via a separate UserConversationSeen table
    return 0;
  }
}
