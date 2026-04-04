import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export default async function AdminRootPage() {
  const authenticated = await isAdminAuthenticated();
  redirect(authenticated ? "/v1/admin/dashboard" : "/v1/admin/auth/login");
}
