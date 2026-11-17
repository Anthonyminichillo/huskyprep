import PropTypes from "prop-types";
import { capitalize, formatDate } from "../../utils/format.js";
import { experienceShape } from "../../utils/propShapes.js";
import "./ExperienceCard.css";

export default function ExperienceCard({
  experience,
  isOwner,
  onEdit,
  onDelete,
}) {
  const label = `${experience.company} ${experience.role}`;
  return (
    <article className="experience-card" data-outcome={experience.outcome}>
      <div className="experience-card-header">
        <div>
          <h3>{experience.company}</h3>
          <p className="experience-card-role">
            {experience.role} · {experience.coopCycle}
          </p>
        </div>
        <div className="experience-card-badges">
          <span
            className={`badge experience-outcome-${experience.outcome.replace(" ", "-")}`}
          >
            {capitalize(experience.outcome)}
          </span>
          <span
            className={`badge experience-difficulty-${experience.difficulty}`}
          >
            {capitalize(experience.difficulty)}
          </span>
        </div>
      </div>
      <p className="experience-card-meta">
        {experience.rounds} round{experience.rounds === 1 ? "" : "s"} ·{" "}
        {capitalize(experience.format)} · {capitalize(experience.roleType)}
      </p>
      <h4 className="experience-card-subtitle">Questions asked</h4>
      <ul className="experience-card-questions">
        {experience.questions.map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
      {experience.tips && (
        <p className="experience-card-tips">
          <strong>Tip:</strong> {experience.tips}
        </p>
      )}
      <p className="experience-card-footnote">
        Shared by {experience.authorName} on {formatDate(experience.createdAt)}
      </p>
      {isOwner && (
        <div className="form-actions">
          <button
            type="button"
            className="button button-small button-secondary"
            onClick={onEdit}
            aria-label={`Edit: ${label}`}
          >
            Edit
          </button>
          <button
            type="button"
            className="button button-small button-danger"
            onClick={onDelete}
            aria-label={`Delete: ${label}`}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}

ExperienceCard.propTypes = {
  experience: experienceShape.isRequired,
  isOwner: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
