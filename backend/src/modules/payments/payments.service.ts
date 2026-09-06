import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { TransactionType } from '@prisma/client';
import { IPaymentProvider } from './providers/payment-provider.interface';
import { CodProvider } from './providers/cod.provider';
import { StripeProvider } from './providers/stripe.provider';
import { RazorpayProvider } from './providers/razorpay.provider';

@Injectable()
export class PaymentsService {
  private readonly providers: Map<string, IPaymentProvider> = new Map();

  constructor(private readonly prisma: PrismaService) {
    // Register the three payment providers
    const cod = new CodProvider();
    const stripe = new StripeProvider();
    const razorpay = new RazorpayProvider();

    this.providers.set(cod.name, cod);
    this.providers.set(stripe.name, stripe);
    this.providers.set(razorpay.name, razorpay);
  }

  async processPayment(orderId: string, providerName: string, amount: number): Promise<any> {
    const normalizedProvider = this.normalizeProviderName(providerName);
    const provider = this.providers.get(normalizedProvider);
    if (!provider) {
      throw new BadRequestException(`Unsupported payment provider: ${providerName}`);
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { shop: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const result = await provider.processPayment(orderId, amount);

    if (result.success) {
      // Create transaction record for the shop
      await this.prisma.transaction.create({
        data: {
          shopId: order.shopId,
          description: `Order #${orderId} payment via ${providerName}`,
          type: TransactionType.SALE,
          amount: amount,
        },
      });

      // Update order status if paid online
      if (normalizedProvider !== 'CASH_ON_DELIVERY') {
        // For online payment, transition order status to ACCEPTED
        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: 'ACCEPTED' },
        });
      }
    }

    return result;
  }

  async processRefund(orderId: string, providerName: string, amount: number): Promise<any> {
    const normalizedProvider = this.normalizeProviderName(providerName);
    const provider = this.providers.get(normalizedProvider);
    if (!provider) {
      throw new BadRequestException(`Unsupported payment provider: ${providerName}`);
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // A mock refund lookup for Stripe/Razorpay
    const transactionId = `MOCK-TX-${orderId}`;
    const result = await provider.processRefund(transactionId, amount);

    if (result.success) {
      // Create refund transaction (negative amount)
      await this.prisma.transaction.create({
        data: {
          shopId: order.shopId,
          description: `Refund for Order #${orderId} via ${providerName}`,
          type: TransactionType.REFUND,
          amount: -amount,
        },
      });

      // Update order status to CANCELLED/REFUNDED
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });
    }

    return result;
  }

  async getPaymentHistory(shopId: string) {
    return this.prisma.transaction.findMany({
      where: { shopId },
      orderBy: { date: 'desc' },
    });
  }

  private normalizeProviderName(providerName: string): string {
    const upper = providerName.toUpperCase();
    if (upper === 'COD') {
      return 'CASH_ON_DELIVERY';
    }

    return upper;
  }
}
