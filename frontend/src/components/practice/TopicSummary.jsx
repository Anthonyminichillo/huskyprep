import PropTypes from "prop-types";
import { capitalize } from "../../utils/format.js";
import "./TopicSummary.css";

export default function TopicSummary({ summary, topics }) {
  const byTopic = new Map(summary.map((row) => [row._id, row]));

  return (
    <section className="topic-summary" aria-labelledby="topic-summary-title">
      <h2 id="topic-summary-title">Topic summary</h2>
      <div className="topic-summary-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Topic</th>
              <th scope="col">Sessions</th>
              <th scope="col">Minutes</th>
              <th scope="col">Avg. confidence</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => {
              const row = byTopic.get(topic);
              const avg = row ? row.avgConfidence : null;
              return (
                <tr
                  key={topic}
                  data-weak={avg !== null && avg < 3 ? "true" : undefined}
                >
                  <th scope="row">{capitalize(topic)}</th>
                  <td>{row ? row.count : 0}</td>
                  <td>{row ? row.minutes : 0}</td>
                  <td>
                    {avg === null ? "Not practiced" : `${avg.toFixed(1)} / 5`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="field-hint">
        Highlighted rows average below 3 out of 5: good topics to review.
      </p>
    </section>
  );
}

TopicSummary.propTypes = {
  summary: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      minutes: PropTypes.number.isRequired,
      avgConfidence: PropTypes.number.isRequired,
    }),
  ).isRequired,
  topics: PropTypes.arrayOf(PropTypes.string).isRequired,
};
