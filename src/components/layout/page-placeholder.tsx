import type { LucideIcon } from "lucide-react";

export function PagePlaceholder({
  icon: Icon,
  title,
  phase,
  description,
}: {
  icon: LucideIcon;
  title: string;
  phase: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border px-6 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
        <Icon size={24} strokeWidth={1.75} />
      </div>
      <div className="max-w-sm">
        <p className="mb-1 font-mono text-caption uppercase tracking-[0.12em] text-accent-strong">{phase}</p>
        <h2 className="font-display text-heading-sm font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-body-sm text-foreground-muted">{description}</p>
      </div>
    </div>
  );
}
