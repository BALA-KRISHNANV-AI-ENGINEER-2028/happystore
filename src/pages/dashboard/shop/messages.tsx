import { useState } from "react";
import { Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { conversations as seedConversations, type Conversation } from "@/lib/mock-shop-owner";

export default function ShopMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations);
  const [activeId, setActiveId] = useState(seedConversations[0]?.id);
  const [draft, setDraft] = useState("");

  const active = conversations.find((c) => c.id === activeId);

  function selectConversation(id: string) {
    setActiveId(id);
    setConversations((current) => current.map((c) => (c.id === id ? { ...c, unread: false } : c)));
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !active) return;
    setConversations((current) =>
      current.map((c) =>
        c.id === active.id
          ? { ...c, lastMessage: draft, messages: [...c.messages, { fromShop: true, text: draft, time: "Just now" }] }
          : c,
      ),
    );
    setDraft("");
  }

  return (
    <div className="grid h-[calc(100vh-11rem)] grid-cols-1 overflow-hidden rounded-lg border border-border sm:grid-cols-[280px_1fr]">
      {/* Conversation list */}
      <div className="hidden flex-col divide-y divide-border overflow-y-auto border-r border-border bg-surface sm:flex">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => selectConversation(c.id)}
            className={cn(
              "flex items-start gap-2.5 p-3.5 text-left transition-colors hover:bg-surface-sunken",
              activeId === c.id && "bg-surface-sunken",
            )}
          >
            <Avatar fallback={c.initials} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-body-sm font-medium text-foreground">{c.customerName}</p>
                {c.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </div>
              <p className="truncate text-caption text-foreground-subtle">{c.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Thread */}
      <div className="flex flex-col bg-background">
        {active ? (
          <>
            <div className="flex items-center gap-2.5 border-b border-border p-4">
              <Avatar fallback={active.initials} size="sm" />
              <p className="text-body-sm font-medium text-foreground">{active.customerName}</p>
            </div>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              {active.messages.map((m, i) => (
                <div key={i} className={cn("max-w-[75%] rounded-lg px-3.5 py-2 text-body-sm", m.fromShop ? "self-end bg-primary text-foreground-on-primary" : "self-start bg-surface-sunken text-foreground")}>
                  {m.text}
                  <p className={cn("mt-1 text-[10px]", m.fromShop ? "text-white/70" : "text-foreground-subtle")}>{m.time}</p>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-border p-3">
              <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message…" className="flex-1" />
              <Button type="submit" size="icon" variant="primary" aria-label="Send message"><Send size={15} /></Button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-body-sm text-foreground-subtle">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
