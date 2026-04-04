import { ApiError, apiRequest } from "./api";
import type { PlanType } from "./pricingService";

export type Subscription = {
  planAmount: number;
  planName: string;
  totalPayments: number;
  duePayments: number;
  status: string;
  lastPaymentDate: string | null;
  startDate: string;
};

export async function getSubscription(): Promise<Subscription | null> {
  try {
    return await apiRequest<Subscription>("/api/subscription");
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function selectPlan(planType: PlanType): Promise<{ message?: string; subscription?: Subscription }> {
  return apiRequest<{ message?: string; subscription?: Subscription }, { planType: PlanType }>("/api/subscription/select", {
    method: "POST",
    body: { planType },
  });
}

export async function paySubscription(): Promise<{ message?: string; paymentRef?: string; subscription?: Partial<Subscription> }> {
  return apiRequest<{ message?: string; paymentRef?: string; subscription?: Partial<Subscription> }>("/api/subscription/pay", {
    method: "POST",
  });
}
