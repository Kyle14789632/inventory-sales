import { useQuery } from "@tanstack/react-query";
import { fetchDashboardReport } from "../../services/report.service";

export function useDashboardReport() {
  return useQuery({
    queryKey: ["dashboard-report"],
    queryFn: fetchDashboardReport,
  });
}
