import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { ShopsRepository } from './shops.repository';
import { ShopConfigService } from './shop-config.service';

@Module({
  controllers: [ShopsController],
  providers: [ShopsService, ShopsRepository, ShopConfigService],
  exports: [ShopsService, ShopConfigService],
})
export class ShopsModule {}
