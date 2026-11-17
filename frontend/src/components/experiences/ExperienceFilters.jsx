import PropTypes from "prop-types";
import { useState } from "react";
import { capitalize } from "../../utils/format.js";
import { metaShape } from "../../utils/propShapes.js";
import "./ExperienceFilters.css";

const EMPTY = {
  company: "",
  role: "",
  roleType: "",
  difficulty: "",
  outcome: "",
  q: "",
};

export default function ExperienceFilters({ meta, onApply }) {
  const [values, setValues] = useState(EMPTY);

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  return (
    <form
      className="panel experience-filters"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onApply(values);
      }}
    >
      <div className="field">
        <label htmlFor="filter-company">Company</label>
        <input
          id="filter-company"
          name="company"
          type="search"
          value={values.company}
          onChange={handleChange}
          placeholder="Wayfair, HubSpot…"
        />
      </div>
      <div className="field">
        <label htmlFor="filter-role">Role</label>
        <input
          id="filter-role"
          name="role"
          type="search"
          value={values.role}
          onChange={handleChange}
          placeholder="Data analyst…"
        />
      </div>
      <div className="field">
        <label htmlFor="filter-role-type">Role type</label>
        <select
          id="filter-role-type"
          name="roleType"
          value={values.roleType}
          onChange={handleChange}
        >
          <option value="">Any role type</option>
          {meta.roleTypes.map((type) => (
            <option key={type} value={type}>
              {capitalize(type)}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="filter-difficulty">Difficulty</label>
        <select
          id="filter-difficulty"
          name="difficulty"
          value={values.difficulty}
          onChange={handleChange}
        >
          <option value="">Any difficulty</option>
          {meta.difficulties.map((level) => (
            <option key={level} value={level}>
              {capitalize(level)}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="filter-outcome">Outcome</label>
        <select
          id="filter-outcome"
          name="outcome"
          value={values.outcome}
          onChange={handleChange}
        >
          <option value="">Any outcome</option>
          {meta.outcomes.map((outcome) => (
            <option key={outcome} value={outcome}>
              {capitalize(outcome)}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="filter-q">Question or tip</label>
        <input
          id="filter-q"
          name="q"
          type="search"
          value={values.q}
          onChange={handleChange}
          placeholder="linked list, SQL…"
        />
      </div>
      <div className="experience-filters-actions">
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

ExperienceFilters.propTypes = {
  meta: metaShape.isRequired,
  onApply: PropTypes.func.isRequired,
};
