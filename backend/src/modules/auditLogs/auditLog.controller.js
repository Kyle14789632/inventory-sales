import { getAuditLogs } from "./auditLog.service.js";

export async function getAuditLogsController(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder || "desc";

  const result = await getAuditLogs({ page, limit, sortBy, sortOrder });
  res.json(result);
}
