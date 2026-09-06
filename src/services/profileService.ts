// =============================================================================
// Happy Store — Profile Service
// =============================================================================

import { mockGet, mockPatch, mockPost, mockDelete } from "./apiClient";
import type { ApiResponse, User, Address, PaymentMethod } from "@/types";
import { defaultProfile, defaultAddresses, defaultPaymentMethods } from "@/lib/mock-user";

let profile = {
  id: "u1",
  fullName: defaultProfile.fullName,
  email: defaultProfile.email,
  phone: defaultProfile.phone,
  initials: defaultProfile.initials,
  role: "customer" as const,
  status: "active" as const,
  memberSince: defaultProfile.memberSince,
};
let addresses = [...defaultAddresses] as Address[];
let paymentMethods = [...defaultPaymentMethods] as PaymentMethod[];

export const profileService = {
  async getProfile(): Promise<ApiResponse<User>> {
    return mockGet(profile as User, { latencyMs: 150 });
  },

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    profile = { ...profile, ...updates } as typeof profile;
    return mockPatch(profile as User, { latencyMs: 600 });
  },

  async getAddresses(): Promise<ApiResponse<Address[]>> {
    return mockGet(addresses, { latencyMs: 100 });
  },

  async addAddress(address: Omit<Address, "id">): Promise<ApiResponse<Address>> {
    const newAddr: Address = { ...address, id: `addr-${Date.now()}` };
    addresses = [...addresses, newAddr];
    return mockPost(newAddr, { latencyMs: 400 });
  },

  async updateAddress(id: string, updates: Partial<Address>): Promise<ApiResponse<Address>> {
    addresses = addresses.map((a) => (a.id === id ? { ...a, ...updates } : a));
    const updated = addresses.find((a) => a.id === id)!;
    return mockPatch(updated, { latencyMs: 400 });
  },

  async deleteAddress(id: string): Promise<ApiResponse<null>> {
    addresses = addresses.filter((a) => a.id !== id);
    return mockDelete({ latencyMs: 300 });
  },

  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    return mockGet(paymentMethods, { latencyMs: 100 });
  },

  async addPaymentMethod(method: Omit<PaymentMethod, "id">): Promise<ApiResponse<PaymentMethod>> {
    const newPm: PaymentMethod = { ...method, id: `pm-${Date.now()}` };
    paymentMethods = [...paymentMethods, newPm];
    return mockPost(newPm, { latencyMs: 600 });
  },

  async deletePaymentMethod(id: string): Promise<ApiResponse<null>> {
    paymentMethods = paymentMethods.filter((p) => p.id !== id);
    return mockDelete({ latencyMs: 300 });
  },
};
