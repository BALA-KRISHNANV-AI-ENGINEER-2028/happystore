import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PaginationParams } from '../../common/utils/pagination.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async findAll(params: PaginationParams & { search?: string }) {
    return this.repo.findAll(params);
  }

  async findOne(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    const { password: _, refreshToken: __, ...safe } = user;
    return safe;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    await this.findOne(id); // ensures existence
    const updated = await this.repo.update(id, data);
    const { password: _, refreshToken: __, ...safe } = updated;
    return safe;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.remove(id);
  }
}
