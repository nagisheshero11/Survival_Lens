import { apiRequest } from "./api";

export type WalletTransaction = {
  type: "credit" | "debit";
  amount: number;
  reason: "claim" | "withdraw" | "premium";
  status: "pending" | "completed" | "failed";
  paymentRef: string;
  createdAt: string;
};

export type WalletResponse = {
  balance: number;
  transactions: WalletTransaction[];
};

export async function getWallet(): Promise<WalletResponse> {
  return apiRequest<WalletResponse>("/api/wallet");
}

export async function withdraw(amount: number): Promise<{ message?: string; balance?: number }> {
  return apiRequest<{ message?: string; balance?: number }, { amount: number }>("/api/wallet/withdraw", {
    method: "POST",
    body: { amount },
  });
}

export async function payPremium(): Promise<{ message?: string; paymentRef?: string; balance?: number }> {
  return apiRequest<{ message?: string; paymentRef?: string; balance?: number }>("/api/wallet/pay-premium", {
    method: "POST",
  });
}
