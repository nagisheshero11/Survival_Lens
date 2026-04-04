"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUsers } from "@/admin-services/user.service";
import { getErrorMessage, isUnauthorizedError } from "@/admin-services/error";
import type { User } from "@/admin-services/types";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [kycStatus, setKycStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setError("");
      const data = await getUsers({
        company: company || undefined,
        city: city || undefined,
        kycStatus: kycStatus || undefined,
      });
      setUsers(data);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        router.replace("/v1/admin/auth/login");
        return;
      }
      setError(getErrorMessage(err, "Failed to load users"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Users</h2>
        <p className="text-sm font-medium text-slate-500">Filter users by company, city, and KYC status.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <select value={kycStatus} onChange={(e) => setKycStatus(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <option value="">All KYC Status</option>
          <option value="not_started">not_started</option>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
        </select>
        <button onClick={loadUsers} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">Apply Filters</button>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-[11px] font-black uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">KYC</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-4 text-slate-500" colSpan={6}>Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td className="px-4 py-4 text-slate-500" colSpan={6}>No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-900">{user.fullName}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 text-slate-600">{user.company || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{user.city || "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{user.kycStatus}</td>
                  <td className="px-4 py-3">
                    <Link href={`/v1/admin/users/${user.id}`} className="font-bold text-blue-600 hover:text-blue-700">View</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
