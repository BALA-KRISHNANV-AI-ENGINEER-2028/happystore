import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { Prisma } from '@prisma/client';
import { paginate, buildPaginatedResult, buildOrderBy, PaginationParams, PaginatedResult } from '../../common/utils/pagination.util';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(params: PaginationParams & { search?: string }): Promise<PaginatedResult<Omit<Prisma.UserGetPayload<object>, 'password' | 'refreshToken'>>> {
    const { skip, take } = paginate(params);
    const where: Prisma.UserWhereInput = params.search
      ? { OR: [{ fullName: { contains: params.search, mode: 'insensitive' } }, { email: { contains: params.search, mode: 'insensitive' } }] }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: buildOrderBy(params.sortBy, params.sortOrder) ?? { createdAt: 'desc' },
        select: { id: true, fullName: true, email: true, phone: true, initials: true, role: true, status: true, memberSince: true, avatarUrl: true, createdAt: true, updatedAt: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    return buildPaginatedResult(users, total, params);
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
