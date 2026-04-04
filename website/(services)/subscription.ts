export const getSubscription = async () => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/subscription`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(data.message || data.error || 'Failed to fetch subscription');
  }
  return data;
};

export const selectPlan = async (planType: "basic" | "standard" | "premium") => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/subscription/select`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ planType }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to select plan');
  return data;
};

export const paySubscription = async () => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/subscription/pay`, {
    method: "POST",
    headers,
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Payment failed');
  return data;
};
