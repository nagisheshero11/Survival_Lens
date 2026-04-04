"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers } from "@/admin-services/user.service";
import { getClaims } from "@/admin-services/claim.service";
import { getPaymentStats } from "@/admin-services/payment.service";
import { getErrorMessage, isUnauthorizedError } from "@/admin-services/error";

type Summary = {
  totalUsers: number;
  totalClaims: number;
  totalPayments: number;
  totalRevenue: number;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<Summary>({ totalUsers: 0, totalClaims: 0, totalPayments: 0, totalRevenue: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const [users, claims, paymentStats] = await Promise.all([getUsers(), getClaims(), getPaymentStats()]);
        setSummary({
          totalUsers: users.length,
          totalClaims: claims.length,
          totalPayments: paymentStats.totalPayments,
          totalRevenue: paymentStats.totalRevenue,
        });
      } catch (err) {
        if (isUnauthorizedError(err)) {
          router.replace("/v1/admin/auth/login");
          return;
        }
        setError(getErrorMessage(err, "Failed to load dashboard"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const cards = [
    { label: "Total Users", value: summary.totalUsers },
    { label: "Total Claims", value: summary.totalClaims },
    { label: "Total Payments", value: summary.totalPayments },
    { label: "Total Revenue", value: `INR ${summary.totalRevenue.toLocaleString("en-IN")}` },
  ];

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-sm font-medium text-slate-500">Admin summary connected to backend APIs.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500">Loading dashboard data...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">{card.value}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
