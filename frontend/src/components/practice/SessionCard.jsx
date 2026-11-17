import PropTypes from "prop-types";
import { capitalize, formatDay } from "../../utils/format.js";
import { sessionShape } from "../../utils/propShapes.js";
import "./SessionCard.css";

export default function SessionCard({ session, onEdit, onDelete }) {
  return (
    <article className="session-card" data-confidence={session.confidence}>
      <div className="session-card-header">
        <h3>{session.question}</h3>
        <span className="badge session-card-confidence">
          Confidence {session.confidence} / 5
        </span>
      </div>
      <p className="session-card-meta">
        {capitalize(session.topic)} · {session.minutes} min ·{" "}
        {formatDay(session.practicedOn)}
      </p>
      {session.notes && <p className="session-card-notes">{session.notes}</p>}
      <div className="form-actions">
        <button
          type="button"
          className="button button-small button-secondary"
          onClick={onEdit}
          aria-label={`Edit: ${session.question}`}
        >
          Edit
        </button>
        <button
          type="button"
          className="button button-small button-danger"
          onClick={onDelete}
          aria-label={`Delete: ${session.question}`}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

SessionCard.propTypes = {
  session: sessionShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
