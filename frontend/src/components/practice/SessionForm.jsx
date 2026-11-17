import PropTypes from "prop-types";
import { useState } from "react";
import { saveSession } from "../../api/sessionsApi.js";
import { capitalize, todayString } from "../../utils/format.js";
import { metaShape, sessionShape } from "../../utils/propShapes.js";
import "./SessionForm.css";

function initialValues(session) {
  if (!session) {
    return {
      topic: "",
      question: "",
      minutes: "30",
      confidence: "3",
      practicedOn: todayString(),
      notes: "",
    };
  }
  return {
    ...session,
    minutes: String(session.minutes),
    confidence: String(session.confidence),
    notes: session.notes || "",
  };
}

export default function SessionForm({ meta, editing, onSaved, onCancel }) {
  const [values, setValues] = useState(() => initialValues(editing));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage("");
    const payload = {
      topic: values.topic,
      question: values.question,
      minutes: Number(values.minutes),
      confidence: Number(values.confidence),
      practicedOn: values.practicedOn,
      notes: values.notes,
    };
    try {
      const saved = await saveSession(editing?._id, payload);
      onSaved(saved, Boolean(editing));
      if (!editing) setValues(initialValues(null));
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  const invalid = (field) => (errors[field] ? "true" : undefined);
  const error = (field) =>
    errors[field] && <p className="field-error">{errors[field]}</p>;

  return (
    <section
      className="panel session-form"
      aria-labelledby="session-form-title"
    >
      <h2 id="session-form-title">
        {editing ? "Edit session" : "Log a practice session"}
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="session-topic">Topic</label>
          <select
            id="session-topic"
            name="topic"
            value={values.topic}
            onChange={handleChange}
            aria-invalid={invalid("topic")}
            required
          >
            <option value="">Choose…</option>
            {meta.topics.map((topic) => (
              <option key={topic} value={topic}>
                {capitalize(topic)}
              </option>
            ))}
          </select>
          {error("topic")}
        </div>
        <div className="field">
          <label htmlFor="session-question">Question or problem</label>
          <input
            id="session-question"
            name="question"
            type="text"
            value={values.question}
            onChange={handleChange}
            aria-invalid={invalid("question")}
            placeholder="Two sum"
            required
          />
          {error("question")}
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="session-minutes">Minutes</label>
            <input
              id="session-minutes"
              name="minutes"
              type="number"
              min="1"
              max="600"
              value={values.minutes}
              onChange={handleChange}
              aria-invalid={invalid("minutes")}
              required
            />
            {error("minutes")}
          </div>
          <div className="field">
            <label htmlFor="session-date">Date</label>
            <input
              id="session-date"
              name="practicedOn"
              type="date"
              value={values.practicedOn}
              onChange={handleChange}
              aria-invalid={invalid("practicedOn")}
              required
            />
            {error("practicedOn")}
          </div>
        </div>
        <fieldset className="field">
          <legend>How confident do you feel?</legend>
          <div className="radio-row session-form-confidence">
            {meta.confidenceLevels.map((level) => (
              <label key={level}>
                <input
                  type="radio"
                  name="confidence"
                  value={String(level)}
                  checked={values.confidence === String(level)}
                  onChange={handleChange}
                />
                {level}
              </label>
            ))}
          </div>
          <p className="field-hint">
            1 = not at all, 5 = ready for the interview.
          </p>
          {error("confidence")}
        </fieldset>
        <div className="field">
          <label htmlFor="session-notes">
            Notes <span className="field-hint">(optional)</span>
          </label>
          <textarea
            id="session-notes"
            name="notes"
            rows="3"
            value={values.notes}
            onChange={handleChange}
            aria-invalid={invalid("notes")}
          />
          {error("notes")}
        </div>
        {message && (
          <p className="field-error" role="alert">
            {message}
          </p>
        )}
        <div className="form-actions">
          <button type="submit" className="button" disabled={busy}>
            {editing ? "Save changes" : "Log session"}
          </button>
          {editing && (
            <button
              type="button"
              className="button button-secondary"
              onClick={onCancel}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

SessionForm.propTypes = {
  meta: metaShape.isRequired,
  editing: sessionShape,
  onSaved: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
