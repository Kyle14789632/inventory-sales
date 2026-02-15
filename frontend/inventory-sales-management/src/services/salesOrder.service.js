import api from "./api";

export async function fetchSalesOrders({ page, limit, search }) {
  const { data } = await api.get("/sales-orders", {
    params: { page, limit, search },
  });
  return data;
}

export async function fetchSalesOrderById(id) {
  const { data } = await api.get(`/sales-orders/${id}`);
  return data;
}

export async function updateSalesOrder(id, payload) {
  const { data } = await api.put(`/sales-orders/${id}`, payload);
  return data;
}

export async function createSalesOrder(payload) {
  const { data } = await api.post("/sales-orders", payload);
  return data;
}

export async function confirmSalesOrder(id) {
  const { data } = await api.patch(`/sales-orders/${id}/confirm`);
  return data;
}

export async function completeSalesOrder(id) {
  const { data } = await api.patch(`/sales-orders/${id}/complete`);
  return data;
}

export async function cancelSalesOrder(id) {
  const { data } = await api.patch(`/sales-orders/${id}/cancel`);
  return data;
}
