import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
import { PAYMENT_PROVIDER_NAMES, PaymentProviderName } from './charge-payment.dto';

export class RefundPaymentDto {
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