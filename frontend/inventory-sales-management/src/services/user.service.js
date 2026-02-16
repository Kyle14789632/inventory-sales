import api from "./api";

export async function fetchUsers(params) {
  const { data } = await api.get("/users", { params });
  return data;
}

export async function createUser(payload) {
  const { data } = await api.post("/users", payload);
  return data;
}

export async function toggleUserStatus(id, isActive) {
  const { data } = await api.patch(`/users/${id}/status`, {
    isActive,
  });
  return data;
}
