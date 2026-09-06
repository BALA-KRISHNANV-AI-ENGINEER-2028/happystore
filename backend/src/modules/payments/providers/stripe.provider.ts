import { IPaymentProvider, PaymentResult, RefundResult } from './payment-provider.interface';

export class StripeProvider implements IPaymentProvider {
  readonly name = 'STRIPE';

  async processPayment(orderId: string, amount: number): Promise<PaymentResult> {
    // Simulated Stripe payment API call
    return {
      success: true,
      transactionId: `ch_${Math.random().toString(36).substring(2, 15)}`,
      status: 'PAID',
    };
  }

  async processRefund(transactionId: string, amount: number): Promise<RefundResult> {
    return {
      success: true,
      refundId: `re_${Math.random().toString(36).substring(2, 15)}`,
    };
  }
}
