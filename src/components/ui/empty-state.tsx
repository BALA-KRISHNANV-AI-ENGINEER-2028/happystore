import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: "neutral" | "error";
  className?: string;
}

export function EmptyState({ icon, title, description, action, tone = "neutral", className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-14 text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          tone === "error" ? "bg-error-soft text-error" : "bg-surface-sunken text-foreground-subtle",
        )}
      >
        {icon}
      </div>
      <div className="max-w-xs">
        <p className="font-display text-body-lg font-semibold text-foreground">{title}</p>
        {description && <p className="mt-1 text-body-sm text-foreground-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
