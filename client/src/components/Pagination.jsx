import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} />
      </button>

      {startPage > 1 && (
        <>
          <button className="pagination-btn" onClick={() => onPageChange(1)}>
            1
          </button>
          {startPage > 2 && <span style={{ padding: '0 0.25rem', color: 'var(--text-subtle)' }}>...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          className={`pagination-btn ${p === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span style={{ padding: '0 0.25rem', color: 'var(--text-subtle)' }}>...</span>}
          <button className="pagination-btn" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next Page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
