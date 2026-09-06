// =============================================================================
// Happy Store — 500 Server Error Page
// =============================================================================

import { Link } from "react-router-dom";
import { ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServerErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error-soft text-error-strong">
        <ServerCrash size={28} />
      </div>
      <h1 className="font-display text-heading-lg font-semibold text-foreground">
        Something went wrong
      </h1>
      <p className="max-w-sm text-body-sm text-foreground-muted">
        An unexpected error occurred. Our team has been notified and is looking
        into it. Please try again in a few moments.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Reload page
        </Button>
        <Button variant="primary" asChild>
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}

export default ServerErrorPage;
