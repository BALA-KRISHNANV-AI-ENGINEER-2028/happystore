import type { LucideIcon } from "lucide-react";

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-start gap-3 p-1">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <p className="font-display text-body font-semibold text-foreground">{title}</p>
      <p className="text-body-sm text-foreground-muted">{description}</p>
    </div>
  );
}
