import { readJsonSafely } from "./api.js";

/**
 * Low-level API calls for authentication.
 * Separation of concerns: Hook handles state, this utility handles network requests.
 */

export async function fetchMe(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return fetch("/api/auth/me", {
    headers,
    credentials: "include"
  });
}

export async function refreshSession() {
  return fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({})
  });
}

export async function loginUser(payload) {
  return fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });
}

export async function signupUser(payload) {
  return fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });
}

export async function googleLogin(credential) {
  return fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ credential })
  });
}

export async function githubLogin(code) {
  return fetch("/api/auth/github", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ code })
  });
}

export async function logoutUser() {
  return fetch("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({}),
    keepalive: true
  });
}

export async function updateProfile(token, payload) {
  return fetch("/api/auth/profile", {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}` 
    },
    credentials: "include",
    body: JSON.stringify(payload)
  });
}
