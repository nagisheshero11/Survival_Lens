import UserPricing, { IPlan, IUserPricing } from '@/models/UserPricing';
import { Types } from 'mongoose';

type UserPricingDocument = NonNullable<Awaited<ReturnType<typeof UserPricing.findOne>>>;

export type PlanType = 'basic' | 'standard' | 'premium';

type GeneratePricingInput = {
  city?: string;
  avgWeeklyIncome?: number;
};

const PLAN_CONFIG: Array<{ planType: PlanType; sourceKey: 'economy_tier' | 'balanced_tier' | 'safety_tier'; coverageMultiplier: number }> = [
  { planType: 'basic', sourceKey: 'economy_tier', coverageMultiplier: 0.5 },
  { planType: 'standard', sourceKey: 'balanced_tier', coverageMultiplier: 1.0 },
  { planType: 'premium', sourceKey: 'safety_tier', coverageMultiplier: 1.5 }
];

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

function resolveBenefitAmount(price: number, avgWeeklyIncome?: number, coverageMultiplier = 1): number {
  const income = toPositiveNumber(avgWeeklyIncome);
  if (income) {
    return Math.round(income * coverageMultiplier);
  }

  // Fallback to price-linked coverage when income is unavailable.
  return Math.round(price * 30 * coverageMultiplier);
}

export async function generatePlansFromBot(input: GeneratePricingInput): Promise<IPlan[]> {
  const botBaseUrl = (process.env.BOT_API_URL || '').replace(/\/$/, '');
  if (!botBaseUrl) {
    throw new Error('BOT_API_URL is not configured');
  }

  const city = String(input.city || '').trim();
  const url = `${botBaseUrl}/premium?city=${encodeURIComponent(city)}`;

  const aiRes = await fetch(url);
  if (!aiRes.ok) {
    throw new Error(`Pricing engine request failed with status ${aiRes.status}`);
  }

  const data = await aiRes.json();
  const options = data?.weekly_premium_options || {};

  return PLAN_CONFIG.map(({ planType, sourceKey, coverageMultiplier }) => {
    const price = toPlanAmount(options?.[sourceKey]);
    return {
      planType,
      price,
      benefitAmount: resolveBenefitAmount(price, input.avgWeeklyIncome, coverageMultiplier)
    };
  });
}

export async function regenerateUserPricing(params: {
  userId: Types.ObjectId;
  city?: string;
  avgWeeklyIncome?: number;
}): Promise<UserPricingDocument> {
  const plans = await generatePlansFromBot({
    city: params.city,
    avgWeeklyIncome: params.avgWeeklyIncome
  });

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
