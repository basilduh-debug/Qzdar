// Small fetch wrapper that adds the JWT token and parses JSON
const API_BASE = "http://localhost:5000/api";

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...(options.headers || {})
    }
  });

  let data = {};
  try { data = await res.json(); } catch (_) {}

  if (!res.ok) {
    const err = new Error(data.msg || "Request failed");
    err.status = res.status;
    throw err;
  }
  return data;
}
