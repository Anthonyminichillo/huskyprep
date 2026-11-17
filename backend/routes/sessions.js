import { Router } from "express";
import { requireAuth } from "../auth/requireAuth.js";
import { parsePaging } from "../db/queryHelpers.js";
import {
  createSession,
  deleteSession,
  listSessions,
  updateSession,
} from "../db/sessionsDB.js";
import { sessionFilters, validateSession } from "../validation/sessions.js";
import { validateId } from "./validateId.js";

const router = Router();

// Practice logs are personal, so every route needs a logged-in user.
router.use(requireAuth);

router.get("/", async (req, res) => {
  const paging = parsePaging(req.query);
  const result = await listSessions(
    req.user._id,
    sessionFilters(req.query),
    paging,
  );
  res.json({ ...result, page: paging.page, limit: paging.limit });
});

router.post("/", async (req, res) => {
  const { errors, value } = validateSession(req.body);
  if (errors) return res.status(400).json({ errors });
  res.status(201).json(await createSession(value, req.user._id));
});

router.put("/:id", validateId, async (req, res) => {
  const { errors, value } = validateSession(req.body);
  if (errors) return res.status(400).json({ errors });
  const updated = await updateSession(req.params.id, value, req.user._id);
  if (!updated) return res.status(404).json({ error: "Session not found." });
  res.json(updated);
});

router.delete("/:id", validateId, async (req, res) => {
  const deleted = await deleteSession(req.params.id, req.user._id);
  if (!deleted) return res.status(404).json({ error: "Session not found." });
  res.status(204).end();
});

export default router;
