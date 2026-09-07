import { type SVGProps } from "react";
import { cn } from "@/lib/utils";

export interface HappyStoreBagProps extends SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/**
 * Official Happy Store Brand Mark (Bag with Smile)
 *
 * Visual specifications:
 * - Color: Warm Vibrant Orange (#FF7A00)
 * - Cheerful Smile: Crisp White cutout (#FFFFFF)
 * - Transparent background (no bounding box/rectangle in light or dark mode)
 * - Works identically across both light and dark themes
 */
export function HappyStoreBag({
  size = 32,
  className,
  ...props
}: HappyStoreBagProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-transform duration-200 select-none", className)}
      aria-hidden="true"
      {...props}
    >
      {/* Arched Top Handle */}
      <path
        d="M 34 34 V 22 C 34 13.16 41.16 6 50 6 C 58.84 6 66 13.16 66 22 V 34"
        stroke="#FF7A00"
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bag Body */}
      <path
        d="M 23 34 H 77 C 81.4 34 85 37.2 85.7 41.5 L 90.7 72.5 C 91.8 79.5 86.4 86 79.3 86 H 20.7 C 13.6 86 8.2 79.5 9.3 72.5 L 14.3 41.5 C 15 37.2 18.6 34 23 34 Z"
        fill="#FF7A00"
      />

      {/* Cheerful White Smile Cutout */}
      <path
        d="M 33 56 C 38 69.5 62 69.5 67 56"
        stroke="#FFFFFF"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Alias for semantic clarity
export const HappyStoreIcon = HappyStoreBag;

export interface HappyStoreLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
  iconClassName?: string;
}

/**
 * Official Happy Store Brand Lockup (Icon + Wordmark)
 *
 * Matches official brand guidelines:
 * - Orange Bag with white smile
 * - "Happy" in vibrant brand orange (#FF7A00)
 * - "Store" in high-contrast dark charcoal in light mode, pure white in dark mode
 * - Transparent background
 */
export function HappyStoreLogo({
  size = 32,
  className,
  showText = true,
  textClassName,
  iconClassName,
}: HappyStoreLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <HappyStoreBag size={size} className={iconClassName} />
      {showText && (
        <span
          className={cn(
            "font-display tracking-tight font-bold leading-none text-body-lg sm:text-heading-sm select-none transition-colors duration-200",
            textClassName,
          )}
        >
          <span className="text-[#FF7A00]">Happy</span>
          <span className="text-foreground">Store</span>
        </span>
      )}
    </div>
  );
}
