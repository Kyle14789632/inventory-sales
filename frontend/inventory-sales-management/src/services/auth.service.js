console.log(import.meta.env.VITE_API_URL);

import api from "./api";

export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}
