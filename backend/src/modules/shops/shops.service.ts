import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ShopsRepository } from './shops.repository';
import { Prisma, ShopStatus, User, Role } from '@prisma/client';
import { PaginationParams } from '../../common/utils/pagination.util';

@Injectable()
export class ShopsService {
  constructor(private readonly repo: ShopsRepository) {}

  findAll(params: PaginationParams & { search?: string; category?: string; status?: ShopStatus; ownerId?: string }) {
    return this.repo.findAll(params);
  }

  async findOne(id: string) {
    const shop = await this.repo.findById(id);
    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }

  async create(data: Prisma.ShopUncheckedCreateInput) {
    return this.repo.create(data as unknown as Prisma.ShopCreateInput);
  }

  async update(id: string, data: Prisma.ShopUpdateInput, requester: User) {
    const shop = await this.findOne(id);
    if (requester.role !== Role.ADMIN && shop.ownerId !== requester.id) {
      throw new ForbiddenException('You can only update your own shop');
    }
    return this.repo.update(id, data);
  }

  async remove(id: string, requester: User) {
    const shop = await this.findOne(id);
    if (requester.role !== Role.ADMIN && shop.ownerId !== requester.id) {
      throw new ForbiddenException('You can only delete your own shop');
    }
    return this.repo.remove(id);
  }
}
