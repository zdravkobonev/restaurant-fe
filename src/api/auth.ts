import { api } from "./client";

export async function login(username: string, password: string) {
  const { data } = await api.post("/auth/login", { username, password });
  return data as { access_token: string; token_type: string; roles?: string[] };
}
