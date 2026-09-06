import { Controller, Get, Patch, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for the current user' })
  getNotifications(
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.notificationsService.getUserNotifications(
      user.id,
      { page: page ? Number(page) : 1, limit: limit ? Number(limit) : 20 },
      unreadOnly === 'true'
    );
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  getUnreadCount(@CurrentUser() user: User) {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@CurrentUser() user: User, @Param('id') id: string) {
    return this.notificationsService.markAsRead(user.id, id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@CurrentUser() user: User) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  deleteNotification(@CurrentUser() user: User, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(user.id, id);
  }
}
