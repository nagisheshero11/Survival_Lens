import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type AdminTokenPayload = {
  userId: string;
  role?: string;
};

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token || !process.env.JWT_SECRET) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as AdminTokenPayload;
    return decoded.role === "admin";
  } catch {
    return false;
  }
}
