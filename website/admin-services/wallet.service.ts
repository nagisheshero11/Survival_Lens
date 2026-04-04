import { apiRequest } from "@/services/api";
import type { Wallet } from "@/admin-services/types";

export function getAdminWallet(): Promise<Wallet> {
  return apiRequest<Wallet>("/api/admin/wallet");
}
