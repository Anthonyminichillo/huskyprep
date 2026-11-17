import { request, toQuery } from "./client.js";

export function listSessions(params) {
  return request(`/api/sessions${toQuery(params)}`);
}

export function saveSession(id, data) {
  return id
    ? request(`/api/sessions/${id}`, { method: "PUT", body: data })
    : request("/api/sessions", { method: "POST", body: data });
}

export function deleteSession(id) {
  return request(`/api/sessions/${id}`, { method: "DELETE" });
}
