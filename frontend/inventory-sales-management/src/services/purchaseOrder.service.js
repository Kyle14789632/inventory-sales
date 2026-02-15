import api from "./api";

export async function fetchPurchaseOrders({ page, limit, search }) {
  const { data } = await api.get("/purchase-orders", {
    params: {
      page,
      limit,
      search,
    },
  });
  return data;
}

export async function fetchPurchaseOrderById(id) {
  const { data } = await api.get(`/purchase-orders/${id}`);
  return data;
}

export async function createPurchaseOrder(payload) {
  const { data } = await api.post("/purchase-orders", payload);
  return data;
}

export async function updatePurchaseOrder(id, payload) {
  const { data } = await api.put(`/purchase-orders/${id}`, payload);
  return data;
}

export async function markPurchaseOrderOrdered(id) {
  const { data } = await api.patch(`/purchase-orders/${id}/ordered`);
  return data;
}

export async function receivePurchaseOrder(id) {
  const { data } = await api.patch(`/purchase-orders/${id}/receive`);
  return data;
}

export async function cancelPurchaseOrder(id) {
  const { data } = await api.patch(`/purchase-orders/${id}/cancel`);
  return data;
}
