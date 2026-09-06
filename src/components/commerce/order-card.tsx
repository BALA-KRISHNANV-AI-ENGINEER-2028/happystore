import { Package, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type OrderStatus = "placed" | "preparing" | "on_the_way" | "delivered" | "cancelled";

const statusConfig: Record<OrderStatus, { label: string; tone: "neutral" | "warning" | "info" | "success" | "error" }> = {
  placed: { label: "Order placed", tone: "neutral" },
  preparing: { label: "Preparing", tone: "warning" },
  on_the_way: { label: "On the way", tone: "info" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "error" },
};

export interface OrderCardProps {
  orderId: string;
  shopName: string;
  itemSummary: string;
  total: number;
  status: OrderStatus;
  placedAt: string;
  className?: string;
  onClick?: () => void;
}

export function OrderCard({ orderId, shopName, itemSummary, total, status, placedAt, className, onClick }: OrderCardProps) {
  const cfg = statusConfig[status];
  return (
    <Card
      onClick={onClick}
      className={cn("flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-surface-sunken/50", className)}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
        <Package size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-body-sm font-medium text-foreground">{shopName}</p>
          <span className="font-mono text-caption text-foreground-subtle">#{orderId}</span>
        </div>
        <p className="truncate text-caption text-foreground-subtle">{itemSummary}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <Badge tone={cfg.tone}>{cfg.label}</Badge>
          <span className="text-caption text-foreground-subtle">{placedAt}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <span className="font-mono text-body-sm font-medium text-foreground">${total.toFixed(2)}</span>
        <ChevronRight size={16} className="text-foreground-subtle" />
      </div>
    </Card>
  );
}
