import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ProductConfigService } from './product-config.service';
import { ShopsModule } from '../shops/shops.module';

@Module({
  imports: [ShopsModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, ProductConfigService],
  exports: [ProductsService, ProductConfigService],
})
export class ProductsModule {}
