import { backendApi } from "@/services/api";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/auth";

export async function register(payload: RegisterPayload) {
  const response = await backendApi.post<AuthResponse>("/auth/register", payload);
  return response.data;
}

export async function login(payload: LoginPayload) {
  const response = await backendApi.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await backendApi.get<User>("/auth/me");
  return response.data;
}

export async function logout() {
  await backendApi.post("/auth/logout");
}
