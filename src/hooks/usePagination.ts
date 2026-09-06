// =============================================================================
// Happy Store — usePagination Hook
// =============================================================================

import { useState, useMemo, useCallback } from "react";

interface UsePaginationOptions {
  totalItems: number;
  pageSize?: number;
  initialPage?: number;
}

export function usePagination({
  totalItems,
  pageSize = 12,
  initialPage = 1,
}: UsePaginationOptions) {
  const [page, setPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize],
  );

  const goToPage = useCallback(
    (p: number) => setPage(Math.max(1, Math.min(p, totalPages))),
    [totalPages],
  );

  const nextPage = useCallback(() => goToPage(page + 1), [goToPage, page]);
  const prevPage = useCallback(() => goToPage(page - 1), [goToPage, page]);

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return {
    page,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
