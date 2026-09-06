import { TransactionType } from '@prisma/client';

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  status: string;
  error?: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  error?: string;
}

export interface IPaymentProvider {
  name: string;
  processPayment(orderId: string, amount: number): Promise<PaymentResult>;
  processRefund(transactionId: string, amount: number): Promise<RefundResult>;
}
