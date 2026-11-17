import PropTypes from "prop-types";
import "./Pagination.css";

export default function Pagination({
  page,
  limit,
  total,
  label,
  onPageChange,
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (pages === 1) return null;

  return (
    <nav className="pagination" aria-label={label}>
      <button
        type="button"
        className="button button-secondary"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="pagination-label">
        Page {page} of {pages}
      </span>
      <button
        type="button"
        className="button button-secondary"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
