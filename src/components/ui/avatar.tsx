import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 overflow-hidden rounded-full bg-surface-sunken",
  {
    variants: {
      size: {
        sm: "h-7 w-7",
        md: "h-9 w-9",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback: string;
  className?: string;
  /** Shows the signature live/open presence dot. */
  presence?: "online" | "offline";
}

export function Avatar({ src, alt, fallback, size, className, presence }: AvatarProps) {
  return (
    <span className="relative inline-flex">
      <AvatarPrimitive.Root className={cn(avatarVariants({ size }), className)}>
        <AvatarPrimitive.Image src={src} alt={alt} className="h-full w-full object-cover" />
        <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center font-display text-label font-semibold text-foreground-muted">
          {fallback}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {presence && (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface",
            presence === "online" ? "bg-success" : "bg-border-strong",
          )}
        />
      )}
    </span>
  );
}
