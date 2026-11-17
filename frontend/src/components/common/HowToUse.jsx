import "./HowToUse.css";

export default function HowToUse() {
  return (
    <section className="how-to-use" aria-labelledby="how-to-title">
      <h1 id="how-to-title">How to use HuskyPrep</h1>
      <p className="how-to-lead">
        HuskyPrep helps Northeastern students prepare for co-op interviews in
        two ways: by learning from other students&apos; real interviews, and by
        tracking their own practice.
      </p>
      <div className="how-to-grid">
        <article className="panel">
          <h2>Interview experiences</h2>
          <ol>
            <li>
              Open the Interview experiences tab. No account is needed to
              browse.
            </li>
            <li>
              Filter by company, role, role type, difficulty or outcome, or
              search for a question, then select Apply filters.
            </li>
            <li>
              Log in to share your own interview with the Share your interview
              form. List one question per line.
            </li>
            <li>Your own posts show Edit and Delete buttons.</li>
          </ol>
        </article>
        <article className="panel">
          <h2>My practice</h2>
          <ol>
            <li>Log in and open the My practice tab. Your log is private.</li>
            <li>
              Log a session with its topic, question, time spent and how
              confident you felt from 1 to 5.
            </li>
            <li>
              The topic summary shows how much you practiced each topic and your
              average confidence, so you know what to review.
            </li>
            <li>
              Filter by topic or confidence, and edit or delete any session.
            </li>
          </ol>
        </article>
      </div>
      <p className="field-hint">
        Want to try it without signing up? Log in as <strong>demo</strong> with
        the password <strong>huskyprep-demo</strong>.
      </p>
    </section>
  );
}

HowToUse.propTypes = {};
