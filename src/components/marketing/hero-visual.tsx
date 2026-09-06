import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import { ProximityChip } from "@/components/ui/proximity-chip";
import { Avatar } from "@/components/ui/avatar";

const float = (delay: number) => ({
  animate: { y: [0, -10, 0] },
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay },
});

/** Abstract hero visual: floating product-UI moments over a soft gradient
 *  field, instead of stock photography or literal map illustrations. */
export function HeroVisual() {
  return (
    <div className="relative mx-auto flex h-[420px] w-full max-w-md items-center justify-center sm:h-[480px]">
      {/* Ambient gradient field */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[2rem]"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 20%, var(--color-primary-soft) 0%, transparent 70%), radial-gradient(50% 50% at 75% 70%, var(--color-accent-soft) 0%, transparent 70%)",
        }}
      />

      {/* Central shop card */}
      <div className="relative z-10 w-64 rounded-xl border border-border bg-surface p-4 shadow-lg">
        <div className="mb-3 h-28 w-full rounded-lg bg-surface-sunken" />
        <p className="font-display text-body-sm font-semibold text-foreground">Rivera Bakery</p>
        <p className="mb-2 text-caption text-foreground-subtle">Bakery · Cafe</p>
        <ProximityChip distance="0.3 mi" />
      </div>

      {/* Floating rating card */}
      <motion.div
        {...float(0)}
        className="absolute left-2 top-6 z-20 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 shadow-md sm:left-0"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
          <Star size={14} className="fill-accent-strong" />
        </div>
        <div>
          <p className="text-label font-semibold text-foreground">4.8 rating</p>
          <p className="text-caption text-foreground-subtle">212 reviews</p>
        </div>
      </motion.div>

      {/* Floating delivery card */}
      <motion.div
        {...float(1.2)}
        className="absolute bottom-10 right-0 z-20 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 shadow-md sm:-right-4"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-soft text-success-600">
          <TrendingUp size={14} />
        </div>
        <div>
          <p className="text-label font-semibold text-foreground">+38% this week</p>
          <p className="text-caption text-foreground-subtle">Local sales</p>
        </div>
      </motion.div>

      {/* Floating avatar cluster (social proof) */}
      <motion.div
        {...float(0.6)}
        className="absolute -bottom-2 left-4 z-20 flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-3 shadow-md sm:left-8"
      >
        <div className="flex -space-x-2">
          <Avatar fallback="AL" size="sm" className="ring-2 ring-surface" />
          <Avatar fallback="MT" size="sm" className="ring-2 ring-surface" />
          <Avatar fallback="PS" size="sm" className="ring-2 ring-surface" />
        </div>
        <span className="text-label font-medium text-foreground">12k+ neighbors</span>
      </motion.div>
    </div>
  );
}
