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

  if (totalPages <= 1) {
    return (
      <div className="mt-8 flex justify-center items-center space-x-8 text-sm font-semibold text-gray-400">
        <button disabled>Previous</button>
        <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#D12027] text-white">
          1
        </span>
        <button disabled>Next</button>
      </div>
    );
  }

  return (
    <div className="mt-8 flex justify-center items-center space-x-8">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`font-semibold text-sm ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-black hover:text-gray-700'
        }`}
      >
        Previous
      </button>

      <div className="flex space-x-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
              currentPage === page
                ? 'bg-[#D12027] text-white'
                : 'text-black hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
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