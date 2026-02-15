import api from "./api";

export async function fetchDashboardReport() {
  const { data } = await api.get("/reports/dashboard");
  return data;
}
