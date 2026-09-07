import { Fragment, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Drawer } from "vaul";
import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";
import { HappyStoreBag } from "@/components/brand/happy-store-logo";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: number;
}

export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

interface SidebarNavProps {
  groups: SidebarGroup[];
  onNavigate?: () => void;
}

function SidebarNav({ groups, onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
      {groups.map((group, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          {group.label && (
            <p className="px-2.5 pb-1.5 font-mono text-caption uppercase tracking-[0.1em] text-foreground-subtle">
              {group.label}
            </p>
          )}
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-soft text-primary-strong"
                    : "text-foreground-muted hover:bg-surface-sunken hover:text-foreground",
                )
              }
            >
              <item.icon size={17} strokeWidth={1.9} />
              <span className="flex-1">{item.label}</span>
              {!!item.badge && (
                <span className="rounded-full bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] font-semibold text-accent-strong">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}

function Brand({ label }: { label: string }) {
  return (
    <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-4">
      <HappyStoreBag size={30} />
      <div className="leading-tight">
        <p className="font-display text-body-sm font-bold tracking-tight text-foreground select-none">
          <span className="text-[#FF7A00]">Happy</span>
          <span>Store</span>
        </p>
        <p className="text-caption text-foreground-subtle">{label}</p>
      </div>
    </div>
  );
}

export interface SidebarProps {
  groups: SidebarGroup[];
  brandLabel: string;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  footer?: ReactNode;
}

/** Persistent sidebar on desktop (lg+), left-side drawer on smaller screens. */
export function Sidebar({ groups, brandLabel, mobileOpen, onMobileOpenChange, footer }: SidebarProps) {
  return (
    <Fragment>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <Brand label={brandLabel} />
        <SidebarNav groups={groups} />
        {footer && <div className="border-t border-border p-3">{footer}</div>}
      </aside>

      {/* Mobile / tablet drawer */}
      <Drawer.Root direction="left" open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
          <Drawer.Content className="fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col bg-surface shadow-lg outline-none lg:hidden">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2.5">
                <HappyStoreBag size={30} />
                <div className="leading-tight">
                  <p className="font-display text-body-sm font-bold tracking-tight text-foreground select-none">
                    <span className="text-[#FF7A00]">Happy</span>
                    <span>Store</span>
                  </p>
                  <p className="text-caption text-foreground-subtle">{brandLabel}</p>
                </div>
              </div>
              <button
                onClick={() => onMobileOpenChange(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-sunken"
              >
                <X size={16} />
              </button>
            </div>
            <SidebarNav groups={groups} onNavigate={() => onMobileOpenChange(false)} />
            {footer && <div className="border-t border-border p-3">{footer}</div>}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </Fragment>
  );
}
