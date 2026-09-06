import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, User, OrderStatus } from '@prisma/client';
import { Response } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List orders (filtered by role)' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: OrderStatus,
    @Query('shopId') shopId?: string,
    @CurrentUser() user?: User,
  ) {
    const customerId = user?.role === Role.CUSTOMER ? user.id : undefined;
    const ownerShopId = user?.role === Role.SHOP_OWNER ? shopId : undefined;
    return this.ordersService.findAll({ page, limit, status, shopId: ownerShopId, customerId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get order status transition timeline' })
  getTimeline(@Param('id') id: string) {
    return this.ordersService.getTimeline(id);
  }

  @Get(':id/invoice')
  @ApiOperation({ summary: 'Get HTML invoice for order' })
  async getInvoice(@Param('id') id: string, @Res() res: Response) {
    const html = await this.ordersService.getInvoice(id);
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }

  @Post()
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Place a new order' })
  create(@Body() body: CreateOrderDto, @CurrentUser() user: User) {
    return this.ordersService.create({ ...body, customerId: user.id });
  }

  @Patch(':id/status')
  @Roles(Role.SHOP_OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, body.status, body.description);
  }
}
