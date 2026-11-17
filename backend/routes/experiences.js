import { Router } from "express";
import { requireAuth } from "../auth/requireAuth.js";
import {
  createExperience,
  deleteExperience,
  getExperience,
  listExperiences,
  updateExperience,
} from "../db/experiencesDB.js";
import { parsePaging } from "../db/queryHelpers.js";
import {
  experienceFilters,
  validateExperience,
} from "../validation/experiences.js";
import { validateId } from "./validateId.js";

const router = Router();

// Anyone can browse; posting, editing and deleting need a logged-in author.
router.get("/", async (req, res) => {
  const paging = parsePaging(req.query);
  const { items, total } = await listExperiences(
    experienceFilters(req.query),
    paging,
  );
  res.json({ items, total, page: paging.page, limit: paging.limit });
});

router.get("/:id", validateId, async (req, res) => {
  const experience = await getExperience(req.params.id);
  if (!experience)
    return res.status(404).json({ error: "Experience not found." });
  res.json(experience);
});

router.post("/", requireAuth, async (req, res) => {
  const { errors, value } = validateExperience(req.body);
  if (errors) return res.status(400).json({ errors });
  res.status(201).json(await createExperience(value, req.user));
});

router.put("/:id", requireAuth, validateId, async (req, res) => {
  const { errors, value } = validateExperience(req.body);
  if (errors) return res.status(400).json({ errors });
  const updated = await updateExperience(req.params.id, value, req.user._id);
  if (!updated) {
    return res
      .status(404)
      .json({ error: "Experience not found or not yours." });
  }
  res.json(updated);
});

router.delete("/:id", requireAuth, validateId, async (req, res) => {
  const deleted = await deleteExperience(req.params.id, req.user._id);
  if (!deleted) {
    return res
      .status(404)
      .json({ error: "Experience not found or not yours." });
  }
  res.status(204).end();
});

export default router;
