import { request, toQuery } from "./client.js";

export function listExperiences(params) {
  return request(`/api/experiences${toQuery(params)}`);
}

export function saveExperience(id, data) {
  return id
    ? request(`/api/experiences/${id}`, { method: "PUT", body: data })
    : request("/api/experiences", { method: "POST", body: data });
}

export function deleteExperience(id) {
  return request(`/api/experiences/${id}`, { method: "DELETE" });
}
