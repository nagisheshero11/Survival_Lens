import { apiRequest } from './api';

export type PlanType = 'basic' | 'standard' | 'premium';

export type PricingPlan = {
  planType: PlanType;
  price: number;
  benefitAmount: number;
};

export type PricingResponse = {
  plans: PricingPlan[];
  selectedPlan: PricingPlan | null;
};

export async function getPricing(): Promise<PricingResponse> {
  return apiRequest<PricingResponse>('/api/pricing');
}

export async function selectPricingPlan(planType: PlanType): Promise<{ message?: string; selectedPlan?: PricingPlan }> {
  return apiRequest<{ message?: string; selectedPlan?: PricingPlan }, { planType: PlanType }>('/api/pricing/select', {
    method: 'POST',
    body: { planType }
  });
}
