// src/api/client.ts
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { getToken, clearToken } from "../lib/auth";

// runtime конфиг от /config.js (ако го има)
declare global {
  interface Window {
    __ENV?: { VITE_API_BASE_URL?: string };
  }
}

const runtimeBase =
  typeof window !== "undefined" ? window.__ENV?.VITE_API_BASE_URL : undefined;

// 1) runtime (/config.js), 2) build-time (Vite), 3) fallback ""
const baseURL = runtimeBase ?? import.meta.env.VITE_API_BASE_URL ?? "";

export const api = axios.create({ baseURL });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearToken();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);
