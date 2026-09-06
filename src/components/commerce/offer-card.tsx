import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OfferCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  code?: string;
  tone?: "primary" | "accent";
  className?: string;
}

export const OfferCard = memo(function OfferCard({ icon: Icon, title, description, code, tone = "accent", className }: OfferCardProps) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-lg border p-5",
        tone === "accent" ? "border-accent/30 bg-accent-soft" : "border-primary/25 bg-primary-soft",
        className,
      )}
    >
      <div
        className={cn(
          "mb-3 flex h-10 w-10 items-center justify-center rounded-full",
          tone === "accent" ? "bg-accent text-foreground-on-accent" : "bg-primary text-foreground-on-primary",
        )}
      >
        <Icon size={18} />
      </div>
      <p className="font-display text-body font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-body-sm text-foreground-muted">{description}</p>
      {code && (
        <p className="mt-3 inline-block rounded-sm border border-dashed border-border-strong bg-surface px-2 py-1 font-mono text-caption font-medium text-foreground">
          {code}
        </p>
      )}
    </article>
  );
});
