import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../common/redis/redis.module';

export interface ShopSettings {
  deliveryRadiusKm: number;
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
  bannerUrl: string;
  images: string[];
  socialLinks: Record<string, string>;
  isVerified: boolean;
}

const DEFAULT_SETTINGS: ShopSettings = {
  deliveryRadiusKm: 5,
  pickupAvailable: true,
  deliveryAvailable: true,
  bannerUrl: '',
  images: [],
  socialLinks: {},
  isVerified: false,
};

@Injectable()
export class ShopConfigService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async getSettings(shopId: string): Promise<ShopSettings> {
    const data = await this.redis.get(`shop_settings:${shopId}`);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  }

  async saveSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ShopSettings> {
    const current = await this.getSettings(shopId);
    const updated = { ...current, ...settings };
    await this.redis.set(`shop_settings:${shopId}`, JSON.stringify(updated));
    return updated;
  }
}
