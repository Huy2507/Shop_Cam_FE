import { refreshToken } from "@features/Auth/services/authService";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  ignoreRefresh?: boolean;
}

const api = axios.create({
  // Để trống + proxy Vite /api → tránh CORS khi dev (xem vite.config và .env.example).
  baseURL: import.meta.env.VITE_API_URL ?? "",
  timeout: 600000,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const shouldSkipRefresh = (config: CustomInternalAxiosRequestConfig) => {
  const skipEndpoints = [
    "/login",
    "/verify-otp",
    "/forgot-password",
    "/set-password",
  ];
  const url = config.url || "";
  return (
    config.ignoreRefresh === true ||
    skipEndpoints.some((endpoint) => url.endsWith(endpoint))
  );
};

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    if (response.headers["content-type"]?.includes("text/html")) {
      return Promise.reject(new Error("Invalid response type"));
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (shouldSkipRefresh(originalRequest)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    isRefreshing = true;

    try {
      await refreshToken();
      processQueue(null);
      return api(originalRequest);
    } catch (err) {
      processQueue(err instanceof Error ? err : new Error("Unknown error"));
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
