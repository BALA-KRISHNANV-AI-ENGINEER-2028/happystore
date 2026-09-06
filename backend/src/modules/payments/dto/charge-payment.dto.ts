import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export const PAYMENT_PROVIDER_NAMES = ['CASH_ON_DELIVERY', 'COD', 'STRIPE', 'RAZORPAY'] as const;
export type PaymentProviderName = (typeof PAYMENT_PROVIDER_NAMES)[number];

export class ChargePaymentDto {
  @IsUUID()
  orderId: string;

  @IsString()
  @IsIn(PAYMENT_PROVIDER_NAMES)
  method: PaymentProviderName;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;
}