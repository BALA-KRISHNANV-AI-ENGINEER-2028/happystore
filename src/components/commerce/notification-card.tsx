import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
  tone?: "neutral" | "success" | "warning" | "accent";
  className?: string;
}

const toneClasses: Record<NonNullable<NotificationCardProps["tone"]>, string> = {
  neutral: "bg-surface-sunken text-foreground-muted",
  success: "bg-success-soft text-success-600",
  warning: "bg-warning-soft text-warning-600",
  accent: "bg-accent-soft text-accent-strong",
};

export function NotificationCard({ icon: Icon, title, description, time, unread, tone = "neutral", className }: NotificationCardProps) {
  return (
    <div
      className={cn(
        "relative flex gap-3 rounded-lg p-3.5 transition-colors",
        unread ? "bg-primary-soft/50" : "hover:bg-surface-sunken/60",
        className,
      )}
    >
      {unread && <span className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />}
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", toneClasses[tone])}>
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-body-sm font-medium text-foreground">{title}</p>
        <p className="text-caption text-foreground-muted">{description}</p>
        <p className="mt-0.5 text-caption text-foreground-subtle">{time}</p>
      </div>
    </div>
  );
}
