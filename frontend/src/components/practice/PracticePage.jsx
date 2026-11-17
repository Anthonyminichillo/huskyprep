import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { deleteSession, listSessions } from "../../api/sessionsApi.js";
import { metaShape, userShape } from "../../utils/propShapes.js";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import Pagination from "../common/Pagination.jsx";
import SessionCard from "./SessionCard.jsx";
import SessionFilters from "./SessionFilters.jsx";
import SessionForm from "./SessionForm.jsx";
import TopicSummary from "./TopicSummary.jsx";
import "./PracticePage.css";

const PAGE_SIZE = 10;

export default function PracticePage({ user, meta, onNotify }) {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  // Refetch whenever the filters, the page or a save/delete changes the list.
  useEffect(() => {
    let ignore = false;
    listSessions({ ...filters, page, limit: PAGE_SIZE })
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((err) => onNotify(err.message, "error"));
    return () => {
      ignore = true;
    };
  }, [filters, page, reloadKey, onNotify]);

  const reload = () => setReloadKey((key) => key + 1);

  function handleSaved(saved, wasEdit) {
    setEditing(null);
    onNotify(
      wasEdit
        ? "Session updated."
        : `Logged ${saved.minutes} minutes of ${saved.topic}.`,
    );
    if (!wasEdit && page !== 1) setPage(1);
    else reload();
  }

  async function confirmDelete() {
    try {
      await deleteSession(toDelete._id);
      onNotify("Session deleted.");
      setToDelete(null);
      if (data?.items.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (err) {
      onNotify(err.message, "error");
    }
  }

  return (
    <div className="practice-page">
      <h1>{user.username}&apos;s practice log</h1>
      <p className="practice-lead">
        Only you can see these sessions. Use the summary to spot the topics you
        have practiced least or feel least confident about.
      </p>
      <TopicSummary summary={data?.summary ?? []} topics={meta.topics} />
      <div className="practice-layout">
        <aside>
          <SessionForm
            key={editing?._id || "new"}
            meta={meta}
            editing={editing}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
        </aside>
        <section aria-labelledby="session-results-title">
          <h2 id="session-results-title" className="practice-results-title">
            Your sessions
          </h2>
          <SessionFilters
            meta={meta}
            onApply={(next) => {
              setFilters(next);
              setPage(1);
            }}
          />
          <p className="summary-text" aria-live="polite">
            {!data
              ? "Loading sessions…"
              : `${data.total.toLocaleString()} session${data.total === 1 ? "" : "s"} found.`}
          </p>
          {data && data.items.length === 0 ? (
            <p className="empty-state">
              No sessions yet. Log your first one with the form.
            </p>
          ) : (
            <ul className="card-list">
              {data?.items.map((session) => (
                <li key={session._id}>
                  <SessionCard
                    session={session}
                    onEdit={() => {
                      setEditing(session);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onDelete={() => setToDelete(session)}
                  />
                </li>
              ))}
            </ul>
          )}
          <Pagination
            page={page}
            limit={PAGE_SIZE}
            total={data?.total ?? 0}
            label="Session pages"
            onPageChange={setPage}
          />
        </section>
      </div>
      <ConfirmDialog
        message={
          toDelete ? `Delete your "${toDelete.question}" session?` : null
        }
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

PracticePage.propTypes = {
  user: userShape.isRequired,
  meta: metaShape.isRequired,
  onNotify: PropTypes.func.isRequired,
};
