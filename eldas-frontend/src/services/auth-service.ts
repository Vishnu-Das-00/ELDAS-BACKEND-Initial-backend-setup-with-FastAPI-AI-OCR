import { apiClient } from "@/lib/api-client";
import type { AuthResponse, UserRole } from "@/types/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  name: string;
  role: UserRole;
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function signup(payload: SignupPayload) {
  const { data } = await apiClient.post<AuthResponse>("/auth/signup", payload);
  return data;
}
