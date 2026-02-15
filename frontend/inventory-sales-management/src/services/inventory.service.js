import api from "./api";

export async function fetchInventoryStock({
  page,
  limit,
  search,
  sortBy,
  sortOrder,
}) {
  const { data } = await api.get("/inventory/stock", {
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

export async function fetchStockMovements({ productId, page, limit }) {
  const { data } = await api.get(`/inventory/movements/${productId}`, {
    params: { page, limit },
  });
  return data;
}

export async function createStockMovement(payload) {
  const { data } = await api.post("/inventory/movements", payload);
  return data;
}
