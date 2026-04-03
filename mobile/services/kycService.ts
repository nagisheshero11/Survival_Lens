import { apiRequest } from "./api";

export type KycCompany = {
  id?: string;
  category: string;
  company: string;
  partnerId: string;
  dashboardScreenshot: string;
  verified?: boolean;
};

export type KycData = {
  aadhaar?: string;
  pan?: string;
  photo?: string;
  city?: string;
  location?: string;
  age?: number;
  avgWeeklyIncome?: number;
  avgWorkingHours?: number;
  status?: string;
  companies?: KycCompany[];
};

export async function getKyc(): Promise<KycData | null> {
  const data = await apiRequest<{ kyc?: KycData }>("/api/kyc");
  return data?.kyc || null;
}

export async function updateKyc(payload: Partial<KycData>): Promise<{ message?: string; status?: string }> {
  return apiRequest<{ message?: string; status?: string }, Partial<KycData>>("/api/kyc", {
    method: "POST",
    body: payload,
  });
}

export function calculateKycCompletion(kycData: KycData | null, companies: KycCompany[] = []) {
  const fields = [
    kycData?.aadhaar,
    kycData?.pan,
    kycData?.photo,
    kycData?.city || kycData?.location,
    kycData?.age,
    kycData?.avgWeeklyIncome,
    kycData?.avgWorkingHours,
  ];

  let filledFields = fields.filter((value) => value !== undefined && value !== null && String(value).trim() !== "").length;
  let totalFields = fields.length;

  companies.forEach((company) => {
    const companyFields = [company.category, company.company, company.partnerId, company.dashboardScreenshot];
    totalFields += companyFields.length;
    filledFields += companyFields.filter((value) => value !== undefined && value !== null && String(value).trim() !== "").length;
  });

  const percentage = Math.round((filledFields / Math.max(1, totalFields)) * 100);
  return { percentage, filledFields, totalFields };
}
