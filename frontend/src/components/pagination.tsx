/**
 * Pagination stub for Major League GitHub
 *
 * This is a minimal stub to satisfy ui-kit persistent-pagination imports.
 * Major League GitHub doesn't use complex pagination patterns.
 */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Simple pagination implementation for Major League GitHub
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 py-4">
      <button
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Previous
      </button>

      <span className="px-3 py-1">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}