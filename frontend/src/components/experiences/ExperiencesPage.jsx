import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { deleteExperience, listExperiences } from "../../api/experiencesApi.js";
import { metaShape, userShape } from "../../utils/propShapes.js";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import Pagination from "../common/Pagination.jsx";
import ExperienceCard from "./ExperienceCard.jsx";
import ExperienceFilters from "./ExperienceFilters.jsx";
import ExperienceForm from "./ExperienceForm.jsx";
import "./ExperiencesPage.css";

const PAGE_SIZE = 10;

export default function ExperiencesPage({
  user,
  meta,
  onNotify,
  onRequireLogin,
}) {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  // Refetch whenever the filters, the page or a save/delete changes the list.
  useEffect(() => {
    let ignore = false;
    listExperiences({ ...filters, page, limit: PAGE_SIZE })
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
        ? "Your experience was updated."
        : `Thanks for sharing your ${saved.company} interview!`,
    );
    if (!wasEdit && page !== 1) setPage(1);
    else reload();
  }

  async function confirmDelete() {
    try {
      await deleteExperience(toDelete._id);
      onNotify("Your experience was deleted.");
      setToDelete(null);
      if (data?.items.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (err) {
      onNotify(err.message, "error");
    }
  }

  return (
    <div className="experiences-page">
      <div className="experiences-intro">
        <h1>Co-op interview experiences</h1>
        <p>
          Interview stories shared by Northeastern students: the rounds, the
          questions and what they would do differently.
        </p>
      </div>
      <div className="experiences-layout">
        <aside>
          {user ? (
            <ExperienceForm
              key={editing?._id || "new"}
              meta={meta}
              editing={editing}
              onSaved={handleSaved}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div className="panel">
              <h2>Share your interview</h2>
              <p>Log in to post your own co-op interview experience.</p>
              <button type="button" className="button" onClick={onRequireLogin}>
                Log in or sign up
              </button>
            </div>
          )}
        </aside>
        <section aria-labelledby="experience-results-title">
          <h2
            id="experience-results-title"
            className="experiences-results-title"
          >
            Browse experiences
          </h2>
          <ExperienceFilters
            meta={meta}
            onApply={(next) => {
              setFilters(next);
              setPage(1);
            }}
          />
          <p className="summary-text" aria-live="polite">
            {!data
              ? "Loading experiences…"
              : `${data.total.toLocaleString()} experience${data.total === 1 ? "" : "s"} found.`}
          </p>
          {data && data.items.length === 0 ? (
            <p className="empty-state">No experiences match these filters.</p>
          ) : (
            <ul className="card-list">
              {data?.items.map((experience) => (
                <li key={experience._id}>
                  <ExperienceCard
                    experience={experience}
                    isOwner={user?._id === experience.authorId}
                    onEdit={() => {
                      setEditing(experience);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onDelete={() => setToDelete(experience)}
                  />
                </li>
              ))}
            </ul>
          )}
          <Pagination
            page={page}
            limit={PAGE_SIZE}
            total={data?.total ?? 0}
            label="Experience pages"
            onPageChange={setPage}
          />
        </section>
      </div>
      <ConfirmDialog
        message={
          toDelete
            ? `Delete your ${toDelete.company} interview experience?`
            : null
        }
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

ExperiencesPage.propTypes = {
  user: userShape,
  meta: metaShape.isRequired,
  onNotify: PropTypes.func.isRequired,
  onRequireLogin: PropTypes.func.isRequired,
};
