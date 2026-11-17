export function capitalize(text) {
  const value = String(text);
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Formats a YYYY-MM-DD string without shifting it to the previous day in US time zones.
export function formatDay(day) {
  const [year, month, date] = day.split("-").map(Number);
  return formatDate(new Date(year, month - 1, date));
}

export function todayString() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 10);
}
