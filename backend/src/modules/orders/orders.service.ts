import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { OrderMethod, OrderStatus } from '@prisma/client';
import { PaginationParams } from '../../common/utils/pagination.util';
import { OrderTimelineService } from './order-timeline.service';
import { InvoiceService } from './invoice.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly repo: OrdersRepository,
    private readonly timelineService: OrderTimelineService,
    private readonly invoiceService: InvoiceService
  ) {}

  findAll(params: PaginationParams & { customerId?: string; shopId?: string; status?: OrderStatus }) {
    return this.repo.findAll(params);
  }

  async findOne(id: string) {
    const order = await this.repo.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(data: {
    shopId: string;
    customerId: string;
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
    method: OrderMethod;
    address?: string;
    etaMinutes?: number;
    items: Array<{ productId: string; name: string; price: number; quantity: number; unit?: string }>;
  }) {
    if (!data.items.length) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const expectedTotal = Number((data.subtotal + data.deliveryFee + data.tax).toFixed(2));
    const submittedTotal = Number(data.total.toFixed(2));

    if (expectedTotal !== submittedTotal) {
      throw new BadRequestException('Order total does not match subtotal, delivery fee, and tax');
    }

    // Generate unique order ID with HS- prefix and random 5-digit number
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderId = `HS-${randomDigits}`;

    const newOrder = await this.repo.create({
      id: orderId,
      subtotal: data.subtotal,
      deliveryFee: data.deliveryFee,
      tax: data.tax,
      total: data.total,
      status: OrderStatus.PENDING,
      method: data.method,
      address: data.address || null,
      etaMinutes: data.etaMinutes || (data.method === OrderMethod.DELIVERY ? 40 : 15),
      shop: { connect: { id: data.shopId } },
      customer: { connect: { id: data.customerId } },
      lineItems: {
        create: data.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit || null,
        })),
      },
    });

    // Initialize timeline
    await this.timelineService.addTimelineEntry(orderId, OrderStatus.PENDING, 'Order placed successfully.');

    return newOrder;
  }

  async updateStatus(id: string, status: OrderStatus, description?: string) {
    const order = await this.findOne(id);

    // Business Rule: Can only cancel if PENDING or ACCEPTED
    if (status === OrderStatus.CANCELLED) {
      if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.ACCEPTED) {
        throw new BadRequestException('Order preparation has already started and cannot be cancelled.');
      }
    }

    const updatedOrder = await this.repo.updateStatus(id, status);
    await this.timelineService.addTimelineEntry(id, status, description);

    return updatedOrder;
  }

  async getTimeline(orderId: string) {
    await this.findOne(orderId);
    return this.timelineService.getTimeline(orderId);
  }

  async getInvoice(orderId: string) {
    const order = await this.findOne(orderId);
    return this.invoiceService.generateInvoiceHtml({
      orderId: order.id,
      customerName: order.customer.fullName,
      customerEmail: order.customer.email,
      shopName: order.shop.name,
      shopAddress: order.shop.address,
      placedAt: order.placedAt,
      items: order.lineItems,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      tax: order.tax,
      total: order.total,
      paymentMethod: order.method === OrderMethod.DELIVERY ? 'Cash on Delivery' : 'In-Store Pickup',
    });
  }
}
