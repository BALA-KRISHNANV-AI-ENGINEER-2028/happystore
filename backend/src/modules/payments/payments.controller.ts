import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ChargePaymentDto } from './dto/charge-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('charge')
  @Roles(Role.CUSTOMER, Role.ADMIN)
  @ApiOperation({ summary: 'Charge a payment for an order' })
  chargePayment(@Body() body: ChargePaymentDto) {
    return this.paymentsService.processPayment(body.orderId, body.method, body.amount);
  }

  @Post('refund')
  @Roles(Role.ADMIN, Role.SHOP_OWNER)
  @ApiOperation({ summary: 'Process a refund for an order' })
  processRefund(@Body() body: RefundPaymentDto) {
    return this.paymentsService.processRefund(body.orderId, body.method, body.amount);
  }

  @Get('history/:shopId')
  @Roles(Role.SHOP_OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Get payment transaction history for a shop' })
  getHistory(@Param('shopId') shopId: string) {
    return this.paymentsService.getPaymentHistory(shopId);
  }
}
