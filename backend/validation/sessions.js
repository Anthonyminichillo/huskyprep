import { CONFIDENCE_LEVELS, PRACTICE_TOPICS } from "../constants.js";
import {
  collect,
  pickFilters,
  readChoice,
  readInteger,
  readText,
} from "./helpers.js";

function readDate(body) {
  const value = typeof body.practicedOn === "string" ? body.practicedOn : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) {
    return { error: "Choose the date you practiced." };
  }
  return { value };
}

export function validateSession(body = {}) {
  return collect({
    topic: readChoice(body, "topic", {
      label: "Topic",
      choices: PRACTICE_TOPICS,
    }),
    question: readText(body, "question", {
      label: "Question",
      min: 3,
      max: 300,
    }),
    minutes: readInteger(body, "minutes", {
      label: "Minutes",
      min: 1,
      max: 600,
    }),
    confidence: readInteger(body, "confidence", {
      label: "Confidence",
      min: 1,
      max: 5,
    }),
    practicedOn: readDate(body),
    notes: readText(body, "notes", {
      label: "Notes",
      max: 1500,
      required: false,
    }),
  });
}

export function sessionFilters(query) {
  return pickFilters(query, {
    topic: PRACTICE_TOPICS,
    confidence: CONFIDENCE_LEVELS,
    q: null,
  });
}
