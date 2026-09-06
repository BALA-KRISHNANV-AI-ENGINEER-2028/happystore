import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../common/redis/redis.module';

export interface UserAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface NotificationSettings {
  emailPromotions: boolean;
  orderUpdates: boolean;
  smsAlerts: boolean;
}

export interface UserConfig {
  addresses: UserAddress[];
  preferences: UserPreferences;
  notifications: NotificationSettings;
}

const DEFAULT_CONFIG: UserConfig = {
  addresses: [],
  preferences: { theme: 'system', language: 'en' },
  notifications: { emailPromotions: false, orderUpdates: true, smsAlerts: false },
};

@Injectable()
export class UserConfigService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async getConfig(userId: string): Promise<UserConfig> {
    const data = await this.redis.get(`user_config:${userId}`);
    if (!data) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  }

  async saveConfig(userId: string, config: Partial<UserConfig>): Promise<UserConfig> {
    const current = await this.getConfig(userId);
    const updated = { ...current, ...config };
    await this.redis.set(`user_config:${userId}`, JSON.stringify(updated));
    return updated;
  }

  async addAddress(userId: string, address: Omit<UserAddress, 'id'>): Promise<UserConfig> {
    const config = await this.getConfig(userId);
    const newAddress: UserAddress = {
      ...address,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    if (newAddress.isDefault) {
      config.addresses.forEach(a => a.isDefault = false);
    } else if (config.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    config.addresses.push(newAddress);
    return this.saveConfig(userId, { addresses: config.addresses });
  }

  async updateAddress(userId: string, addressId: string, addressUpdate: Partial<UserAddress>): Promise<UserConfig> {
    const config = await this.getConfig(userId);
    const index = config.addresses.findIndex(a => a.id === addressId);
    if (index === -1) throw new Error('Address not found');

    if (addressUpdate.isDefault) {
      config.addresses.forEach(a => a.isDefault = false);
    }

    config.addresses[index] = { ...config.addresses[index], ...addressUpdate };
    return this.saveConfig(userId, { addresses: config.addresses });
  }

  async deleteAddress(userId: string, addressId: string): Promise<UserConfig> {
    const config = await this.getConfig(userId);
    config.addresses = config.addresses.filter(a => a.id !== addressId);
    if (config.addresses.length > 0 && !config.addresses.some(a => a.isDefault)) {
      config.addresses[0].isDefault = true;
    }
    return this.saveConfig(userId, { addresses: config.addresses });
  }
}
