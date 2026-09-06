import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryCardProps {
  label: string;
  icon: LucideIcon;
  count?: number;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CategoryCard = memo(function CategoryCard({ label, icon: Icon, count, selected, className, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2.5 rounded-lg border p-4 text-center transition-colors duration-150",
        selected
          ? "border-primary bg-primary-soft"
          : "border-border bg-surface hover:border-border-strong hover:bg-surface-sunken",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full",
          selected ? "bg-primary text-foreground-on-primary" : "bg-surface-sunken text-primary",
        )}
      >
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-label font-medium text-foreground">{label}</p>
        {count !== undefined && <p className="text-caption text-foreground-subtle">{count} shops</p>}
      </div>
    </button>
  );
});
