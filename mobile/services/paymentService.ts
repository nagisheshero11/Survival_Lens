import { apiRequest } from "./api";

export type Payment = {
  amount: number;
  status: string;
  paymentRef: string;
  createdAt: string;
};

export async function getPayments(): Promise<Payment[]> {
  return apiRequest<Payment[]>("/api/payments");
}

export async function payPremium(): Promise<{ message?: string; paymentRef?: string; balance?: number }> {
  return apiRequest<{ message?: string; paymentRef?: string; balance?: number }>("/api/payments/premium", {
    method: "POST",
  });
}
