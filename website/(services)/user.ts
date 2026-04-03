export const getMockProfile = async () => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/user/mock-profile`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Failed to fetch mock profile');
  return data;
};
