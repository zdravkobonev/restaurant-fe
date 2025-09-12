import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as usersApi from "../api/users";

type UserState = {
  users: usersApi.UserOut[];
  roles: usersApi.RoleOut[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
};

const initialState: UserState = {
  users: [],
  roles: [],
  status: "idle",
  error: null,
};

export const fetchRoles = createAsyncThunk("users/fetchRoles", async () => {
  return usersApi.getRoles();
});

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return usersApi.listUsers();
});

export const createUser = createAsyncThunk(
  "users/createUser",
  async (
    payload: { username: string; password: string; roles?: number[] },
    { rejectWithValue }
  ) => {
    try {
      return await usersApi.createUser(payload);
    } catch (err: unknown) {
      return rejectWithValue(String(err));
    }
  }
);

export const updateUserRoles = createAsyncThunk(
  "users/updateUserRoles",
  async (
    { userId, roles }: { userId: number; roles: number[] },
    { rejectWithValue }
  ) => {
    try {
      return await usersApi.updateUserRoles(userId, roles);
    } catch (err: unknown) {
      return rejectWithValue(String(err));
    }
  }
);

export const removeUser = createAsyncThunk(
  "users/removeUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      await usersApi.deleteUser(userId);
      return userId;
    } catch (err: unknown) {
      return rejectWithValue(String(err));
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchRoles.fulfilled,
        (state, action: PayloadAction<usersApi.RoleOut[]>) => {
          state.roles = action.payload;
        }
      )
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<usersApi.UserOut[]>) => {
          state.users = action.payload;
        }
      )
      .addCase(
        createUser.fulfilled,
        (state, action: PayloadAction<usersApi.UserOut>) => {
          state.users.push(action.payload);
        }
      )
      .addCase(
        updateUserRoles.fulfilled,
        (state, action: PayloadAction<usersApi.UserOut>) => {
          const idx = state.users.findIndex((u) => u.id === action.payload.id);
          if (idx !== -1) state.users[idx] = action.payload;
        }
      )
      .addCase(removeUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
