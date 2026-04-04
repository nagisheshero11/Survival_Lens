export const getWallet = async () => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/wallet`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch wallet info');
  return data;
};

export const withdraw = async (amount: number) => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/wallet/withdraw`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ amount }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Withdrawal failed');
  return data;
};

export const payPremium = async () => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/wallet/pay-premium`, {
    method: "POST",
    headers,
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Payment failed');
  return data;
};
