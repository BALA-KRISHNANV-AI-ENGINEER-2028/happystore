import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { Prisma, OrderStatus } from '@prisma/client';
import { paginate, buildPaginatedResult, PaginationParams } from '../../common/utils/pagination.util';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { lineItems: true, shop: { select: { id: true, name: true, address: true } }, customer: { select: { id: true, fullName: true, email: true } } },
    });
  }

  async findAll(params: PaginationParams & { customerId?: string; shopId?: string; status?: OrderStatus }) {
    const { skip, take } = paginate(params);
    const where: Prisma.OrderWhereInput = {
      ...(params.customerId && { customerId: params.customerId }),
      ...(params.shopId && { shopId: params.shopId }),
      ...(params.status && { status: params.status }),
    };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { placedAt: 'desc' },
        include: {
          lineItems: true,
          shop: { select: { id: true, name: true } },
          customer: { select: { id: true, fullName: true, email: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return buildPaginatedResult(orders, total, params);
  }

  async create(data: Prisma.OrderCreateInput) {
    return this.prisma.order.create({ data, include: { lineItems: true } });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({ where: { id }, data: { status } });
  }
}
