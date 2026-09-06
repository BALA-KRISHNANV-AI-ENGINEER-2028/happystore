import { Module } from '@nestjs/common';
import { ShoppingController } from './shopping.controller';
import { CartService } from './cart.service';
import { WishlistService } from './wishlist.service';
import { ProductsModule } from '../products/products.module';
import { ShopsModule } from '../shops/shops.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ProductsModule, ShopsModule, UsersModule],
  controllers: [ShoppingController],
  providers: [CartService, WishlistService],
  exports: [CartService, WishlistService]
})
export class ShoppingModule {}
