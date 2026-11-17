import PropTypes from "prop-types";

export const userShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
});

export const metaShape = PropTypes.shape({
  roleTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  difficulties: PropTypes.arrayOf(PropTypes.string).isRequired,
  outcomes: PropTypes.arrayOf(PropTypes.string).isRequired,
  formats: PropTypes.arrayOf(PropTypes.string).isRequired,
  coopCycles: PropTypes.arrayOf(PropTypes.string).isRequired,
  topics: PropTypes.arrayOf(PropTypes.string).isRequired,
  confidenceLevels: PropTypes.arrayOf(PropTypes.number).isRequired,
});

export const experienceShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  roleType: PropTypes.string.isRequired,
  coopCycle: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  rounds: PropTypes.number.isRequired,
  difficulty: PropTypes.string.isRequired,
  outcome: PropTypes.string.isRequired,
  questions: PropTypes.arrayOf(PropTypes.string).isRequired,
  tips: PropTypes.string,
  authorId: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
});

export const sessionShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  minutes: PropTypes.number.isRequired,
  confidence: PropTypes.number.isRequired,
  practicedOn: PropTypes.string.isRequired,
  notes: PropTypes.string,
});
