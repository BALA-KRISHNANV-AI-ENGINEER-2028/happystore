import { Check, Package, ChefHat, Truck, Home, X } from "lucide-react";
import type { OrderStatus } from "@/lib/orders-context";
import { cn } from "@/lib/utils";

const steps: { key: OrderStatus; label: string; icon: typeof Package }[] = [
  { key: "placed", label: "Placed", icon: Package },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "on_the_way", label: "On the way", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-error/30 bg-error-soft p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-error text-white">
          <X size={16} />
        </div>
        <div>
          <p className="text-body-sm font-medium text-foreground">Order cancelled</p>
          <p className="text-caption text-foreground-subtle">This order will not be charged or delivered.</p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const isCurrent = i === currentIndex;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex flex-1 flex-col items-center last:flex-none">
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  done && "border-primary bg-primary text-foreground-on-primary",
                  isCurrent && "border-primary bg-primary-soft text-primary-strong animate-pulse-ring",
                  !done && !isCurrent && "border-border bg-surface text-foreground-subtle",
                )}
              >
                {done ? <Check size={16} /> : <Icon size={16} />}
              </div>
              {i < steps.length - 1 && (
                <div className={cn("h-0.5 flex-1", i < currentIndex ? "bg-primary" : "bg-border")} />
              )}
            </div>
            <span
              className={cn(
                "mt-2 text-center text-caption font-medium",
                isCurrent ? "text-foreground" : "text-foreground-subtle",
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
