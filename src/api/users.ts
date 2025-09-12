import { api } from "./client";

export type RoleOut = {
  id: number;
  name: string;
  parent_id?: number | null;
  children?: RoleOut[];
};
export type UserOut = { id: number; username: string; roles: string[] };

export async function getRoles() {
  // prefer nested roles endpoint so UI can show grouped Selects
  const { data } = await api.get<RoleOut[]>("/users/roles");
  return data as RoleOut[];
}

export async function listUsers() {
  const { data } = await api.get<UserOut[]>("/users");
  return data as UserOut[];
}

export async function createUser(payload: {
  username: string;
  password: string;
  roles?: number[];
}) {
  const { data } = await api.post<UserOut>("/users", payload);
  return data as UserOut;
}

export async function updateUserRoles(userId: number, roles: number[]) {
  const { data } = await api.put<UserOut>(`/users/${userId}`, { roles });
  return data as UserOut;
}

export async function deleteUser(userId: number) {
  const { data } = await api.delete(`/users/${userId}`);
  return data;
}
