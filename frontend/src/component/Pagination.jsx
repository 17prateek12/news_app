import React from 'react';

const PaginationComp = ({ currentPage, totalPages, onPageChange }) => {
  const renderPagination = () => {
    const paginationButtons = [];
    const maxPagesToShow = 4;
    const firstPage = 1;
    const lastPage = totalPages;

    if (currentPage > firstPage + maxPagesToShow) {
      paginationButtons.push(
        <button key={firstPage} onClick={() => onPageChange(firstPage)} className="mx-1 px-3 py-1 rounded-md bg-gray-200 text-gray-800">
          {firstPage}
        </button>
      );
      paginationButtons.push(<span key="dots1">...</span>);
    }

    for (let i = Math.max(currentPage - 2, firstPage); i <= Math.min(currentPage + 2, lastPage); i++) {
      paginationButtons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`mx-1 px-3 py-1 rounded-md ${currentPage === i ? 'bg-gray-400 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < lastPage - maxPagesToShow) {
      paginationButtons.push(<span key="dots2">...</span>);
      paginationButtons.push(
        <button key={lastPage} onClick={() => onPageChange(lastPage)} className="mx-1 px-3 py-1 rounded-md bg-gray-200 text-gray-800">
          {lastPage}
        </button>
      );
    }

    return paginationButtons;
  };

  return <div className="flex justify-center">{renderPagination()}</div>;
};

export {PaginationComp};