import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { login as apiLogin } from "../api/auth";
import { setToken, clearToken, getToken } from "../lib/auth";

type AuthState = {
  token: string | null;
  roles: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
};

const initialState: AuthState = {
  token: getToken(),
  roles: [],
  status: "idle",
  error: null,
};

export const login = createAsyncThunk<
  { access_token: string; token_type: string; roles?: string[] },
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async (params, { rejectWithValue }) => {
  try {
    const data = await apiLogin(params.username, params.password);
    return data;
  } catch (err: unknown) {
    // try to extract a useful message from axios-like error shapes
    let message = "Login failed";
    if (typeof err === "object" && err !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = err as any;
      message = e?.response?.data ?? e?.message ?? String(e);
    } else {
      message = String(err);
    }
    return rejectWithValue(String(message));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state: AuthState) {
      state.token = null;
      state.roles = [];
      state.status = "idle";
      state.error = null;
      clearToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state: AuthState) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (
          state: AuthState,
          action: PayloadAction<{
            access_token: string;
            token_type: string;
            roles?: string[];
          }>
        ) => {
          state.status = "succeeded";
          state.token = action.payload.access_token;
          state.roles = action.payload.roles ?? [];
          state.error = null;
          setToken(action.payload.access_token);
        }
      )
      .addCase(login.rejected, (state: AuthState, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
