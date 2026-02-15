import api from "./api";

export async function fetchAuditLogs({ page, limit, sortBy, sortOrder }) {
  const { data } = await api.get("/audit-logs", {
    params: { page, limit, sortBy, sortOrder },
  });
  return data;
}
