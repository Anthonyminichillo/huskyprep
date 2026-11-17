import { request } from "./client.js";

export const getCurrentUser = () => request("/api/auth/me");
export const logIn = (credentials) =>
  request("/api/auth/login", { method: "POST", body: credentials });
export const signUp = (credentials) =>
  request("/api/auth/signup", { method: "POST", body: credentials });
export const logOut = () => request("/api/auth/logout", { method: "POST" });
export const getMeta = () => request("/api/meta");
