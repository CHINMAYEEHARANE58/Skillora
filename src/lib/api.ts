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

  console.debug("[Skillora API] Request", {
    method: config.method,
    url: config.url,
    authenticated: Boolean(token),
  });

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.config) {
      console.error("[Skillora API] Request failed before config was created", error);
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequest;
    const refreshToken = getRefreshToken();

    console.warn("[Skillora API] Response error", {
      status: error.response?.status,
      url: originalRequest.url,
      message: error.message,
    });

    if (
      error.response?.status === 401 &&
      refreshToken &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        console.info("[Skillora Auth] Access token expired. Attempting refresh.");
        const response = await api.post<AuthResponse>("/auth/refresh", { refreshToken });
        persistAuthSession(response.data);
        originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
        originalRequest.headers.set("Authorization", `Bearer ${response.data.accessToken}`);
        return api(originalRequest);
      } catch (refreshError) {
        console.error("[Skillora Auth] Token refresh failed. Redirecting to login.", refreshError);
        clearAuthSession();
        window.location.assign("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
