// =============================================================================
// Happy Store — Review Service
// =============================================================================

import { mockGet, mockPost } from "./apiClient";
import type { ApiResponse, Review } from "@/types";
import { mockShops } from "@/lib/mock-shops";

export const reviewService = {
  async getReviews(shopId: string): Promise<ApiResponse<Review[]>> {
    const shop = mockShops.find((s) => s.id === shopId);
    return mockGet((shop?.reviews ?? []) as unknown as Review[], { latencyMs: 150 });
  },

  async submitReview(
    shopId: string,
    payload: { rating: number; comment: string },
  ): Promise<ApiResponse<Review>> {
    void shopId;
    const review: Review = {
      id: `r-${Date.now()}`,
      authorName: "You",
      authorInitials: "YO",
      rating: payload.rating,
      date: "Just now",
      comment: payload.comment,
    };
    return mockPost(review, { latencyMs: 600 });
  },

  async replyToReview(
    shopId: string,
    reviewId: string,
    reply: string,
  ): Promise<ApiResponse<Review>> {
    void shopId;
    const review: Review = {
      id: reviewId,
      authorName: "Customer",
      authorInitials: "C",
      rating: 5,
      date: "Recently",
      comment: "Original review",
      reply,
    };
    return mockPost(review, { latencyMs: 500 });
  },
};
