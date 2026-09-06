// =============================================================================
// Happy Store — Message Service
// =============================================================================

import { mockGet, mockPost } from "./apiClient";
import type { ApiResponse, Conversation, Message } from "@/types";
import { conversations } from "@/lib/mock-shop-owner";

let convos = conversations.map((c) => ({ ...c })) as Conversation[];

export const messageService = {
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return mockGet(convos, { latencyMs: 180 });
  },

  async getConversation(id: string): Promise<ApiResponse<Conversation | null>> {
    const convo = convos.find((c) => c.id === id) ?? null;
    return mockGet(convo, { latencyMs: 120 });
  },

  async sendMessage(
    conversationId: string,
    text: string,
  ): Promise<ApiResponse<Message>> {
    const msg: Message = { fromShop: true, text, time: "Just now" };
    convos = convos.map((c) =>
      c.id === conversationId
        ? { ...c, messages: [...c.messages, msg], lastMessage: text }
        : c,
    );
    return mockPost(msg, { latencyMs: 400 });
  },
};
