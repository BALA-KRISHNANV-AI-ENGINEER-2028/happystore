import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageList(page: number, totalPages: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  const add = (p: number | "ellipsis") => pages.push(p);
  const window = 1;

  add(1);
  if (page - window > 2) add("ellipsis");
  for (let p = Math.max(2, page - window); p <= Math.min(totalPages - 1, page + window); p++) {
    add(p);
  }
  if (page + window < totalPages - 1) add("ellipsis");
  if (totalPages > 1) add(totalPages);
  return pages;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  const pages = getPageList(page, totalPages);

  return (
    <nav className={cn("flex items-center gap-1", className)} aria-label="Pagination">
      <button
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground-muted transition-colors hover:bg-surface-sunken disabled:opacity-40"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className="flex h-9 w-9 items-center justify-center text-foreground-subtle">
            <MoreHorizontal size={16} />
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md text-label font-medium transition-colors",
              p === page
                ? "bg-primary text-foreground-on-primary"
                : "text-foreground-muted hover:bg-surface-sunken",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground-muted transition-colors hover:bg-surface-sunken disabled:opacity-40"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
