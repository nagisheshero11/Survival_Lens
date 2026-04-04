export type KycStatus = "not_started" | "pending" | "approved" | "rejected";
export type ClaimStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  fullName: string;
  email: string;
  company: string;
  city: string;
  kycStatus: KycStatus;
}

export interface UserDetail {
  id: string;
  fullName: string;
  email: string;
  mobile?: string;
  company: string;
  city: string;
  kyc: {
    status: KycStatus;
  };
}

export interface Claim {
  id: string;
  userId: string;
  reason: string;
  amount: number;
  status: ClaimStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  type: string;
  method: string;
  status: string;
  paymentRef: string;
  createdAt: string;
}

export interface PaymentStats {
  totalPayments: number;
  totalRevenue: number;
}

export interface ActivityProfile {
  company: string;
  city: string;
  zone: string;
  workingHoursPerDay: number;
  avgOrdersPerDay: number;
  avgDailyIncome: number;
  rating: number;
}

export interface ActivityToday {
  date: string;
  hoursWorked: number;
  ordersCompleted: number;
  totalEarnings: number;
  weather: string;
}

export interface ActivityRangeItem {
  date: string;
  ordersCompleted: number;
  totalEarnings: number;
}

export interface WalletTransaction {
  type: string;
  amount: number;
  source: string;
  userId?: string;
  userName?: string;
  referenceId?: string;
  createdAt: string;
}

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
}

export type UserFilters = {
  company?: string;
  city?: string;
  kycStatus?: string;
};

export type ClaimFilters = {
  status?: string;
  userId?: string;
};

export type PaymentFilters = {
  status?: string;
  userId?: string;
};
