import { RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ReorderCardProps {
  shopName: string;
  itemSummary: string;
  lastOrderedAt: string;
  total: number;
  className?: string;
  onReorder?: () => void;
}

export function ReorderCard({ shopName, itemSummary, lastOrderedAt, total, className, onReorder }: ReorderCardProps) {
  return (
    <Card className={cn("flex w-64 shrink-0 flex-col gap-3 p-4", className)}>
      <div>
        <p className="text-body-sm font-medium text-foreground">{shopName}</p>
        <p className="line-clamp-1 text-caption text-foreground-subtle">{itemSummary}</p>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <div>
          <p className="font-mono text-label font-medium text-foreground">${total.toFixed(2)}</p>
          <p className="text-caption text-foreground-subtle">{lastOrderedAt}</p>
        </div>
        <button
          onClick={onReorder}
          className="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-label font-medium text-primary-strong transition-colors hover:bg-primary hover:text-foreground-on-primary"
        >
          <RotateCcw size={13} /> Reorder
        </button>
      </div>
    </Card>
  );
}
