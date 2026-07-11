const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request to ${path} failed with ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  getCases: () => request("/api/cases"),
  getCaseStats: () => request("/api/cases/stats"),
  updateCase: (id, patch) =>
    request(`/api/cases/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  logCaseAction: (id, type) =>
    request(`/api/cases/${id}/actions`, { method: "POST", body: JSON.stringify({ type }) }),

  sendConciergeMessage: (message, history) =>
    request("/api/concierge/message", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    }),

  getTrainingModules: () => request("/api/training/modules"),
  getAudienceModes: () => request("/api/training/audience-modes"),
  getQaBank: (moduleId) =>
    request(moduleId ? `/api/training/qa-bank?moduleId=${moduleId}` : "/api/training/qa-bank"),
  getSessionHistory: () => request("/api/training/sessions"),
  logSession: (payload) =>
    request("/api/training/sessions", { method: "POST", body: JSON.stringify(payload) }),
  askTrainingQuestion: (message, moduleId, history) =>
    request("/api/training/ask", {
      method: "POST",
      body: JSON.stringify({ message, moduleId, history }),
    }),
};