import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { validate } from './common/config/env.validation';
import { PrismaModule } from './common/database/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ShopsModule } from './modules/shops/shops.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { HealthModule } from './modules/health/health.module';
import { ShoppingModule } from './modules/shopping/shopping.module';
import { SearchModule } from './modules/search/search.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { JobsModule } from './modules/jobs/jobs.module';

@Module({
  imports: [
    // ─── Config ──────────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),

    // ─── Rate Limiting ────────────────────────────────────────────────────────
    ThrottlerModule.forRoot([{
      ttl: 60_000,  // 1 minute window
      limit: 100,   // 100 requests per window per IP
    }]),

    // ─── Infrastructure ───────────────────────────────────────────────────────
    PrismaModule,
    RedisModule,

    // ─── Feature Modules ──────────────────────────────────────────────────────
    HealthModule,
    AuthModule,
    UsersModule,
    ShopsModule,
    ProductsModule,
    OrdersModule,
    ShoppingModule,
    SearchModule,
    PaymentsModule,
    ChatModule,
    NotificationsModule,
    AnalyticsModule,
    JobsModule,
  ],
  providers: [
    // ─── Global Guards ────────────────────────────────────────────────────────
    // Order matters: rate-limit first, before spending work on auth/roles checks.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },

    // ─── Global Filters ───────────────────────────────────────────────────────
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },

    // ─── Global Interceptors ──────────────────────────────────────────────────
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
