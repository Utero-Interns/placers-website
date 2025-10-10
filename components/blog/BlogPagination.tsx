interface BlogPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BlogPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="flex items-center space-x-3 font-semibold">
      {/* Previous */}
      <button
        className={`px-2 py-1 text-base ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-black"
        }`}
        disabled={currentPage === 1}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-md text-base flex items-center justify-center transition font-semibold
            ${
              currentPage === page
                ? "bg-red-600 text-white"
                : "text-black hover:bg-red-50"
            }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        className={`px-2 py-1 text-base font-semibold ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-black"
        }`}
        disabled={currentPage === totalPages}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </nav>
  )
}
