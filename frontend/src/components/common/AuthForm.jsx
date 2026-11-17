import PropTypes from "prop-types";
import { useState } from "react";
import { logIn, signUp } from "../../api/authApi.js";
import "./AuthForm.css";

export default function AuthForm({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const isLogin = mode === "login";

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage("");
    try {
      const { user } = await (isLogin ? logIn(values) : signUp(values));
      onAuthenticated(user);
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setMessage(err.fieldErrors ? "" : err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel auth-form" aria-labelledby="auth-title">
      <h1 id="auth-title">{isLogin ? "Log in" : "Create an account"}</h1>
      <p className="field-hint">
        Anyone can browse interview experiences. An account lets you share your
        own and keep a private practice log.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="auth-username">Username</label>
          <input
            id="auth-username"
            name="username"
            type="text"
            autoComplete="username"
            value={values.username}
            onChange={handleChange}
            aria-invalid={errors.username ? "true" : undefined}
            required
          />
          {errors.username && <p className="field-error">{errors.username}</p>}
        </div>
        <div className="field">
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={values.password}
            onChange={handleChange}
            aria-invalid={errors.password ? "true" : undefined}
            required
          />
          {!isLogin && <p className="field-hint">At least 8 characters.</p>}
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>
        {message && (
          <p className="field-error" role="alert">
            {message}
          </p>
        )}
        <div className="form-actions">
          <button type="submit" className="button" disabled={busy}>
            {isLogin ? "Log in" : "Sign up"}
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setMode(isLogin ? "signup" : "login");
              setErrors({});
              setMessage("");
            }}
          >
            {isLogin ? "I need an account" : "I already have an account"}
          </button>
        </div>
      </form>
    </section>
  );
}

AuthForm.propTypes = {
  onAuthenticated: PropTypes.func.isRequired,
};
