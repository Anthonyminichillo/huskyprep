import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import "./ConfirmDialog.css";

// Uses the native <dialog> element so focus and Escape work without extra code.
export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  const dialogRef = useRef(null);
  const open = Boolean(message);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} className="confirm-dialog" onCancel={onCancel}>
      <p>{message}</p>
      <div className="form-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="button button-danger"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </dialog>
  );
}

ConfirmDialog.propTypes = {
  message: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
