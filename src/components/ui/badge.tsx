import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-caption font-medium leading-none",
  {
    variants: {
      tone: {
        neutral: "bg-surface-sunken text-foreground-muted border border-border",
        primary: "bg-primary-soft text-primary-strong",
        accent: "bg-accent-soft text-accent-strong",
        success: "bg-success-soft text-success-600",
        warning: "bg-warning-soft text-warning-600",
        error: "bg-error-soft text-error-600",
        info: "bg-info-soft text-info-600",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
