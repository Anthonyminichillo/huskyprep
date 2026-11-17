const MAX_LIMIT = 50;

export function parsePaging(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.parseInt(query.limit, 10) || 10),
  );
  return { page, limit, skip: (page - 1) * limit };
}

export function containsText(text) {
  return new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
}
