import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('shop/:shopId')
  @Roles(Role.SHOP_OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Get shop analytics dashboard data' })
  getShopDashboard(@Param('shopId') shopId: string) {
    return this.analyticsService.getShopDashboard(shopId);
  }

  @Get('platform')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get platform-level analytics (admin only)' })
  getPlatformStats() {
    return this.analyticsService.getPlatformStats();
  }
}
