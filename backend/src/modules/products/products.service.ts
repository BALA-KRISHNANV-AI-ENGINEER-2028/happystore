import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../../common/utils/pagination.util';

@Injectable()
export class ProductsService {
  constructor(private readonly repo: ProductsRepository) {}

  findAll(params: PaginationParams & { search?: string; categorySlug?: string; shopId?: string; inStock?: boolean }) {
    return this.repo.findAll(params);
  }

  async findOne(id: string) {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(data: Prisma.ProductCreateInput) {
    return this.repo.create(data);
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    await this.findOne(id);
    return this.repo.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}
