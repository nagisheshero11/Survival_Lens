export const loginUser = async (credentials: any) => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Login failed. Please try again.");
  }

  return data;
};

export const registerUser = async (userData: any) => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Registration failed. Please check your details.");
  }

  return data;
};

export const logoutUser = async () => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Logout failed.");
  }

  return true;
};

export const getMe = async () => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL || process.env.SERVER_API_URL || "";
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to fetch user context.");
  }

  return data;
};
