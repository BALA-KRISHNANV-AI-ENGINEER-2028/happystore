import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../common/redis/redis.module';
import { ProductsService } from '../products/products.service';
import { ShopsService } from '../shops/shops.service';
import { UserConfigService } from '../users/user-config.service';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartData {
  items: CartItem[];
  couponCode?: string;
}

export interface CartCalculationResult {
  items: (CartItem & { name: string; price: number; itemTotal: number })[];
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  platformFee: number;
  total: number;
  shopId?: string; // Carts in this app are likely per-shop, or we enforce one shop per cart
}

@Injectable()
export class CartService {
  private readonly TAX_RATE = 0.08; // 8% tax
  private readonly DELIVERY_BASE_FEE = 3.0;
  private readonly DELIVERY_FEE_PER_KM = 1.5;

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly productsService: ProductsService,
    private readonly shopsService: ShopsService,
    private readonly userConfigService: UserConfigService
  ) {}

  async getCart(userId: string): Promise<CartData> {
    const data = await this.redis.get(`cart:${userId}`);
    if (!data) return { items: [] };
    return JSON.parse(data);
  }

  async saveCart(userId: string, cart: CartData): Promise<CartData> {
    await this.redis.set(`cart:${userId}`, JSON.stringify(cart), 'EX', 60 * 60 * 24 * 7); // 7 days
    return cart;
  }

  async addItem(userId: string, productId: string, quantity: number): Promise<CartData> {
    if (quantity <= 0) throw new BadRequestException('Quantity must be greater than 0');
    
    // Ensure product exists
    const product = await this.productsService.findOne(productId);

    const cart = await this.getCart(userId);
    
    // Enforce single shop per cart (common for food/delivery apps)
    if (cart.items.length > 0) {
      const existingProduct = await this.productsService.findOne(cart.items[0].productId);
      if (existingProduct.shopId !== product.shopId) {
         throw new BadRequestException('Cart can only contain items from one shop at a time. Please clear your cart first.');
      }
    }

    const existingItem = cart.items.find(i => i.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    return this.saveCart(userId, cart);
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<CartData> {
    if (quantity <= 0) return this.removeItem(userId, productId);
    
    const cart = await this.getCart(userId);
    const item = cart.items.find(i => i.productId === productId);
    if (!item) throw new NotFoundException('Item not in cart');
    
    item.quantity = quantity;
    return this.saveCart(userId, cart);
  }

  async removeItem(userId: string, productId: string): Promise<CartData> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter(i => i.productId !== productId);
    return this.saveCart(userId, cart);
  }

  async clearCart(userId: string): Promise<void> {
    await this.redis.del(`cart:${userId}`);
  }

  async applyCoupon(userId: string, code: string): Promise<CartData> {
    // Very simple mock coupon system
    if (!['WELCOME10', 'FREEDELIVERY'].includes(code)) {
      throw new BadRequestException('Invalid coupon code');
    }
    const cart = await this.getCart(userId);
    cart.couponCode = code;
    return this.saveCart(userId, cart);
  }

  private readonly PLATFORM_FEE = 0.99;

  async calculateTotals(
    userId: string,
    userLat?: number,
    userLng?: number,
    method: 'DELIVERY' | 'PICKUP' = 'DELIVERY'
  ): Promise<CartCalculationResult> {
    const cart = await this.getCart(userId);
    if (cart.items.length === 0) {
      return { items: [], subtotal: 0, discount: 0, tax: 0, deliveryFee: 0, platformFee: 0, total: 0 };
    }

    let subtotal = 0;
    let shopId: string | undefined;

    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const p = await this.productsService.findOne(item.productId);
        shopId = p.shopId; // Should be the same for all items
        const itemTotal = p.price * item.quantity;
        subtotal += itemTotal;
        return {
          ...item,
          name: p.name,
          price: p.price,
          itemTotal,
        };
      })
    );

    let discount = 0;
    let deliveryFee = 0;

    if (method === 'DELIVERY') {
      if (shopId && userLat && userLng) {
        const shop = await this.shopsService.findOne(shopId);
        // Rough Haversine distance using existing JS util, or we can use PostGIS directly.
        // We'll calculate it simply for pricing.
        const distKm = await this.getDistance(userLat, userLng, shop.latitude, shop.longitude);
        deliveryFee = this.DELIVERY_BASE_FEE + (distKm * this.DELIVERY_FEE_PER_KM);
      } else {
        // Default delivery fee if location not provided yet
        deliveryFee = this.DELIVERY_BASE_FEE;
      }
    }

    if (cart.couponCode === 'WELCOME10') {
      discount = subtotal * 0.1;
    } else if (cart.couponCode === 'FREEDELIVERY') {
      discount = deliveryFee; // Delivery fee becomes free
    }

    const platformFee = this.PLATFORM_FEE;
    const tax = (subtotal - discount) * this.TAX_RATE;
    const total = subtotal - discount + tax + deliveryFee + platformFee;

    return {
      items: populatedItems,
      subtotal,
      discount,
      tax,
      deliveryFee,
      platformFee,
      total,
      shopId,
    };
  }

  private async getDistance(lat1: number, lon1: number, lat2: number, lon2: number): Promise<number> {
    // Existing haversine util from common/utils/pagination.util.ts can be used here
    // But redefining a simple version to avoid circular deps for now
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
