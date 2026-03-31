import "./Pagination.scss";

/**
 * Pagination
 *
 * Props:
 *   currentPage   {number}    - The currently active page (1-based)
 *   totalPages    {number}    - Total number of pages
 *   onPageChange  {function}  - Called with the new page number
 *   siblingCount  {number}    - How many page numbers to show on each side of current (default 1)
 *   isLoading     {boolean}   - Shows pagination skeleton while data is loading
 */

const range = (start, end) => {
  const len = end - start + 1;
  return Array.from({ length: len }, (_, i) => start + i);
};

const buildPages = (current, total, siblings = 1) => {
  const totalPageNumbers = siblings * 2 + 5;

  if (total <= totalPageNumbers) {
    return range(1, total);
  }

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;

  if (!showLeftDots && showRightDots) {
    const leftRange = range(1, 3 + siblings * 2);
    return [...leftRange, "...", total];
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = range(total - (2 + siblings * 2), total);
    return [1, "...", ...rightRange];
  }

  const middleRange = range(leftSibling, rightSibling);
  return [1, "...", ...middleRange, "...", total];
};

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <nav className="pagination" aria-label="Pagination loading">
        <div className="pagination__bar pagination__bar--bottom pagination__bar--loading">
          <span className="pagination__skeleton pagination__skeleton--meta" />
          <span className="pagination__skeleton pagination__skeleton--pill" />
          <div className="pagination__pages" aria-hidden="true">
            <span className="pagination__skeleton pagination__skeleton--page" />
            <span className="pagination__skeleton pagination__skeleton--page" />
            <span className="pagination__skeleton pagination__skeleton--page" />
          </div>
          <span className="pagination__skeleton pagination__skeleton--pill" />
        </div>
      </nav>
    );
  }

  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages, siblingCount);

  const handleClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange?.(page);
    }
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      <div className="pagination__bar pagination__bar--bottom">
        <span className="pagination__meta">
          Page <strong>{currentPage}</strong> of {totalPages}
        </span>

        <button
          className="pagination__prev-btn"
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="19 12 5 12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Previous
        </button>

        <div className="pagination__pages" aria-label="Page numbers">
          {pages.map((page, idx) =>
            page === "..." ? (
              <span key={`dot-${idx}`} className="pagination__dots">
                &hellip;
              </span>
            ) : (
              <button
                key={page}
                className={`pagination__page${page === currentPage ? " pagination__page--active" : ""}`}
                onClick={() => handleClick(page)}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          className="pagination__next-btn"
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5 12 19 12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
