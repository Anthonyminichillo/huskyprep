import {
  COOP_CYCLES,
  DIFFICULTIES,
  INTERVIEW_FORMATS,
  OUTCOMES,
  ROLE_TYPES,
} from "../constants.js";
import {
  collect,
  pickFilters,
  readChoice,
  readInteger,
  readText,
} from "./helpers.js";

function readQuestions(body) {
  const raw = Array.isArray(body.questions) ? body.questions : [];
  const questions = raw
    .filter((q) => typeof q === "string")
    .map((q) => q.trim())
    .filter(Boolean);
  if (!questions.length)
    return { error: "Add at least one question you were asked." };
  if (questions.length > 15) return { error: "Add at most 15 questions." };
  if (questions.some((q) => q.length > 300)) {
    return { error: "Each question must be at most 300 characters." };
  }
  return { value: questions };
}

export function validateExperience(body = {}) {
  return collect({
    company: readText(body, "company", { label: "Company", min: 2, max: 80 }),
    role: readText(body, "role", { label: "Role", min: 2, max: 100 }),
    roleType: readChoice(body, "roleType", {
      label: "Role type",
      choices: ROLE_TYPES,
    }),
    coopCycle: readChoice(body, "coopCycle", {
      label: "Co-op cycle",
      choices: COOP_CYCLES,
    }),
    format: readChoice(body, "format", {
      label: "Format",
      choices: INTERVIEW_FORMATS,
    }),
    rounds: readInteger(body, "rounds", { label: "Rounds", min: 1, max: 10 }),
    difficulty: readChoice(body, "difficulty", {
      label: "Difficulty",
      choices: DIFFICULTIES,
    }),
    outcome: readChoice(body, "outcome", {
      label: "Outcome",
      choices: OUTCOMES,
    }),
    questions: readQuestions(body),
    tips: readText(body, "tips", { label: "Tips", max: 1500, required: false }),
  });
}

export function experienceFilters(query) {
  return pickFilters(query, {
    company: null,
    role: null,
    roleType: ROLE_TYPES,
    difficulty: DIFFICULTIES,
    outcome: OUTCOMES,
    q: null,
  });
}
