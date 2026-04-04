import { apiRequest } from "@/services/api";

export type AccessPayload = { username: string; password: string };
export type LoginPayload = { email: string; password: string };
export type SignupPayload = { fullName: string; email: string; mobile: string; password: string };

export function requestAdminAccess(payload: AccessPayload): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/admin/access", { method: "POST", body: payload });
}

export function loginAdmin(payload: LoginPayload): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/admin/auth/login", { method: "POST", body: payload });
}

export function signupAdmin(payload: SignupPayload): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/admin/auth/signup", { method: "POST", body: payload });
}

export function logoutAdmin(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/admin/logout", { method: "POST" });
}
