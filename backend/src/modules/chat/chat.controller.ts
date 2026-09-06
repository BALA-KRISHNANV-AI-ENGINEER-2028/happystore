import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations for the current user' })
  getConversations(
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getConversations(
      user.id,
      user.role,
      { page: page ? Number(page) : 1, limit: limit ? Number(limit) : 20 }
    );
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Start or get a conversation with a shop' })
  getOrCreateConversation(
    @CurrentUser() user: User,
    @Body('shopId') shopId: string,
  ) {
    return this.chatService.getOrCreateConversation(user.id, shopId);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation by ID with messages' })
  getConversation(@Param('id') id: string) {
    return this.chatService.getConversationById(id);
  }
}
