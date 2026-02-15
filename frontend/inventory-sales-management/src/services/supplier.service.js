import api from "./api";

export async function fetchSuppliers({
  page,
  limit,
  search,
  sortBy,
  sortOrder,
}) {
  const { data } = await api.get("/suppliers", {
    params: {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    },
  });
  return data;
}

export async function fetchSupplierOptions() {
  const { data } = await api.get("/suppliers/options");
  return data;
}

export async function createSupplier(payload) {
  const { data } = await api.post("/suppliers", payload);
  return data;
}

export async function updateSupplier(id, payload) {
  const { data } = await api.put(`/suppliers/${id}`, payload);
  return data;
}

export async function toggleSupplierStatus(id, isActive) {
  const { data } = await api.patch(`/suppliers/${id}/status`, { isActive });
  return data;
}
