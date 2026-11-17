import PropTypes from "prop-types";
import { useState } from "react";
import { capitalize } from "../../utils/format.js";
import { metaShape } from "../../utils/propShapes.js";
import "./SessionFilters.css";

const EMPTY = { topic: "", confidence: "", q: "" };

export default function SessionFilters({ meta, onApply }) {
  const [values, setValues] = useState(EMPTY);

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  return (
    <form
      className="panel session-filters"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onApply(values);
      }}
    >
      <div className="field">
        <label htmlFor="session-filter-topic">Topic</label>
        <select
          id="session-filter-topic"
          name="topic"
          value={values.topic}
          onChange={handleChange}
        >
          <option value="">All topics</option>
          {meta.topics.map((topic) => (
            <option key={topic} value={topic}>
              {capitalize(topic)}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="session-filter-confidence">Confidence</label>
        <select
          id="session-filter-confidence"
          name="confidence"
          value={values.confidence}
          onChange={handleChange}
        >
          <option value="">Any confidence</option>
          {meta.confidenceLevels.map((level) => (
            <option key={level} value={level}>
              {level} / 5
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="session-filter-q">Search</label>
        <input
          id="session-filter-q"
          name="q"
          type="search"
          value={values.q}
          onChange={handleChange}
          placeholder="two sum, design…"
        />
      </div>
      <div className="session-filters-actions">
        <button type="submit" className="button">
          Apply filters
        </button>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => {
            setValues(EMPTY);
            onApply({});
          }}
        >
          Clear
        </button>
      </div>
    </form>
  );
}

SessionFilters.propTypes = {
  meta: metaShape.isRequired,
  onApply: PropTypes.func.isRequired,
};
