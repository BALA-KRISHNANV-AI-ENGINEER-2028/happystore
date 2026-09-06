import { Toaster as SonnerToaster } from "sonner";

/** Themed wrapper around sonner — mount once near the app root. */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "rounded-lg border border-border bg-surface shadow-lg text-foreground font-sans text-body-sm",
          title: "font-medium",
          description: "text-foreground-muted",
          actionButton: "bg-primary text-foreground-on-primary",
          cancelButton: "bg-surface-sunken text-foreground-muted",
          success: "border-l-4 border-l-success",
          error: "border-l-4 border-l-error",
          warning: "border-l-4 border-l-warning",
          info: "border-l-4 border-l-info",
        },
      }}
    />
  );
}

export { toast } from "sonner";
