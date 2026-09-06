import { IPaymentProvider, PaymentResult, RefundResult } from './payment-provider.interface';

export class RazorpayProvider implements IPaymentProvider {
  readonly name = 'RAZORPAY';

  async processPayment(orderId: string, amount: number): Promise<PaymentResult> {
    // Simulated Razorpay payment API call
    return {
      success: true,
      transactionId: `pay_${Math.random().toString(36).substring(2, 15)}`,
      status: 'PAID',
    };
  }

  async processRefund(transactionId: string, amount: number): Promise<RefundResult> {
    return {
      success: true,
      refundId: `rfnd_${Math.random().toString(36).substring(2, 15)}`,
    };
  }
}
