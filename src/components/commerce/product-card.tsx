import { Heart, Plus } from "lucide-react";
import { useState, memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  name: string;
  shopName: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  unit?: string;
  outOfStock?: boolean;
  className?: string;
  onAdd?: () => void;
  onClick?: () => void;
  /** Controlled wishlist state — omit to let the card manage it internally. */
  saved?: boolean;
  onToggleSave?: (saved: boolean) => void;
}

export const ProductCard = memo(function ProductCard({
  name,
  shopName,
  price,
  compareAtPrice,
  image,
  unit,
  outOfStock,
  className,
  onAdd,
  onClick,
  saved: savedProp,
  onToggleSave,
}: ProductCardProps) {
  const [savedState, setSavedState] = useState(false);
  const isControlled = savedProp !== undefined;
  const saved = isControlled ? savedProp : savedState;

  function toggleSave() {
    const next = !saved;
    if (!isControlled) setSavedState(next);
    onToggleSave?.(next);
  }

  const onSale = compareAtPrice && compareAtPrice > price;

  return (
    <Card
      onClick={onClick}
      className={cn("flex flex-col overflow-hidden", onClick && "cursor-pointer", className)}
    >
      <div className="relative h-32 w-full bg-surface-sunken">
        {image ? (
          <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-caption text-foreground-subtle">
            No image
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSave();
          }}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-surface/90 text-foreground-muted shadow-sm backdrop-blur transition-colors hover:text-error"
        >
          <Heart size={14} className={cn(saved && "fill-error text-error")} />
        </button>
        {onSale && (
          <Badge tone="error" className="absolute left-2 top-2">
            Sale
          </Badge>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/70 backdrop-blur-[1px]">
            <Badge tone="neutral">Out of stock</Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <p className="line-clamp-1 text-body-sm font-medium text-foreground">{name}</p>
        <p className="line-clamp-1 text-caption text-foreground-subtle">{shopName}</p>
        <div className="mt-1 flex items-end justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-body-sm font-medium text-foreground">
              ${price.toFixed(2)}
            </span>
            {onSale && (
              <span className="font-mono text-caption text-foreground-subtle line-through">
                ${compareAtPrice!.toFixed(2)}
              </span>
            )}
            {unit && <span className="text-caption text-foreground-subtle">/{unit}</span>}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd?.();
            }}
            disabled={outOfStock}
            aria-label={`Add ${name} to cart`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-foreground-on-primary transition-transform hover:scale-105 disabled:opacity-40"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
});
