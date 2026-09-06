import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Shopping')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('shopping')
export class ShoppingController {
  constructor(
    private readonly cartService: CartService,
    private readonly wishlistService: WishlistService
  ) {}

  // ─── Cart Endpoints ────────────────────────────────────────────────────────
  @Get('cart')
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(@CurrentUser() user: User) {
    return this.cartService.getCart(user.id);
  }

  @Get('cart/checkout')
  @ApiOperation({ summary: 'Calculate cart totals including tax and delivery' })
  calculateCart(
    @CurrentUser() user: User, 
    @Query('lat') lat?: number, 
    @Query('lng') lng?: number,
    @Query('method') method?: 'DELIVERY' | 'PICKUP'
  ) {
    return this.cartService.calculateTotals(
      user.id,
      lat ? Number(lat) : undefined,
      lng ? Number(lng) : undefined,
      method
    );
  }

  @Post('cart/items')
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(@CurrentUser() user: User, @Body('productId') productId: string, @Body('quantity') quantity: number) {
    return this.cartService.addItem(user.id, productId, quantity);
  }

  @Patch('cart/items/:productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(@CurrentUser() user: User, @Param('productId') productId: string, @Body('quantity') quantity: number) {
    return this.cartService.updateItemQuantity(user.id, productId, quantity);
  }

  @Delete('cart/items/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(@CurrentUser() user: User, @Param('productId') productId: string) {
    return this.cartService.removeItem(user.id, productId);
  }

  @Delete('cart')
  @ApiOperation({ summary: 'Clear cart entirely' })
  clearCart(@CurrentUser() user: User) {
    return this.cartService.clearCart(user.id);
  }

  @Post('cart/coupon')
  @ApiOperation({ summary: 'Apply coupon to cart' })
  applyCoupon(@CurrentUser() user: User, @Body('code') code: string) {
    return this.cartService.applyCoupon(user.id, code);
  }

  // ─── Wishlist Endpoints ────────────────────────────────────────────────────
  @Get('wishlist/shops')
  @ApiOperation({ summary: 'Get favorite shops' })
  getFavoriteShops(@CurrentUser() user: User) {
    return this.wishlistService.getFavoriteShops(user.id);
  }

  @Post('wishlist/shops/:shopId')
  @ApiOperation({ summary: 'Add favorite shop' })
  addFavoriteShop(@CurrentUser() user: User, @Param('shopId') shopId: string) {
    return this.wishlistService.addFavoriteShop(user.id, shopId);
  }

  @Delete('wishlist/shops/:shopId')
  @ApiOperation({ summary: 'Remove favorite shop' })
  removeFavoriteShop(@CurrentUser() user: User, @Param('shopId') shopId: string) {
    return this.wishlistService.removeFavoriteShop(user.id, shopId);
  }

  @Get('wishlist/products')
  @ApiOperation({ summary: 'Get favorite products' })
  getFavoriteProducts(@CurrentUser() user: User) {
    return this.wishlistService.getFavoriteProducts(user.id);
  }

  @Post('wishlist/products/:productId')
  @ApiOperation({ summary: 'Add favorite product' })
  addFavoriteProduct(@CurrentUser() user: User, @Param('productId') productId: string) {
    return this.wishlistService.addFavoriteProduct(user.id, productId);
  }

  @Delete('wishlist/products/:productId')
  @ApiOperation({ summary: 'Remove favorite product' })
  removeFavoriteProduct(@CurrentUser() user: User, @Param('productId') productId: string) {
    return this.wishlistService.removeFavoriteProduct(user.id, productId);
  }
}
