const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";

type PricingPlan = {
  planType: "basic" | "standard" | "premium";
  price: number;
};

export type PricingResponse = {
  plans: PricingPlan[];
  selectedPlan: PricingPlan | null;
};

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function getPricing(): Promise<PricingResponse> {
  const res = await fetch(`${API_URL}/api/pricing`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to fetch pricing");
  }

  return data as PricingResponse;
}

export async function selectPricingPlan(planType: "basic" | "standard" | "premium") {
  const res = await fetch(`${API_URL}/api/pricing/select`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ planType }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to select pricing plan");
  }

  return data;
}
