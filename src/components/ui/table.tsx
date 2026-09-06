import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border">
      <table className={cn("w-full caption-bottom text-body-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return <thead className={cn("bg-surface-sunken", className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return <tr className={cn("transition-colors hover:bg-surface-sunken/60", className)} {...props} />;
}

export function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-11 px-4 text-left align-middle text-label font-medium text-foreground-muted first:pl-5 last:pr-5",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn("px-4 py-3 align-middle text-foreground first:pl-5 last:pr-5", className)}
      {...props}
    />
  );
}
