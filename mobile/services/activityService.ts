import { apiRequest } from "./api";

export async function getProfile(userId?: string): Promise<Record<string, unknown>> {
  if (userId) {
    return apiRequest<Record<string, unknown>>("/api/mock/profile", { query: { userId } });
  }
  return apiRequest<Record<string, unknown>>("/api/user/mock-profile");
}

export async function getTodayActivity(userId: string): Promise<Record<string, unknown>> {
  return apiRequest<Record<string, unknown>>("/api/mock/today", {
    query: { userId },
  });
}

export async function getRangeActivity(userId: string, from?: string, to?: string): Promise<Record<string, unknown>[]> {
  return apiRequest<Record<string, unknown>[]>("/api/mock/weekly", {
    query: { userId, from, to },
  });
}
