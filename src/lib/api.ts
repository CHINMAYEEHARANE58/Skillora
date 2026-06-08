import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { clearAuthSession, getAccessToken, getRefreshToken, persistAuthSession } from "./auth-storage";
import type { AuthResponse } from "../types/auth";

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequest;
    const refreshToken = getRefreshToken();

    if (
      error.response?.status === 401 &&
      refreshToken &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post<AuthResponse>("/auth/refresh", { refreshToken });
        persistAuthSession(response.data);
        originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
        originalRequest.headers.set("Authorization", `Bearer ${response.data.accessToken}`);
        return api(originalRequest);
      } catch (refreshError) {
        clearAuthSession();
        window.location.assign("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
