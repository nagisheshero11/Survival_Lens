export interface IKycCompany {
  id: string; 
  category: string;
  company: string;
  partnerId: string;
  dashboardScreenshot: string;
  verified?: boolean;
}

export interface IKycData {
  aadhaar: string;
  pan: string;
  photo: string;
  city: string;
  location?: string;
  serviceZone?: string;
  zone?: string;
  population?: number;
  age: number | undefined;
  avgWeeklyIncome: number | undefined;
  avgWorkingHours: number | undefined;
  status: string;
  companies: IKycCompany[];
}

export const getKycData = async () => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  
  const res = await fetch(`${API_URL}/api/kyc`, {
    method: "GET",
    headers: token ? { "Authorization": `Bearer ${token}` } : {},
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch kyc");
  
  const data = await res.json();
  return data.kyc;
};

export const saveKycData = async (payload: Partial<IKycData>) => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${API_URL}/api/kyc`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(payload)
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to save kyc");
  return data;
};

export const saveKycPhotoCapture = async (photo: File) => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

  const formData = new FormData();
  formData.append("photo", photo);

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api/kyc`, {
    method: "POST",
    headers,
    credentials: "include",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to save profile photo");
  }

  return data as { message: string; status: string; kyc?: { photo?: string; updatedAt?: string } };
};

export const uploadKycDocument = async (
  file: File,
  field: "dashboardScreenshot"
) => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("field", field);

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api/kyc/upload`, {
    method: "POST",
    headers,
    credentials: "include",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to upload document");
  }

  return data as { url: string };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const calculateKycCompletion = (kycData: any, companies: IKycCompany[] = []) => {
  const fields = [
    kycData?.aadhaar, kycData?.pan, kycData?.photo, kycData?.city || kycData?.location,
    kycData?.age, kycData?.avgWeeklyIncome, kycData?.avgWorkingHours
  ];
  let filledFields = fields.filter(f => f && f.toString().trim() !== "").length;
  let totalFields = fields.length;

  const validCompanies = Array.isArray(companies) ? companies : [];
  validCompanies.forEach(company => {
     const companyFields = [company.category, company.company, company.partnerId, company.dashboardScreenshot];
     totalFields += companyFields.length;
     filledFields += companyFields.filter(f => f && f.toString().trim() !== "").length;
  });

  const percentage = Math.round((filledFields / Math.max(1, totalFields)) * 100);
  return { percentage, filledFields, totalFields };
};
