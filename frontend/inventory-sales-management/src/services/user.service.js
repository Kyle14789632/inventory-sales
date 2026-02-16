import api from "./api";

export async function fetchUsers() {
  const { data } = await api.get("/users");
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
