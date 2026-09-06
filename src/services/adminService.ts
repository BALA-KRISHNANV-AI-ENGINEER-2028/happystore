// =============================================================================
// Happy Store — Admin Service
// =============================================================================

import { mockGet, mockPatch, mockPost, mockDelete } from "./apiClient";
import type { ApiResponse, PaginatedResponse } from "@/types";
import {
  adminUsers, adminShops, adminProducts, adminCategories, adminOrders,
  adminReports, adminNotifications, cmsBanners, adminRoles, auditLogs,
  systemServices, platformRevenueSeries, revenueByCategory,
  type AdminUser, type AdminShop, type AdminProduct, type AdminCategory,
  type AdminOrder, type AdminReport, type AdminNotification,
  type CmsBanner, type AdminRole, type AuditLogEntry, type SystemService,
} from "@/lib/mock-admin";

let users = [...adminUsers];
let shops = [...adminShops];
let products = [...adminProducts];
let categories = [...adminCategories];

export const adminService = {
  // Users
  async getUsers(): Promise<ApiResponse<AdminUser[]>> {
    return mockGet(users, { latencyMs: 200 });
  },
  async updateUserStatus(
    id: string,
    status: AdminUser["status"],
  ): Promise<ApiResponse<AdminUser | null>> {
    users = users.map((u) => (u.id === id ? { ...u, status } : u));
    return mockPatch(users.find((u) => u.id === id) ?? null, { latencyMs: 400 });
  },

  // Shops
  async getShops(): Promise<ApiResponse<AdminShop[]>> {
    return mockGet(shops, { latencyMs: 200 });
  },
  async approveShop(id: string): Promise<ApiResponse<AdminShop | null>> {
    shops = shops.map((s) => (s.id === id ? { ...s, status: "approved" as const } : s));
    return mockPatch(shops.find((s) => s.id === id) ?? null, { latencyMs: 500 });
  },
  async suspendShop(id: string): Promise<ApiResponse<AdminShop | null>> {
    shops = shops.map((s) => (s.id === id ? { ...s, status: "suspended" as const } : s));
    return mockPatch(shops.find((s) => s.id === id) ?? null, { latencyMs: 500 });
  },

  // Products
  async getProducts(): Promise<ApiResponse<AdminProduct[]>> {
    return mockGet(products, { latencyMs: 200 });
  },
  async flagProduct(id: string, flagged: boolean): Promise<ApiResponse<AdminProduct | null>> {
    products = products.map((p) => (p.id === id ? { ...p, flagged } : p));
    return mockPatch(products.find((p) => p.id === id) ?? null, { latencyMs: 300 });
  },

  // Categories
  async getCategories(): Promise<ApiResponse<AdminCategory[]>> {
    return mockGet(categories, { latencyMs: 150 });
  },
  async createCategory(data: Omit<AdminCategory, "id">): Promise<ApiResponse<AdminCategory>> {
    const newCat: AdminCategory = { ...data, id: `c-${Date.now()}` };
    categories = [...categories, newCat];
    return mockPost(newCat, { latencyMs: 500 });
  },
  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    categories = categories.filter((c) => c.id !== id);
    return mockDelete({ latencyMs: 400 });
  },

  // Orders
  async getOrders(
    page = 1,
    pageSize = 20,
  ): Promise<ApiResponse<PaginatedResponse<AdminOrder>>> {
    const total = adminOrders.length;
    const items = adminOrders.slice((page - 1) * pageSize, page * pageSize);
    return mockGet({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  },

  // Reports
  async getReports(): Promise<ApiResponse<AdminReport[]>> {
    return mockGet(adminReports, { latencyMs: 150 });
  },

  // Revenue & Analytics
  async getRevenueSeries(): Promise<ApiResponse<typeof platformRevenueSeries>> {
    return mockGet(platformRevenueSeries, { latencyMs: 200 });
  },
  async getRevenueByCategory(): Promise<ApiResponse<typeof revenueByCategory>> {
    return mockGet(revenueByCategory, { latencyMs: 200 });
  },

  // Notifications
  async getNotifications(): Promise<ApiResponse<AdminNotification[]>> {
    return mockGet(adminNotifications, { latencyMs: 150 });
  },

  // CMS
  async getBanners(): Promise<ApiResponse<CmsBanner[]>> {
    return mockGet(cmsBanners, { latencyMs: 150 });
  },

  // Roles
  async getRoles(): Promise<ApiResponse<AdminRole[]>> {
    return mockGet(adminRoles, { latencyMs: 150 });
  },

  // Audit Logs
  async getAuditLogs(): Promise<ApiResponse<AuditLogEntry[]>> {
    return mockGet(auditLogs, { latencyMs: 150 });
  },

  // System Health
  async getSystemHealth(): Promise<ApiResponse<SystemService[]>> {
    return mockGet(systemServices, { latencyMs: 150 });
  },
};
