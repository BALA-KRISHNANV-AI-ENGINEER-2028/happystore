import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProximityChipProps {
  distance: string;
  open?: boolean;
  className?: string;
}

/** Happy Store's signature element: a live "open now / distance" indicator
 *  used across shop cards, order tracking, and the map view. */
export function ProximityChip({ distance, open = true, className }: ProximityChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-border bg-surface py-1.5 pl-2 pr-3.5 shadow-sm",
        className,
      )}
    >
      <span className="relative flex h-2.5 w-2.5">
        {open && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-success animate-pulse-ring" />
        )}
        <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", open ? "bg-success" : "bg-foreground-subtle")} />
      </span>
      <span className="text-label font-medium text-foreground">{open ? "Open now" : "Closed"}</span>
      <span className="h-3 w-px bg-border-strong" />
      <span className="inline-flex items-center gap-1 text-label text-foreground-muted">
        <MapPin size={12} strokeWidth={2.25} />
        {distance}
      </span>
    </div>
  );
}
