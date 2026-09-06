import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AnalyticsCardProps {
  label: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  sparkline?: number[];
  className?: string;
}

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((d - min) / range) * 100}`)
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-9 w-full text-primary">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AnalyticsCard({ label, value, change, icon: Icon, sparkline, className }: AnalyticsCardProps) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label text-foreground-muted">{label}</p>
          <p className="mt-1.5 font-display text-heading-md font-semibold text-foreground">{value}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
          <Icon size={16} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        {change !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-label font-medium",
              isPositive ? "text-success-600" : "text-error-600",
            )}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change)}%
          </span>
        )}
        {sparkline && <div className="w-20 flex-1"><MiniSparkline data={sparkline} /></div>}
      </div>
    </Card>
  );
}
