import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../common/redis/redis.module';

export interface ProductVariant {
  id: string;
  name: string;
  priceDelta: number;
  stock: number;
}

export interface ProductConfig {
  images: string[];
  tags: string[];
  variants: ProductVariant[];
  stockQuantity: number;
  lowStockAlert: number;
  discountPercentage: number;
}

const DEFAULT_CONFIG: ProductConfig = {
  images: [],
  tags: [],
  variants: [],
  stockQuantity: 100, // Default mock stock
  lowStockAlert: 10,
  discountPercentage: 0,
};

@Injectable()
export class ProductConfigService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async getConfig(productId: string): Promise<ProductConfig> {
    const data = await this.redis.get(`product_config:${productId}`);
    if (!data) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  }

  async saveConfig(productId: string, config: Partial<ProductConfig>): Promise<ProductConfig> {
    const current = await this.getConfig(productId);
    const updated = { ...current, ...config };
    await this.redis.set(`product_config:${productId}`, JSON.stringify(updated));
    return updated;
  }

  async decrementStock(productId: string, amount: number = 1): Promise<ProductConfig> {
    const config = await this.getConfig(productId);
    config.stockQuantity = Math.max(0, config.stockQuantity - amount);
    return this.saveConfig(productId, { stockQuantity: config.stockQuantity });
  }

  async incrementStock(productId: string, amount: number = 1): Promise<ProductConfig> {
    const config = await this.getConfig(productId);
    config.stockQuantity += amount;
    return this.saveConfig(productId, { stockQuantity: config.stockQuantity });
  }
}
