import { Bell, AlertTriangle, Info, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { adminNotifications } from "@/lib/mock-admin";
import { cn } from "@/lib/utils";

const toneConfig = {
  warning: { icon: AlertTriangle, className: "bg-warning-soft text-warning-600" },
  info: { icon: Info, className: "bg-info-soft text-info-600" },
  error: { icon: XCircle, className: "bg-error-soft text-error-600" },
};

export default function AdminNotificationsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 flex items-center gap-2 font-display text-heading-lg font-semibold text-foreground">
        <Bell size={22} /> System notifications
      </h1>
      <div className="flex flex-col gap-3">
        {adminNotifications.map((n) => {
          const { icon: Icon, className } = toneConfig[n.tone];
          return (
            <Card key={n.id} className="flex items-start gap-3 p-4">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", className)}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-body-sm font-medium text-foreground">{n.title}</p>
                <p className="text-caption text-foreground-muted">{n.description}</p>
                <p className="mt-0.5 text-caption text-foreground-subtle">{n.time}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
