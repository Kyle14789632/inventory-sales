import api from "./api";

export async function fetchCategories({
  page,
  limit,
  search,
  sortBy,
  sortOrder,
}) {
  const { data } = await api.get("/categories", {
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

export async function fetchCategoryOptions() {
  const { data } = await api.get("/categories/options");
  return data;
}

export async function createCategory(payload) {
  const { data } = await api.post("/categories", payload);
  return data;
}

export async function updateCategory(id, payload) {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id) {
  await api.delete(`/categories/${id}`);
}
