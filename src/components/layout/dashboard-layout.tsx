import { Suspense, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, Moon, Sun } from "lucide-react";
import { Sidebar, type SidebarGroup } from "@/components/layout/sidebar";
import { RouteSkeleton } from "@/components/layout/route-skeleton";
import { Avatar } from "@/components/ui/avatar";
import { useTheme } from "@/lib/theme";

export interface DashboardLayoutProps {
  groups: SidebarGroup[];
  brandLabel: string;
}

function useActivePageTitle(groups: SidebarGroup[]) {
  const { pathname } = useLocation();
  for (const group of groups) {
    for (const item of group.items) {
      const isActive = item.to === "/" ? pathname === item.to : pathname.startsWith(item.to);
      if (isActive) return item.label;
    }
  }
  return "Overview";
}

/** Shared shell for the Shop Owner and Admin dashboards (Phases 12 &amp; 13). */
export function DashboardLayout({ groups, brandLabel }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolvedTheme, toggle } = useTheme();
  const pageTitle = useActivePageTitle(groups);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        groups={groups}
        brandLabel={brandLabel}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-sunken lg:hidden"
          >
            <Menu size={18} />
          </button>
          <h1 className="font-display text-body-lg font-semibold text-foreground">{pageTitle}</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle color theme"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground-muted hover:bg-surface-sunken"
            >
              {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Avatar fallback="JR" size="sm" />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6">
          <Suspense fallback={<RouteSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
