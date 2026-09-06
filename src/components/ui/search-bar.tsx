import { Search, X } from "lucide-react";
import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onClear, value, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center", className)}>
        <Search size={16} className="pointer-events-none absolute left-3.5 text-foreground-subtle" />
        <input
          ref={ref}
          value={value}
          className={cn(
            "h-11 w-full rounded-full border border-border-strong bg-surface pl-10 pr-9 text-body-sm text-foreground placeholder:text-foreground-subtle",
            "focus-visible:outline-none focus-visible:border-primary",
          )}
          {...props}
        />
        {onClear && value ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full text-foreground-subtle hover:text-foreground"
          >
            <X size={14} />
          </button>
        ) : null}
      </div>
    );
  },
);
SearchBar.displayName = "SearchBar";
