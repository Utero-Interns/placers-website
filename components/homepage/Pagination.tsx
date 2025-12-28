import React from 'react';

interface PaginationProps {
  totalData: number;
  itemsPerPage?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalData,
  itemsPerPage = 8,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalData / itemsPerPage);

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div className="mt-8 flex justify-center items-center gap-8">
      {/* Previous */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`font-semibold text-sm ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-black hover:text-gray-700'
        }`}
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex gap-3">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            disabled={page === currentPage}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
              page === currentPage
                ? 'bg-[#D12027] text-white cursor-default'
                : 'text-black hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`font-semibold text-sm ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-black hover:text-gray-700'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;