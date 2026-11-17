import PropTypes from "prop-types";
import { userShape } from "../../utils/propShapes.js";
import "./NavBar.css";

const TABS = [
  { id: "experiences", label: "Interview experiences" },
  { id: "practice", label: "My practice" },
  { id: "help", label: "How to use" },
];

export default function NavBar({ user, activeTab, onTabChange, onLogout }) {
  return (
    <header className="navbar">
      <button
        type="button"
        className="navbar-brand"
        onClick={() => onTabChange("experiences")}
      >
        HuskyPrep
      </button>
      <nav aria-label="Main">
        <ul className="navbar-tabs">
          {TABS.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                className="navbar-tab"
                aria-current={activeTab === tab.id ? "page" : undefined}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="navbar-user">
        {user ? (
          <>
            <span>
              Signed in as <strong>{user.username}</strong>
            </span>
            <button type="button" className="navbar-tab" onClick={onLogout}>
              Log out
            </button>
          </>
        ) : (
          <button
            type="button"
            className="navbar-tab"
            aria-current={activeTab === "login" ? "page" : undefined}
            onClick={() => onTabChange("login")}
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
}

NavBar.propTypes = {
  user: userShape,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};
