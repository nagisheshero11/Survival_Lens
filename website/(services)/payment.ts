export const getPayments = async () => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/payments`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch payments');
  return data;
};

export const payPremium = async () => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/payments/premium`, {
    method: "POST",
    headers,
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Payment failed');
  return data;
};
