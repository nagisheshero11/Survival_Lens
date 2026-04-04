import { getWorkerProfileModel } from '@/models/WorkerProfile';

type WorkerProfileInput = {
  userId: string;
  partnerId: string;
  company?: string;
  city?: string;
  zone?: string;
  avgWeeklyIncome?: unknown;
  avgWorkingHours?: unknown;
};

export type WorkerProfilePricingInput = {
  partnerId: string;
  company: string;
  city: string;
  avgWeeklyIncome: number;
  avgWorkingHours: number;
};

function hashToUint32(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seed: string): () => number {
  let state = hashToUint32(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function asPositiveNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function withControlledVariation(base: number, minPercent: number, maxPercent: number, rand: () => number): number {
  const direction = rand() < 0.5 ? -1 : 1;
  const variation = minPercent + rand() * (maxPercent - minPercent);
  return base * (1 + direction * variation);
}

function round(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export async function ensureWorkerProfileForApprovedKyc(input: WorkerProfileInput) {
  const partnerId = String(input.partnerId || '').trim();
  if (!partnerId) {
    return null;
  }

  const WorkerProfile = await getWorkerProfileModel();

  const existingProfile = await WorkerProfile.findOne({
    $or: [{ partnerId }, { userId: partnerId }],
  });

  if (existingProfile) {
    return existingProfile;
  }

  const safeIncome = asPositiveNumber(input.avgWeeklyIncome) ?? 8000;
  const safeWeeklyHours = asPositiveNumber(input.avgWorkingHours) ?? 56;
  const company = String(input.company || '').trim() || 'Unknown Company';
  const city = String(input.city || '').trim() || 'Unknown City';
  const zone = String(input.zone || '').trim();

  const rand = createSeededRandom([
    partnerId,
    String(input.userId || ''),
    company.toLowerCase(),
    city.toLowerCase(),
  ].join('|'));

  const avgWeeklyIncome = round(
    clamp(withControlledVariation(safeIncome, 0.05, 0.15, rand), 1000, 500000),
    0
  );

  const avgWorkingHours = round(
    clamp(withControlledVariation(safeWeeklyHours, 0.05, 0.1, rand), 14, 112),
    1
  );

  const avgDailyIncome = round(avgWeeklyIncome / 7, 2);
  const workingHoursPerDay = round(avgWorkingHours / 7, 2);

  const ordersPerHour = 1.1 + rand() * 1.3;
  const avgOrdersPerDay = round(clamp(workingHoursPerDay * ordersPerHour, 1, 60), 1);
  const avgEarningPerOrder = round(avgDailyIncome / avgOrdersPerDay, 2);
  const acceptanceRate = round(82 + rand() * 14, 2);
  const completionRate = round(88 + rand() * 10, 2);
  const rating = round(4.1 + rand() * 0.8, 2);

  return WorkerProfile.create({
    userId: partnerId,
    partnerId,
    company,
    city,
    zone,
    avgWeeklyIncome,
    avgWorkingHours,
    avgDailyIncome,
    workingHoursPerDay,
    workingDaysPerWeek: 7,
    avgOrdersPerDay,
    avgEarningPerOrder,
    acceptanceRate,
    completionRate,
    rating,
  });
}

function toPricingNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

export async function getWorkerProfilePricingInputByPartnerId(partnerId: string): Promise<WorkerProfilePricingInput | null> {
  const normalizedPartnerId = String(partnerId || '').trim();
  if (!normalizedPartnerId) {
    return null;
  }

  const WorkerProfile = await getWorkerProfileModel();
  const profile = await WorkerProfile.findOne({
    $or: [{ partnerId: normalizedPartnerId }, { userId: normalizedPartnerId }],
  }).lean();

  if (!profile) {
    return null;
  }

  return {
    partnerId: normalizedPartnerId,
    company: String(profile.company || '').trim() || 'Unknown Company',
    city: String(profile.city || '').trim() || 'Unknown City',
    avgWeeklyIncome: toPricingNumber(profile.avgWeeklyIncome, 8000),
    avgWorkingHours: toPricingNumber(profile.avgWorkingHours, 40),
  };
}
