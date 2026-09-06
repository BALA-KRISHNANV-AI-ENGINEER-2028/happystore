import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { RouteSkeleton } from "@/components/layout/route-skeleton";

/** Responsive shell for every customer-facing page: top nav + content + mobile tab bar. */
export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl px-4 pb-20 pt-6 sm:px-6 md:pb-10">
        <Suspense fallback={<RouteSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <MobileTabBar />
    </div>
  );
}
