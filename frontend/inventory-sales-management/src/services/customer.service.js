import api from "./api";

export async function fetchCustomers(params) {
  const { data } = await api.get("/customers", { params });
  return data;
}

export async function fetchCustomerOptions() {
  const { data } = await api.get("/customers/options");
  return data;
}

export async function createCustomer(payload) {
  const { data } = await api.post("/customers", payload);
  return data;
}

export async function updateCustomer(id, payload) {
  const { data } = await api.put(`/customers/${id}`, payload);
  return data;
}

export async function toggleCustomerStatus(id, isActive) {
  const { data } = await api.patch(`/customers/${id}/status`, { isActive });
  return data;
}
