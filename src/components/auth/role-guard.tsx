// =============================================================================
// Happy Store — Role Guard
// Checks the user's role and renders either the children or a 403 fallback.
// =============================================================================

import { Outlet } from "react-router-dom";
import type { UserRole } from "@/types";
import { useAppSelector } from "@/store";
import { UnauthorizedPage } from "@/components/error/unauthorized";

interface RoleGuardProps {
  /** Required role(s). If the user's role is not in this list, show 403. */
  roles: UserRole[];
}

export function RoleGuard({ roles }: RoleGuardProps) {
  const userRole = useAppSelector((s) => s.auth.role);

  if (!userRole || !roles.includes(userRole)) {
    return <UnauthorizedPage />;
  }

  return <Outlet />;
}
