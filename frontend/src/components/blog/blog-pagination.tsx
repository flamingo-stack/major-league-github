/**
 * Blog Pagination stub for Major League GitHub
 *
 * This is a minimal stub to satisfy ui-kit persistent-pagination imports.
 * Major League GitHub doesn't currently have a blog, but this satisfies
 * the import requirements.
 */

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
  // Blog-specific pagination implementation stub
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 py-6">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange?.(currentPage - 1)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Previous Posts
        </button>
      )}

      <div className="flex items-center gap-2">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange?.(page)}
              className={`w-8 h-8 rounded ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange?.(currentPage + 1)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Next Posts →
        </button>
      )}
    </div>
  );
}