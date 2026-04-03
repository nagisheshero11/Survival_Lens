import { apiRequest } from "./api";

export const COMPANY_CATEGORY_MAP: Record<string, string[]> = {
  "Food Delivery": ["Zomato", "Swiggy"],
  "Quick Commerce": ["Blinkit", "Zepto", "Swiggy Instamart", "BigBasket Now", "Flipkart Minutes"],
  "E-commerce & Marketplaces": ["Amazon India", "Flipkart", "Meesho", "Myntra"],
  "Logistics & Delivery-as-a-Service": ["Delhivery", "Shadowfax", "Ecom Express", "Porter", "Shiprocket", "XpressBees"],
  "Pharmacy & Healthcare": ["PharmEasy", "Tata 1mg", "Apollo Pharmacy"],
  "D2C Brands": ["Nykaa", "Mamaearth", "boAt"],
  "Hyperlocal & Multi-service": ["Dunzo", "Borzo", "WeFast"],
};

export const ALLOWED_CATEGORIES = Object.keys(COMPANY_CATEGORY_MAP);

export type KycCompany = {
  _id?: string;
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

function asTrimmedString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value).trim();
  return "";
}

function normalizeCompanies(value: unknown): KycCompany[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item): KycCompany | null => {
      if (!item || typeof item !== "object") return null;
      const raw = item as Record<string, unknown>;
      const normalizedCompany: KycCompany = {
        category: asTrimmedString(raw.category),
        company: asTrimmedString(raw.company),
        partnerId: asTrimmedString(raw.partnerId),
        dashboardScreenshot: asTrimmedString(raw.dashboardScreenshot),
        verified: Boolean(raw.verified),
      };

      if (typeof raw._id === "string") {
        normalizedCompany._id = raw._id;
      }

      return normalizedCompany;
    })
    .filter((item): item is KycCompany => !!item);
}

export async function getKyc(): Promise<KycData> {
  const data = await apiRequest<{ kyc?: KycData; companies?: KycCompany[] }>("/api/kyc");
  if (!data || typeof data !== "object") {
    throw new Error("Invalid KYC response format");
  }

  console.log("[KYC] GET /api/kyc response:", data);

  const rawKyc = data?.kyc && typeof data.kyc === "object" ? data.kyc : {};
  if (!data?.kyc || typeof data.kyc !== "object") {
    console.warn("[KYC] Response missing 'kyc' object. Falling back to empty form state.");
  }

  const rawCompanies = Array.isArray(rawKyc?.companies) ? rawKyc.companies : data?.companies;
  if (!Array.isArray(rawCompanies)) {
    console.warn("[KYC] Response missing companies array. Falling back to [].");
  }

  const companies = normalizeCompanies(rawCompanies);

  return {
    aadhaar: asTrimmedString(rawKyc?.aadhaar),
    pan: asTrimmedString(rawKyc?.pan),
    photo: asTrimmedString(rawKyc?.photo),
    city: asTrimmedString(rawKyc?.city || rawKyc?.location),
    location: asTrimmedString(rawKyc?.location || rawKyc?.city),
    age:
      rawKyc?.age !== undefined && rawKyc?.age !== null && !Number.isNaN(Number(rawKyc.age))
        ? Number(rawKyc.age)
        : undefined,
    avgWeeklyIncome:
      rawKyc?.avgWeeklyIncome !== undefined && rawKyc?.avgWeeklyIncome !== null && !Number.isNaN(Number(rawKyc.avgWeeklyIncome))
        ? Number(rawKyc.avgWeeklyIncome)
        : undefined,
    avgWorkingHours:
      rawKyc?.avgWorkingHours !== undefined && rawKyc?.avgWorkingHours !== null && !Number.isNaN(Number(rawKyc.avgWorkingHours))
        ? Number(rawKyc.avgWorkingHours)
        : undefined,
    status: typeof rawKyc?.status === "string" ? rawKyc.status : undefined,
    companies,
  };
}

export async function updateKyc(payload: Partial<KycData>): Promise<{ message?: string; status?: string }> {
  const sanitizedCompanies = Array.isArray(payload.companies)
    ? payload.companies.map((company) => ({
        category: asTrimmedString(company.category),
        company: asTrimmedString(company.company),
        partnerId: asTrimmedString(company.partnerId),
        dashboardScreenshot: asTrimmedString(company.dashboardScreenshot),
      }))
    : [];

  const normalizedPayload: Partial<KycData> = {
    aadhaar: asTrimmedString(payload.aadhaar),
    pan: asTrimmedString(payload.pan),
    photo: asTrimmedString(payload.photo),
    city: asTrimmedString(payload.city || payload.location),
    age: payload.age,
    avgWeeklyIncome: payload.avgWeeklyIncome,
    avgWorkingHours: payload.avgWorkingHours,
    companies: sanitizedCompanies,
  };

  console.log("[KYC] POST /api/kyc payload:", normalizedPayload);

  return apiRequest<{ message?: string; status?: string }, Partial<KycData>>("/api/kyc", {
    method: "POST",
    body: normalizedPayload,
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
