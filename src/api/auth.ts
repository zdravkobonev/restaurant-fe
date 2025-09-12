import { api } from "./client";

export type RolesGrouped = { parentId: number; roles: number[] };

export async function login(username: string, password: string) {
  const { data } = await api.post("/auth/login", { username, password });
  return data as { access_token: string; token_type: string; roles?: string[] };
}

export async function getUserRoles() {
  const { data } = await api.get("/auth/user-roles");
  return data as RolesGrouped[];
}
