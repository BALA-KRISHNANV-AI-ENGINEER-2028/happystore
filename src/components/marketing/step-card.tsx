import type { LucideIcon } from "lucide-react";

export interface StepCardProps {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function StepCard({ step, icon: Icon, title, description }: StepCardProps) {
  return (
    <div className="relative flex flex-col items-start gap-3 rounded-lg border border-border bg-surface p-6">
      <span className="font-mono text-caption text-foreground-subtle">Step {step}</span>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <p className="font-display text-body font-semibold text-foreground">{title}</p>
      <p className="text-body-sm text-foreground-muted">{description}</p>
    </div>
  );
}
