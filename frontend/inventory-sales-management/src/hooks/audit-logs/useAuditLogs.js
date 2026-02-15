import { useQuery } from "@tanstack/react-query";
import { fetchAuditLogs } from "../../services/auditLog.service";

export function useAuditLogs({ page, limit, sortBy, sortOrder }) {
  return useQuery({
    queryKey: ["audit-logs", page, limit, sortBy, sortOrder],
    queryFn: () => fetchAuditLogs({ page, limit, sortBy, sortOrder }),
    keepPreviousData: true,
  });
}
