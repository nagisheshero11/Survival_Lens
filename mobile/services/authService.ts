import { apiRequest, clearAuthToken, setAuthToken } from "./api";

type AuthUser = Record<string, unknown>;

type AuthResponse = {
  user: AuthUser;
  token?: string;
};

export async function loginUser(credentials: Record<string, unknown>): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse, Record<string, unknown>>("/api/auth/login", {
    method: "POST",
    body: credentials,
    auth: false,
  });

  if (data?.token) {
    await setAuthToken(data.token);
  }

  return data;
}

export async function registerUser(userData: Record<string, unknown>): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse, Record<string, unknown>>("/api/auth/signup", {
    method: "POST",
    body: userData,
    auth: false,
  });

  if (data?.token) {
    await setAuthToken(data.token);
  }

  return data;
}

export async function logoutUser(): Promise<void> {
  try {
    await apiRequest<{ message?: string }, undefined>("/api/auth/logout", { method: "POST" });
  } finally {
    await clearAuthToken();
  }
}

export async function getMe(): Promise<{ user: AuthUser }> {
  return apiRequest<{ user: AuthUser }>("/api/auth/me");
}
