import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import { ShopConfigService } from './shop-config.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, Public } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, User, ShopStatus } from '@prisma/client';

@ApiTags('Shops')
@Controller('shops')
export class ShopsController {
  constructor(
    private readonly shopsService: ShopsService,
    private readonly configService: ShopConfigService
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all approved shops' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: ShopStatus,
    @Query('ownerId') ownerId?: string,
  ) {
    return this.shopsService.findAll({ page, limit, search, category, status, ownerId });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get shop by ID' })
  findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  @Public()
  @Get(':id/settings')
  @ApiOperation({ summary: 'Get shop extended settings (Redis)' })
  getSettings(@Param('id') id: string) {
    return this.configService.getSettings(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/settings')
  @Roles(Role.SHOP_OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update shop extended settings (Redis)' })
  async updateSettings(@Param('id') id: string, @Body() body: Record<string, unknown>, @CurrentUser() user: User) {
    const shop = await this.shopsService.findOne(id);
    if (user.role !== Role.ADMIN && shop.ownerId !== user.id) {
      throw new ForbiddenException('You can only update your own shop');
    }
    return this.configService.saveSettings(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.SHOP_OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new shop' })
  create(@Body() body: Record<string, unknown>, @CurrentUser() user: User) {
    return this.shopsService.create({ ...(body as Record<string, unknown>), ownerId: user.id } as never);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.SHOP_OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a shop' })
  update(@Param('id') id: string, @Body() body: Record<string, unknown>, @CurrentUser() user: User) {
    return this.shopsService.update(id, body, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.SHOP_OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a shop' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.shopsService.remove(id, user);
  }
}
