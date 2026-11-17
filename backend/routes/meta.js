import { Router } from "express";
import {
  CONFIDENCE_LEVELS,
  COOP_CYCLES,
  DIFFICULTIES,
  INTERVIEW_FORMATS,
  OUTCOMES,
  PRACTICE_TOPICS,
  ROLE_TYPES,
} from "../constants.js";

const router = Router();

// Lets the React app build its dropdowns from the lists the server validates against.
router.get("/", (req, res) => {
  res.json({
    roleTypes: ROLE_TYPES,
    difficulties: DIFFICULTIES,
    outcomes: OUTCOMES,
    formats: INTERVIEW_FORMATS,
    coopCycles: COOP_CYCLES,
    topics: PRACTICE_TOPICS,
    confidenceLevels: CONFIDENCE_LEVELS,
  });
});

export default router;
