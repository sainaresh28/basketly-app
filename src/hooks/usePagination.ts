import { useEffect, useMemo, useState } from 'react';

export const DEFAULT_PAGE_SIZE = 10;

/**
 * Client-side pagination over an already-loaded array.
 * Clamps the current page whenever the source list shrinks (e.g. after a
 * delete or a search that narrows the result set) so users never land on
 * an empty trailing page.
 */
export function usePagination<T>(items: T[], pageSize: number = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paged = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, totalPages, pageSize]);

  return { page, setPage, totalPages, pageSize, paged, totalItems: items.length };
}
