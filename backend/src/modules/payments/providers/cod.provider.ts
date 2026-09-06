import { IPaymentProvider, PaymentResult, RefundResult } from './payment-provider.interface';

export class CodProvider implements IPaymentProvider {
  readonly name = 'CASH_ON_DELIVERY';

  async processPayment(orderId: string, amount: number): Promise<PaymentResult> {
    // COD is completed when order is delivered, so initially marked as PENDING_DELIVERY
    return {
      success: true,
      transactionId: `COD-TX-${orderId}-${Date.now().toString().slice(-4)}`,
      status: 'PENDING_DELIVERY',
    };
  }

  async processRefund(transactionId: string, amount: number): Promise<RefundResult> {
    return {
      success: true,
      refundId: `REF-${transactionId}`,
    };
  }
}
