import React from "react";

function Pagination({ page, pages, onPage }) {
  if (!pages || pages <= 1) return null;
  const candidates = new Set(
    [1, pages, page - 2, page - 1, page, page + 1, page + 2].filter(
      (n) => n >= 1 && n <= pages
    )
  );
  const items = [...candidates].sort((a, b) => a - b);
  const buttons = [];
  let prev = 0;
  items.forEach((n) => {
    if (n - prev > 1) buttons.push("...");
    buttons.push(n);
    prev = n;
  });

  return (
    <div className="pagination-bar">
      <button
        className="page-btn"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        aria-label="Previous page"
      >
        <i className="bi bi-chevron-left"></i> Prev
      </button>
      {buttons.map((b, i) =>
        typeof b === "number" ? (
          <button
            key={i}
            className={`page-btn ${b === page ? "active" : ""}`}
            onClick={() => onPage(b)}
          >
            {b}
          </button>
        ) : (
          <span key={"e" + i} className="page-ellipsis">
            …
          </span>
        )
      )}
      <button
        className="page-btn"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
        aria-label="Next page"
      >
        Next <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
}

export default Pagination;