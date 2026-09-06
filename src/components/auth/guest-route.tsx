// =============================================================================
// Happy Store — Guest Route
// Wraps auth pages (login, register, etc.). Redirects already-authenticated
// users to /home to prevent re-login.
// =============================================================================

import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store";
import { ROUTES } from "@/constants";
import { RouteSkeleton } from "@/components/layout/route-skeleton";

export function GuestRoute() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const isInitialized = useAppSelector((s) => s.auth.isInitialized);

  // Wait for the initial silent-session check before deciding, otherwise a
  // returning authenticated user briefly flashes the login form.
  if (!isInitialized) {
    return <div className="p-6"><RouteSkeleton /></div>;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
