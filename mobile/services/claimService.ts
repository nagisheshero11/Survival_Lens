import { apiRequest } from "./api";

export type ClaimPayload = {
  reason: string;
  amount: number;
};

export type Claim = {
  reason: string;
  amount: number;
  status: string;
  createdAt: string;
};

export async function createClaim(payload: ClaimPayload): Promise<{ message?: string; status?: string }> {
  return apiRequest<{ message?: string; status?: string }, ClaimPayload>("/api/claims", {
    method: "POST",
    body: payload,
  });
}

export async function getClaims(): Promise<Claim[]> {
  return apiRequest<Claim[]>("/api/claims");
}
