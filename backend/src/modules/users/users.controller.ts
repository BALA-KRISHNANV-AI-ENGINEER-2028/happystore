import { Controller, Get, Param, Delete, Query, UseGuards, Patch, Body, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserConfigService } from './user-config.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, User } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: UserConfigService
  ) {}

  @Get('config')
  @ApiOperation({ summary: 'Get current user configuration (Redis)' })
  getConfig(@CurrentUser() user: User) {
    return this.configService.getConfig(user.id);
  }

  @Patch('config')
  @ApiOperation({ summary: 'Update current user configuration (Redis)' })
  updateConfig(@CurrentUser() user: User, @Body() body: Record<string, unknown>) {
    return this.configService.saveConfig(user.id, body);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Add a new address' })
  addAddress(@CurrentUser() user: User, @Body() body: any) {
    return this.configService.addAddress(user.id, body);
  }

  @Patch('addresses/:addressId')
  @ApiOperation({ summary: 'Update an address' })
  updateAddress(@CurrentUser() user: User, @Param('addressId') addressId: string, @Body() body: any) {
    return this.configService.updateAddress(user.id, addressId, body);
  }

  @Delete('addresses/:addressId')
  @ApiOperation({ summary: 'Delete an address' })
  deleteAddress(@CurrentUser() user: User, @Param('addressId') addressId: string) {
    return this.configService.deleteAddress(user.id, addressId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List all users (Admin only)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.usersService.findAll({ page, limit, search, sortBy, sortOrder });
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update user (Admin only)' })
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
