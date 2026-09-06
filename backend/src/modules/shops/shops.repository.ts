import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { Prisma, ShopStatus } from '@prisma/client';
import { paginate, buildPaginatedResult, PaginationParams } from '../../common/utils/pagination.util';

@Injectable()
export class ShopsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.shop.findUnique({
      where: { id },
      include: { owner: { select: { id: true, fullName: true, email: true } } },
    });
  }

  async findAll(params: PaginationParams & { search?: string; category?: string; status?: ShopStatus; ownerId?: string }) {
    const { skip, take } = paginate(params);
    const where: Prisma.ShopWhereInput = {
      ...(params.search && { name: { contains: params.search, mode: 'insensitive' } }),
      ...(params.category && { category: params.category }),
      ...(params.status && { status: params.status }),
      ...(params.ownerId && { ownerId: params.ownerId }),
    };

    const [shops, total] = await Promise.all([
      this.prisma.shop.findMany({
        where,
        skip,
        take,
        orderBy: { rating: 'desc' },
        include: { owner: { select: { id: true, fullName: true, email: true } } },
      }),
      this.prisma.shop.count({ where }),
    ]);

    return buildPaginatedResult(shops, total, params);
  }

  async create(data: Prisma.ShopCreateInput) {
    return this.prisma.shop.create({ data });
  }

  async update(id: string, data: Prisma.ShopUpdateInput) {
    return this.prisma.shop.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.shop.delete({ where: { id } });
  }
}
