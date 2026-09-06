import { useState } from "react";
import { Bell, Truck, CheckCircle2, Tag, Star, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { NotificationCard } from "@/components/commerce/notification-card";

interface MockNotification {
  id: string;
  icon: typeof Bell;
  title: string;
  description: string;
  time: string;
  group: "Today" | "Earlier";
  tone: "neutral" | "success" | "warning" | "accent";
  unread: boolean;
}

const initialNotifications: MockNotification[] = [
  { id: "1", icon: Truck, title: "Your order is on the way", description: "Corner Market · arriving in 8 minutes", time: "2 min ago", group: "Today", tone: "accent", unread: true },
  { id: "2", icon: Tag, title: "New offer nearby", description: "15% off at Rivera Bakery this week", time: "3 hours ago", group: "Today", tone: "warning", unread: true },
  { id: "3", icon: CheckCircle2, title: "Order delivered", description: "Green Leaf Pharmacy", time: "Yesterday", group: "Earlier", tone: "success", unread: false },
  { id: "4", icon: Star, title: "How was your order?", description: "Rate your recent pickup from Maple Street Diner", time: "3 days ago", group: "Earlier", tone: "neutral", unread: false },
  { id: "5", icon: MailCheck, title: "Email verified", description: "Your account email was confirmed", time: "1 week ago", group: "Earlier", tone: "success", unread: false },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  function markAllRead() {
    setNotifications((current) => current.map((n) => ({ ...n, unread: false })));
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={<Bell size={20} />}
        title="You're all caught up"
        description="New notifications about your orders and offers will show up here."
      />
    );
  }

  const groups: MockNotification["group"][] = ["Today", "Earlier"];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-heading-lg font-semibold text-foreground">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {groups.map((group) => {
          const items = notifications.filter((n) => n.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group}>
              <p className="mb-2 font-mono text-caption uppercase tracking-[0.1em] text-foreground-subtle">{group}</p>
              <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-2">
                {items.map((n) => (
                  <NotificationCard
                    key={n.id}
                    icon={n.icon}
                    title={n.title}
                    description={n.description}
                    time={n.time}
                    unread={n.unread}
                    tone={n.tone}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
