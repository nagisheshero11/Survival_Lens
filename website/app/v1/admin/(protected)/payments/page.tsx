"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPayments } from "@/admin-services/payment.service";
import { getErrorMessage, isUnauthorizedError } from "@/admin-services/error";
import type { Payment } from "@/admin-services/types";

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await getPayments({ status: status || undefined, userId: userId || undefined });
      setPayments(data);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        router.replace("/v1/admin/auth/login");
        return;
      }
      setError(getErrorMessage(err, "Failed to load payments"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Payments</h2>
        <p className="text-sm font-medium text-slate-500">View payment amount, status, and references.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <option value="">All status</option>
          <option value="success">success</option>
          <option value="failed">failed</option>
          <option value="pending">pending</option>
        </select>
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <button onClick={load} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">Apply Filters</button>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-[11px] font-black uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Payment ID</th>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-4 text-slate-500" colSpan={6}>Loading payments...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td className="px-4 py-4 text-slate-500" colSpan={6}>No payments found.</td></tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-900">{payment.id}</td>
                  <td className="px-4 py-3 text-slate-600">{payment.userId}</td>
                  <td className="px-4 py-3 text-slate-600">INR {payment.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-slate-600">{payment.status}</td>
                  <td className="px-4 py-3 text-slate-600">{payment.paymentRef || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{payment.createdAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
