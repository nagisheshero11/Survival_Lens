"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getClaims } from "@/admin-services/claim.service";
import { getErrorMessage, isUnauthorizedError } from "@/admin-services/error";
import type { Claim } from "@/admin-services/types";

export default function AdminClaimsPage() {
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClaims = async () => {
    try {
      setError("");
      const data = await getClaims({ status: status || undefined, userId: userId || undefined });
      setClaims(data);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        router.replace("/v1/admin/auth/login");
        return;
      }
      setError(getErrorMessage(err, "Failed to load claims"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Claims</h2>
        <p className="text-sm font-medium text-slate-500">Review claims with status and user filters.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <option value="">All status</option>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
        </select>
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <button onClick={loadClaims} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">Apply Filters</button>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-[11px] font-black uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Claim ID</th>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-4 text-slate-500" colSpan={6}>Loading claims...</td></tr>
            ) : claims.length === 0 ? (
              <tr><td className="px-4 py-4 text-slate-500" colSpan={6}>No claims found.</td></tr>
            ) : (
              claims.map((claim) => (
                <tr key={claim.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-900">{claim.id}</td>
                  <td className="px-4 py-3 text-slate-600">{claim.userId}</td>
                  <td className="px-4 py-3 text-slate-600">INR {claim.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-slate-600">{claim.status}</td>
                  <td className="px-4 py-3 text-slate-600">{claim.createdAt}</td>
                  <td className="px-4 py-3"><Link href={`/v1/admin/claims/${claim.id}`} className="font-bold text-blue-600 hover:text-blue-700">View</Link></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
