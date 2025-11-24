import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
      if (totalPages <= 1) return null;

      const renderPageNumbers = () => {
            const pageNumbers = [];
            if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) {
                        pageNumbers.push(i);
                  }
            } else {
                  if (currentPage <= 4) {
                        for (let i = 1; i <= 5; i++) pageNumbers.push(i);
                        pageNumbers.push('...');
                        pageNumbers.push(totalPages);
                  } else if (currentPage >= totalPages - 3) {
                        pageNumbers.push(1);
                        pageNumbers.push('...');
                        for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i);
                  } else {
                        pageNumbers.push(1);
                        pageNumbers.push('...');
                        pageNumbers.push(currentPage - 1);
                        pageNumbers.push(currentPage);
                        pageNumbers.push(currentPage + 1);
                        pageNumbers.push('...');
                        pageNumbers.push(totalPages);
                  }
            }
            return pageNumbers;
      };

      return (
            <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                        Previous
                  </button>

                  {renderPageNumbers().map((page, index) => (
                        <button
                              key={index}
                              onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                              disabled={page === '...'}
                              className={`px-3 py-1 rounded-md border ${page === currentPage
                                          ? 'bg-red-500 text-white border-red-500'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    } ${page === '...' ? 'cursor-default' : ''}`}
                        >
                              {page}
                        </button>
                  ))}

                  <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                        Next
                  </button>
            </div>
      );
}

export default Pagination;
