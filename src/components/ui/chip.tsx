import { forwardRef, type ButtonHTMLAttributes } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  onRemove?: () => void;
}

/** A filter/category chip — toggleable, optionally dismissible. */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected = false, onRemove, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-label font-medium transition-colors duration-150",
          selected
            ? "border-primary bg-primary-soft text-primary-strong"
            : "border-border bg-surface text-foreground-muted hover:border-border-strong hover:text-foreground",
          className,
        )}
        {...props}
      >
        {children}
        {onRemove && (
          <span
            role="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="rounded-full p-0.5 hover:bg-black/5"
          >
            <X size={12} strokeWidth={2.5} />
          </span>
        )}
      </button>
    );
  },
);
Chip.displayName = "Chip";
