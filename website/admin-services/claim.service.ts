import { apiRequest } from "@/services/api";
import type { Claim, ClaimFilters } from "@/admin-services/types";

export function getClaims(filters: ClaimFilters = {}): Promise<Claim[]> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.userId) params.set("userId", filters.userId);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<Claim[]>(`/api/admin/claims${query}`);
}

export function getClaimById(id: string): Promise<Claim> {
  return apiRequest<Claim>(`/api/admin/claims/${id}`);
}

export function approveClaim(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/admin/claims/approve", {
    method: "POST",
    body: { claimId: id },
  });
}

export function rejectClaim(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/admin/claims/reject", {
    method: "POST",
    body: { claimId: id },
  });
}
