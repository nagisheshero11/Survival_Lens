import { apiRequest } from "@/services/api";
import type { Payment, PaymentFilters, PaymentStats } from "@/admin-services/types";

export function getPayments(filters: PaymentFilters = {}): Promise<Payment[]> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.userId) params.set("userId", filters.userId);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<Payment[]>(`/api/admin/payments${query}`);
}

export function getPaymentStats(): Promise<PaymentStats> {
  return apiRequest<PaymentStats>("/api/admin/payments/stats");
}
