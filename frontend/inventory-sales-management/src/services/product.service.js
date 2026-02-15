import api from "./api";

export async function fetchProducts({
  page,
  limit,
  search,
  sortBy,
  sortOrder,
}) {
  const { data } = await api.get("/products", {
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

export async function fetchProductOptions() {
  const { data } = await api.get("/products", {
    params: { page: 1, limit: 1000 },
  });
  return data.data;
}

export async function createProduct(payload) {
  const { data } = await api.post("/products", payload);
  return data;
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/products/${id}`, payload);
  return data;
}

export async function toggleProductStatus(id, isActive) {
  const { data } = await api.patch(`/products/${id}/status`, {
    isActive,
  });
  return data;
}
