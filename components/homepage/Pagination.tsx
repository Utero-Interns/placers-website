
import React from 'react';

const Pagination: React.FC = () => {
  const pages = [1, 2, 3, 4, 5];
  const currentPage = 1;

  return (
    <div className="mt-8 flex justify-center items-center space-x-2">
      <button className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer">
        Previous
      </button>
      {pages.map(page => (
        <button
          key={page}
          className={`px-4 py-2 text-sm border rounded-md cursor-pointer ${
            currentPage === page
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
      <button className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer">
        Next
      </button>
    </div>
  );
};

export default Pagination;
