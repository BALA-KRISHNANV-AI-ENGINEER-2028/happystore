import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { InvoiceService } from './invoice.service';
import { OrderTimelineService } from './order-timeline.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, InvoiceService, OrderTimelineService],
  exports: [OrdersService, InvoiceService, OrderTimelineService],
})
export class OrdersModule {}
