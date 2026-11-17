import { ObjectId } from "mongodb";

export function isValidId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

export function readText(
  body,
  field,
  { label, min = 1, max, required = true },
) {
  const value = typeof body[field] === "string" ? body[field].trim() : "";
  if (!value) {
    return required ? { error: `${label} is required.` } : { value: "" };
  }
  if (value.length < min) {
    return { error: `${label} must be at least ${min} characters.` };
  }
  if (max && value.length > max) {
    return { error: `${label} must be at most ${max} characters.` };
  }
  return { value };
}

export function readChoice(body, field, { label, choices }) {
  const value = body[field];
  if (!choices.includes(value)) {
    return { error: `Choose a valid ${label.toLowerCase()}.` };
  }
  return { value };
}

export function readInteger(body, field, { label, min, max }) {
  const value = Number(body[field]);
  if (!Number.isInteger(value) || value < min || value > max) {
    return { error: `${label} must be a whole number from ${min} to ${max}.` };
  }
  return { value };
}

// Runs each rule and returns either the cleaned values or the error messages.
export function collect(rules) {
  const errors = {};
  const value = {};
  for (const [field, result] of Object.entries(rules)) {
    if (result.error) errors[field] = result.error;
    else value[field] = result.value;
  }
  return Object.keys(errors).length ? { errors } : { value };
}

// Keeps only query filters whose values are allowed (null means free text).
export function pickFilters(query, allowed) {
  const filters = {};
  for (const [key, choices] of Object.entries(allowed)) {
    const value = query[key];
    if (typeof value !== "string" || !value) continue;
    if (choices === null || choices.map(String).includes(value)) {
      filters[key] = value.slice(0, 100);
    }
  }
  return filters;
}
