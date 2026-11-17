import PropTypes from "prop-types";
import "./Notice.css";

export default function Notice({ notice }) {
  return (
    <div
      className="notice"
      role="status"
      aria-live="polite"
      data-type={notice?.type}
      hidden={!notice}
    >
      {notice?.message}
    </div>
  );
}

Notice.propTypes = {
  notice: PropTypes.shape({
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["success", "error"]).isRequired,
  }),
};
