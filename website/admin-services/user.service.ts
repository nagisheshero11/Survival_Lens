import { apiRequest } from "@/services/api";
import type { User, UserDetail, UserFilters } from "@/admin-services/types";

export function getUsers(filters: UserFilters = {}): Promise<User[]> {
  const params = new URLSearchParams();
  if (filters.company) params.set("company", filters.company);
  if (filters.city) params.set("city", filters.city);
  if (filters.kycStatus) params.set("kycStatus", filters.kycStatus);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<User[]>(`/api/admin/users${query}`);
}

export function getUserById(id: string): Promise<UserDetail> {
  return apiRequest<UserDetail>(`/api/admin/users/${id}`);
}

export function approveKyc(userId: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/admin/users/kyc/approve", {
    method: "POST",
    body: { userId },
  });
}

export function rejectKyc(userId: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/admin/users/kyc/reject", {
    method: "POST",
    body: { userId },
  });
}
