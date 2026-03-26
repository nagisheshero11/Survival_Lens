export const loginUser = async (credentials: any) => {
  const API_URL = process.env.SERVER_API_URL || "";
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed. Please try again.");
  }

  return data;
};

export const registerUser = async (userData: any) => {
  const API_URL = process.env.SERVER_API_URL || "";
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Registration failed. Please check your details.");
  }

  return data;
};
