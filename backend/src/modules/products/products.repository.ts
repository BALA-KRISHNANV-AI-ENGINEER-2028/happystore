import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { Prisma } from '@prisma/client';
import { paginate, buildPaginatedResult, PaginationParams } from '../../common/utils/pagination.util';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { shop: true, category: true },
    });
  }

  async findAll(params: PaginationParams & { search?: string; categorySlug?: string; shopId?: string; inStock?: boolean }) {
    const { skip, take } = paginate(params);
    const where: Prisma.ProductWhereInput = {
      ...(params.search && { name: { contains: params.search, mode: 'insensitive' } }),
      ...(params.categorySlug && { categorySlug: params.categorySlug }),
      ...(params.shopId && { shopId: params.shopId }),
      ...(params.inStock === true && { outOfStock: false }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { rating: 'desc' },
        include: { shop: { select: { id: true, name: true } }, category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return buildPaginatedResult(products, total, params);
  }

  async create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
