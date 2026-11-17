import { useCallback, useEffect, useRef, useState } from "react";
import { getCurrentUser, getMeta, logOut } from "../api/authApi.js";
import AuthForm from "./common/AuthForm.jsx";
import HowToUse from "./common/HowToUse.jsx";
import NavBar from "./common/NavBar.jsx";
import Notice from "./common/Notice.jsx";
import ExperiencesPage from "./experiences/ExperiencesPage.jsx";
import PracticePage from "./practice/PracticePage.jsx";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [meta, setMeta] = useState(null);
  const [tab, setTab] = useState("experiences");
  const [notice, setNotice] = useState(null);
  const [loadError, setLoadError] = useState("");
  const timer = useRef();

  useEffect(() => {
    Promise.all([getCurrentUser(), getMeta()])
      .then(([auth, metaData]) => {
        setUser(auth.user);
        setMeta(metaData);
      })
      .catch((err) => setLoadError(err.message));
  }, []);

  const notify = useCallback((message, type = "success") => {
    setNotice({ message, type });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(null), 5000);
  }, []);

  function handleAuthenticated(signedInUser) {
    setUser(signedInUser);
    setTab("experiences");
    notify(`Welcome, ${signedInUser.username}!`);
  }

  async function handleLogout() {
    await logOut();
    setUser(null);
    setTab("experiences");
    notify("You have logged out.");
  }

  let content;
  if (loadError) {
    content = (
      <p className="app-error">Could not load HuskyPrep: {loadError}</p>
    );
  } else if (!meta) {
    content = <p className="summary-text">Loading…</p>;
  } else if (tab === "login") {
    content = <AuthForm onAuthenticated={handleAuthenticated} />;
  } else if (tab === "practice") {
    content = user ? (
      <PracticePage user={user} meta={meta} onNotify={notify} />
    ) : (
      <div className="panel app-login-prompt">
        <h2>Your practice log is private</h2>
        <p>Log in or create an account to track your practice sessions.</p>
        <button
          type="button"
          className="button"
          onClick={() => setTab("login")}
        >
          Log in or sign up
        </button>
      </div>
    );
  } else if (tab === "help") {
    content = <HowToUse />;
  } else {
    content = (
      <ExperiencesPage
        user={user}
        meta={meta}
        onNotify={notify}
        onRequireLogin={() => setTab("login")}
      />
    );
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <NavBar
        user={user}
        activeTab={tab}
        onTabChange={setTab}
        onLogout={handleLogout}
      />
      <main id="main" className="app-main">
        <Notice notice={notice} />
        {content}
      </main>
      <footer className="app-footer">
        HuskyPrep by Drashti Bhavsar and Hard Gondaliya. Seeded interview
        experiences and practice sessions are synthetic sample data.
      </footer>
    </>
  );
}

App.propTypes = {};
