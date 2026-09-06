// =============================================================================
// Happy Store — Analytics Service
// =============================================================================

import { mockGet } from "./apiClient";
import type { ApiResponse, RevenueSeries, TopProduct, CategoryRevenue } from "@/types";
import { revenueSeries, topProducts } from "@/lib/mock-shop-owner";
import { platformRevenueSeries, revenueByCategory } from "@/lib/mock-admin";

export interface DashboardStats {
  revenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  avgRating: number;
  ratingChange: number;
  customers: number;
  customersChange: number;
}

const SHOP_STATS: DashboardStats = {
  revenue: 645,
  revenueChange: 12.4,
  orders: 29,
  ordersChange: 7.4,
  avgRating: 4.8,
  ratingChange: 0.2,
  customers: 5,
  customersChange: 25,
};

const PLATFORM_STATS = {
  totalRevenue: 312400,
  revenueChange: 8.2,
  totalOrders: 13822,
  ordersChange: 5.1,
  activeShops: 6,
  shopsChange: 20,
  totalUsers: 2847,
  usersChange: 12.3,
};

export const analyticsService = {
  // Shop owner
  async getShopStats(): Promise<ApiResponse<DashboardStats>> {
    return mockGet(SHOP_STATS, { latencyMs: 180 });
  },
  async getShopRevenueSeries(): Promise<ApiResponse<RevenueSeries[]>> {
    return mockGet(revenueSeries as RevenueSeries[], { latencyMs: 200 });
  },
  async getTopProducts(): Promise<ApiResponse<TopProduct[]>> {
    return mockGet(topProducts as TopProduct[], { latencyMs: 150 });
  },

  // Platform (admin)
  async getPlatformStats(): Promise<ApiResponse<typeof PLATFORM_STATS>> {
    return mockGet(PLATFORM_STATS, { latencyMs: 200 });
  },
  async getPlatformRevenueSeries(): Promise<ApiResponse<RevenueSeries[]>> {
    return mockGet(platformRevenueSeries as RevenueSeries[], { latencyMs: 200 });
  },
  async getPlatformRevenueByCategory(): Promise<ApiResponse<CategoryRevenue[]>> {
    return mockGet(revenueByCategory as CategoryRevenue[], { latencyMs: 180 });
  },
};
