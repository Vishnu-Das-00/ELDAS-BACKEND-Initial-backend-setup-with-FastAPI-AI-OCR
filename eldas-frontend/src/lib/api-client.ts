import axios from "axios";
import { toast } from "sonner";

import { env } from "@/lib/env";
import { useAuthStore } from "@/store/auth-store";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;
    const detail =
      response?.data?.detail ||
      response?.data?.message ||
      "Something went wrong while talking to the Eldas API.";

    if (
      response?.status === 401 &&
      !String(config?.url ?? "").includes("/auth/login") &&
      !String(config?.url ?? "").includes("/auth/signup")
    ) {
      useAuthStore.getState().logout();
      toast.error("Your session expired. Please sign in again.");
    }

    return Promise.reject(new Error(detail));
  },
);
