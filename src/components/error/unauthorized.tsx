// =============================================================================
// Happy Store — 401/403 Unauthorized Page
// =============================================================================

import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error-soft text-error-strong">
        <ShieldAlert size={28} />
      </div>
      <h1 className="font-display text-heading-lg font-semibold text-foreground">
        Access denied
      </h1>
      <p className="max-w-sm text-body-sm text-foreground-muted">
        You don't have permission to view this page. Please sign in with an
        authorized account or go back.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" asChild>
          <Link to="/">Go home</Link>
        </Button>
        <Button variant="primary" asChild>
          <Link to="/login">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
