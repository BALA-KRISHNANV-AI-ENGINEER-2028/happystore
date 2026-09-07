// =============================================================================
// Happy Store — 404 Not Found Page
// =============================================================================

import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HappyStoreLogo } from "@/components/brand/happy-store-logo";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <Link to="/" className="mb-2" aria-label="Happy Store Home">
        <HappyStoreLogo size={36} />
      </Link>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-sunken text-foreground-muted">
        <FileQuestion size={28} />
      </div>
      <h1 className="font-display text-heading-lg font-semibold text-foreground">
        Page not found
      </h1>
      <p className="max-w-sm text-body-sm text-foreground-muted">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Button variant="primary" asChild>
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
}

export default NotFoundPage;
