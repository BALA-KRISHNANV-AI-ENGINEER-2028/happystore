import { Moon, Sun, MapPin } from "lucide-react";
import { HappyStoreLogo } from "@/components/brand/happy-store-logo";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

function ThemeToggle() {
  const { resolvedTheme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground-muted transition-colors duration-150 hover:text-foreground hover:border-border-strong"
    >
      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="mb-2 font-mono text-caption uppercase tracking-[0.14em] text-foreground-subtle">
        {eyebrow}
      </p>
      <h2 className="text-heading-md text-foreground">{title}</h2>
      {description && (
        <p className="mt-2 text-body-sm text-foreground-muted">
          {description}
        </p>
      )}
    </div>
  );
}

function Swatch({
  name,
  varName,
  className,
  foreground = "text-white",
}: {
  name: string;
  varName: string;
  className: string;
  foreground?: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border">
      <div className={cn("flex h-16 items-end p-2.5", className, foreground)}>
        <span className="text-label font-medium opacity-90">{name}</span>
      </div>
      <div className="bg-surface px-2.5 py-2">
        <p className="font-mono text-caption text-foreground-subtle">
          {varName}
        </p>
      </div>
    </div>
  );
}

function TypeRow({
  label,
  sizeClass,
  sample,
  font = "font-display",
}: {
  label: string;
  sizeClass: string;
  sample: string;
  font?: string;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-border py-5 last:border-0 sm:flex-row sm:items-baseline sm:gap-6">
      <span className="w-32 shrink-0 font-mono text-caption text-foreground-subtle">
        {label}
      </span>
      <p className={cn(font, sizeClass, "text-foreground")}>{sample}</p>
    </div>
  );
}

function RadiusSample({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("h-16 w-16 border-2 border-primary bg-primary-soft", className)} />
      <span className="font-mono text-caption text-foreground-subtle">{label}</span>
    </div>
  );
}

function ShadowSample({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg bg-surface-sunken p-6">
      <div className={cn("h-14 w-24 rounded-md bg-surface", className)} />
      <span className="font-mono text-caption text-foreground-subtle">{label}</span>
    </div>
  );
}

/** The signature element: a live "open now" proximity chip, used across shop
 *  and product cards to encode Happy Store's core idea — nearby, live, local. */
function ProximityChip() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface py-1.5 pl-2 pr-3.5 shadow-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-success animate-pulse-ring" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
      </span>
      <span className="text-label font-medium text-foreground">Open now</span>
      <span className="h-3 w-px bg-border-strong" />
      <span className="inline-flex items-center gap-1 text-label text-foreground-muted">
        <MapPin size={12} strokeWidth={2.25} />
        0.4 mi
      </span>
    </div>
  );
}

export default function DesignTokensPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <HappyStoreLogo size={32} />
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14">
        {/* Intro */}
        <div className="mb-16">
          <p className="mb-3 font-mono text-caption uppercase tracking-[0.14em] text-accent-strong">
            Phase 1 · Design tokens &amp; theme
          </p>
          <h1 className="max-w-xl font-display text-display-sm font-semibold leading-tight text-foreground">
            Discover local.
            <br />
            Shop smarter.
          </h1>
          <p className="mt-4 max-w-md text-body text-foreground-muted">
            The foundation for Happy Store's interface — a calm, trustworthy
            palette drawn from the neighborhood storefront, paired with a
            considered type and elevation system.
          </p>
          <div className="mt-6">
            <ProximityChip />
          </div>
        </div>

        {/* Color: Brand */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="Color · 01"
            title="Brand"
            description="Pine communicates trust and grounding; marigold is reserved for calls to action, offers, and moments that need warmth."
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Swatch name="Pine 600" varName="--primary" className="bg-primary" />
            <Swatch name="Pine 700" varName="--primary-strong" className="bg-primary-strong" />
            <Swatch
              name="Pine 50"
              varName="--primary-soft"
              className="bg-primary-soft"
              foreground="text-primary-strong"
            />
            <Swatch name="Marigold 400" varName="--accent" className="bg-accent" foreground="text-foreground-on-accent" />
          </div>
        </section>

        {/* Color: Semantic */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="Color · 02"
            title="Semantic states"
            description="Feedback colors used consistently across orders, inventory, and system messaging."
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Swatch name="Success" varName="--success" className="bg-success" />
            <Swatch name="Warning" varName="--warning" className="bg-warning" />
            <Swatch name="Error" varName="--error" className="bg-error" />
            <Swatch name="Info" varName="--info" className="bg-info" />
          </div>
        </section>

        {/* Color: Neutrals */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="Color · 03"
            title="Surfaces &amp; neutrals"
            description="Warm-tinted neutrals — never pure black or gray — for backgrounds, borders, and text."
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Swatch
              name="Background"
              varName="--background"
              className="bg-background border-b border-border"
              foreground="text-foreground"
            />
            <Swatch
              name="Surface"
              varName="--surface"
              className="bg-surface"
              foreground="text-foreground"
            />
            <Swatch
              name="Border"
              varName="--border-strong"
              className="bg-border-strong"
              foreground="text-foreground"
            />
            <Swatch name="Foreground" varName="--foreground" className="bg-foreground" foreground="text-background" />
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="Typography"
            title="Type scale"
            description="Space Grotesk for display moments, Inter for interface text, IBM Plex Mono for prices, order codes, and data."
          />
          <div className="rounded-lg border border-border bg-surface px-5">
            <TypeRow label="display-lg / 60" sizeClass="text-display-lg" sample="Nearby shops" />
            <TypeRow label="display-sm / 44" sizeClass="text-display-sm" sample="Fresh from your block" />
            <TypeRow label="heading-lg / 36" sizeClass="text-heading-lg" sample="Trending this week" />
            <TypeRow label="heading-md / 28" sizeClass="text-heading-md" sample="Special offers" />
            <TypeRow label="heading-sm / 22" sizeClass="text-heading-sm" sample="Order #ES-10482" />
            <TypeRow
              label="body-lg / 18"
              sizeClass="text-body-lg"
              sample="Everything you need, three blocks away."
              font="font-sans"
            />
            <TypeRow
              label="body / 16"
              sizeClass="text-body"
              sample="Compare prices across local stores before you buy."
              font="font-sans"
            />
            <TypeRow
              label="body-sm / 14"
              sizeClass="text-body-sm"
              sample="Delivered in 22 minutes by Corner Market."
              font="font-sans"
            />
            <TypeRow label="label / 13" sizeClass="text-label" sample="PICKUP · 2 ITEMS · $18.40" font="font-mono" />
            <TypeRow label="caption / 12" sizeClass="text-caption" sample="Updated 3 minutes ago" font="font-mono" />
          </div>
        </section>

        {/* Radius */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="Shape"
            title="Radius scale"
            description="Tighter radii for structure and controls, fuller radii reserved for chips and avatars."
          />
          <div className="flex flex-wrap gap-6">
            <RadiusSample label="sm · 6px" className="rounded-sm" />
            <RadiusSample label="md · 10px" className="rounded-md" />
            <RadiusSample label="lg · 14px" className="rounded-lg" />
            <RadiusSample label="xl · 20px" className="rounded-xl" />
            <RadiusSample label="full" className="rounded-full" />
          </div>
        </section>

        {/* Shadows */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="Elevation"
            title="Shadow scale"
            description="Soft, pine-tinted ambient shadows. Never a hard black drop shadow."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ShadowSample label="shadow-sm" className="shadow-sm" />
            <ShadowSample label="shadow-md" className="shadow-md" />
            <ShadowSample label="shadow-lg" className="shadow-lg" />
          </div>
        </section>

        {/* Motion */}
        <section>
          <SectionHeading
            eyebrow="Motion"
            title="Signature: proximity pulse"
            description="A quiet, recurring signal used throughout the product — on shop cards, order tracking, and the map view — to represent 'live and nearby'."
          />
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-surface p-6">
            <ProximityChip />
            <ProximityChip />
            <ProximityChip />
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <p className="mx-auto max-w-5xl px-6 font-mono text-caption text-foreground-subtle">
          Happy Store design system — Phase 1 of 13
        </p>
      </footer>
    </div>
  );
}
