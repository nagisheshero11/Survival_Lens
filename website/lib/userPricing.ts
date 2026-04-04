import UserPricing, { IPlan, IUserPricing } from '@/models/UserPricing';
import { Types } from 'mongoose';
import { getWorkerProfilePricingInputByPartnerId, WorkerProfilePricingInput } from '@/lib/workerProfile';

type UserPricingDocument = NonNullable<Awaited<ReturnType<typeof UserPricing.findOne>>>;

export type PlanType = 'basic' | 'standard' | 'premium';

type GeneratePricingInput = {
  partnerId: string;
  company: string;
  city?: string;
  avgWeeklyIncome: number;
  avgWorkingHours: number;
};

const PLAN_CONFIG: Array<{ planType: PlanType; multiplier: number }> = [
  { planType: 'basic', multiplier: 0.8 },
  { planType: 'standard', multiplier: 1.0 },
  { planType: 'premium', multiplier: 1.2 }
];

export function hasValidPricingPlans(plans: unknown): plans is IPlan[] {
  if (!Array.isArray(plans) || plans.length !== 3) return false;

  const expectedTypes = new Set<PlanType>(['basic', 'standard', 'premium']);
  const seenTypes = new Set<PlanType>();

  for (const item of plans) {
    if (!item || typeof item !== 'object') return false;

    const plan = item as Partial<IPlan>;
    if (typeof plan.planType !== 'string' || !expectedTypes.has(plan.planType as PlanType)) {
      return false;
    }

    if (seenTypes.has(plan.planType as PlanType)) {
      return false;
    }

    if (!Number.isFinite(Number(plan.price)) || Number(plan.price) <= 0) {
      return false;
    }

    if (!Number.isFinite(Number(plan.benefitAmount)) || Number(plan.benefitAmount) <= 0) {
      return false;
    }

    seenTypes.add(plan.planType as PlanType);
  }

  return seenTypes.size === expectedTypes.size;
}

function toPositiveNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function toPlanAmount(value: unknown): number {
  const parsed = toPositiveNumber(value);
  if (!parsed) {
    throw new Error('Invalid pricing value from pricing engine');
  }
  return Math.round(parsed);
}

function resolveBenefitAmount(price: number): number {
  return Math.round(price * 40);
}

function generateFallbackPlans(input: GeneratePricingInput): IPlan[] {
  const weeklyIncome = toPositiveNumber(input.avgWeeklyIncome) ?? 8000;
  const weeklyHours = toPositiveNumber(input.avgWorkingHours) ?? 40;
  const basePrice = Math.max(50, weeklyIncome / weeklyHours);

  return PLAN_CONFIG.map(({ planType, multiplier }) => {
    const price = Math.round(basePrice * multiplier);
    return {
      planType,
      price,
      benefitAmount: resolveBenefitAmount(price),
    };
  });
}

export async function generatePlansFromBot(input: GeneratePricingInput): Promise<IPlan[]> {
  const botBaseUrl = (process.env.BOT_API_URL || '').replace(/\/$/, '');
  if (!botBaseUrl) {
    throw new Error('BOT_API_URL is not configured');
  }

  const url = `${botBaseUrl}/pricing`;

  const aiRes = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      avgWeeklyIncome: input.avgWeeklyIncome,
      avgWorkingHours: input.avgWorkingHours,
      city: String(input.city || '').trim(),
      company: String(input.company || '').trim(),
      partnerId: input.partnerId,
    }),
  });
  if (!aiRes.ok) {
    throw new Error(`Pricing engine request failed with status ${aiRes.status}`);
  }

  const data = await aiRes.json();

  if (Array.isArray(data?.plans)) {
    return data.plans.map((item: any) => ({
      planType: item.planType,
      price: toPlanAmount(item.price),
      benefitAmount: toPlanAmount(item.benefitAmount),
    }));
  }

  throw new Error('Invalid pricing engine response format');
}

export async function regenerateUserPricing(params: {
  userId: Types.ObjectId;
  partnerId: string;
}): Promise<UserPricingDocument> {
  const workerProfile: WorkerProfilePricingInput | null =
    await getWorkerProfilePricingInputByPartnerId(params.partnerId);

  if (!workerProfile) {
    throw new Error('Worker profile not found for pricing generation');
  }

  let plans: IPlan[];

  try {
    plans = await generatePlansFromBot(workerProfile);
  } catch {
    plans = generateFallbackPlans(workerProfile);
  }

  if (!hasValidPricingPlans(plans)) {
    throw new Error('Pricing engine returned invalid plans');
  }

  const updated = await UserPricing.findOneAndUpdate(
    { userId: params.userId },
    {
      $setOnInsert: {
        userId: params.userId,
        selectedPlan: null
      },
      $set: { plans }
    },
    { upsert: true, new: true }
  );

  if (!updated) {
    throw new Error('Failed to regenerate pricing');
  }

  return updated;
}
