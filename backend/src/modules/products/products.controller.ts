import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductConfigService } from './product-config.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, Public } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, User } from '@prisma/client';
import { ShopsService } from '../shops/shops.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ProductConfigService,
    private readonly shopsService: ShopsService
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all products' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('categorySlug') categorySlug?: string,
    @Query('shopId') shopId?: string,
    @Query('inStock') inStock?: string,
  ) {
    return this.productsService.findAll({ page, limit, search, categorySlug, shopId, inStock: inStock === 'true' });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Public()
  @Get(':id/config')
  @ApiOperation({ summary: 'Get product configuration (Redis)' })
  getConfig(@Param('id') id: string) {
    return this.configService.getConfig(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/config')
  @Roles(Role.SHOP_OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product configuration (Redis)' })
  async updateConfig(@Param('id') id: string, @Body() body: Record<string, unknown>, @CurrentUser() user: User) {
    const product = await this.productsService.findOne(id);
    const shop = await this.shopsService.findOne(product.shopId);
    if (user.role !== Role.ADMIN && shop.ownerId !== user.id) {
      throw new ForbiddenException('You can only update your own products');
    }
    return this.configService.saveConfig(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/inventory/stock-adjustment')
  @Roles(Role.SHOP_OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adjust stock quantity (Redis)' })
  async adjustStock(@Param('id') id: string, @Body('amount') amount: number, @CurrentUser() user: User) {
    const product = await this.productsService.findOne(id);
    const shop = await this.shopsService.findOne(product.shopId);
    if (user.role !== Role.ADMIN && shop.ownerId !== user.id) {
      throw new ForbiddenException('You can only update your own products');
    }
    if (amount > 0) return this.configService.incrementStock(id, amount);
    if (amount < 0) return this.configService.decrementStock(id, Math.abs(amount));
    return this.configService.getConfig(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.SHOP_OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product' })
  async create(@Body() body: Record<string, unknown>, @CurrentUser() user: User) {
    const shopId = body.shopId as string;
    const shop = await this.shopsService.findOne(shopId);
    if (user.role !== Role.ADMIN && shop.ownerId !== user.id) {
       throw new ForbiddenException('You can only add products to your own shop');
    }
    return this.productsService.create(body as never);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.SHOP_OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  async update(@Param('id') id: string, @Body() body: Record<string, unknown>, @CurrentUser() user: User) {
    const product = await this.productsService.findOne(id);
    const shop = await this.shopsService.findOne(product.shopId);
    if (user.role !== Role.ADMIN && shop.ownerId !== user.id) {
      throw new ForbiddenException('You can only update your own products');
    }
    return this.productsService.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.SHOP_OWNER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    const product = await this.productsService.findOne(id);
    const shop = await this.shopsService.findOne(product.shopId);
    if (user.role !== Role.ADMIN && shop.ownerId !== user.id) {
      throw new ForbiddenException('You can only delete your own products');
    }
    return this.productsService.remove(id);
  }
}
