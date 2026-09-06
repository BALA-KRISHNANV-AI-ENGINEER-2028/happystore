import { memo } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProximityChip } from "@/components/ui/proximity-chip";
import { cn } from "@/lib/utils";

export interface ShopCardProps {
  name: string;
  category: string;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  distance: string;
  open?: boolean;
  promoted?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ShopCard = memo(function ShopCard({
  name,
  category,
  coverImage,
  rating,
  reviewCount,
  distance,
  open = true,
  promoted,
  className,
  onClick,
}: ShopCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div className="relative h-36 w-full overflow-hidden bg-surface-sunken">
        {coverImage ? (
          <img
            src={coverImage}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-heading-md text-foreground-subtle">
            {name.charAt(0)}
          </div>
        )}
        {promoted && (
          <Badge tone="accent" className="absolute left-3 top-3">
            Promoted
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-body font-semibold text-foreground">{name}</h3>
            <p className="text-caption text-foreground-subtle">{category}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 pt-0.5">
            <Star size={13} className="fill-accent text-accent" />
            <span className="text-label font-medium text-foreground">{rating.toFixed(1)}</span>
            <span className="text-caption text-foreground-subtle">({reviewCount})</span>
          </div>
        </div>
        <ProximityChip distance={distance} open={open} className="w-fit" />
      </div>
    </Card>
  );
});
