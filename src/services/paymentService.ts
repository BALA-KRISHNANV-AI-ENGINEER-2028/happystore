// =============================================================================
// Happy Store — Payment Service
// =============================================================================

import { mockGet, mockPost } from "./apiClient";
import type { ApiResponse, PaymentMethod } from "@/types";
import { defaultPaymentMethods } from "@/lib/mock-user";

export const paymentService = {
  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    return mockGet(defaultPaymentMethods as PaymentMethod[], { latencyMs: 150 });
  },

  async addPaymentMethod(
    method: Omit<PaymentMethod, "id">,
  ): Promise<ApiResponse<PaymentMethod>> {
    const newMethod: PaymentMethod = { ...method, id: `pm-${Date.now()}` };
    return mockPost(newMethod, { latencyMs: 600 });
  },

  async processPayment(payload: {
    amount: number;
    paymentMethodId: string;
    orderId: string;
  }): Promise<ApiResponse<{ transactionId: string; status: "success" | "failed" }>> {
    void payload;
    const result = { transactionId: `txn-${Date.now()}`, status: "success" as const };
    return mockPost(result, { latencyMs: 1200 });
  },
};
