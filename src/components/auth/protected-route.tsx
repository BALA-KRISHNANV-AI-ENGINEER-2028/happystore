// =============================================================================
// Happy Store — Protected Route
// Wraps routes that require authentication. Redirects to /login with a
// returnTo param so the user lands back after signing in.
// =============================================================================

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store";
import { ROUTES } from "@/constants";
import { RouteSkeleton } from "@/components/layout/route-skeleton";

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const isInitialized = useAppSelector((s) => s.auth.isInitialized);
  const location = useLocation();

  // Wait for the initial silent-session check (session-provider.tsx) to
  // settle before deciding — otherwise a still-valid session gets bounced
  // to /login while its refresh call is in flight.
  if (!isInitialized) {
    return <div className="p-6"><RouteSkeleton /></div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`${ROUTES.LOGIN}?returnTo=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <Outlet />;
}
