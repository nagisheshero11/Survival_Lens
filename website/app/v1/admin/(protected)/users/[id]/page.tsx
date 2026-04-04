"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { approveKyc, getUserById, rejectKyc } from "@/admin-services/user.service";
import { getErrorMessage, isUnauthorizedError } from "@/admin-services/error";
import type { UserDetail } from "@/admin-services/types";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = params.id;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await getUserById(userId);
      setUser(data);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        router.replace("/v1/admin/auth/login");
        return;
      }
      setError(getErrorMessage(err, "Failed to load user"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userId]);

  const runKycAction = async (action: "approve" | "reject") => {
    if (!user) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      if (action === "approve") {
        await approveKyc(user.id);
        setSuccess("KYC approved successfully.");
      } else {
        await rejectKyc(user.id);
        setSuccess("KYC rejected successfully.");
      }
      await load();
    } catch (err) {
      if (isUnauthorizedError(err)) {
        router.replace("/v1/admin/auth/login");
        return;
      }
      setError(getErrorMessage(err, "Action failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-5">
      <button onClick={() => router.push("/v1/admin/users")} className="text-sm font-bold text-blue-600 hover:text-blue-700">Back to users</button>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{success}</div>}

      {loading || !user ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500">Loading user...</div>
      ) : (
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">{user.fullName}</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
            <p><span className="font-black text-slate-900">Email:</span> {user.email}</p>
            <p><span className="font-black text-slate-900">Mobile:</span> {user.mobile || "-"}</p>
            <p><span className="font-black text-slate-900">Company:</span> {user.company || "-"}</p>
            <p><span className="font-black text-slate-900">City:</span> {user.city || "-"}</p>
            <p><span className="font-black text-slate-900">KYC Status:</span> {user.kyc.status}</p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => runKycAction("approve")}
              disabled={busy}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              Approve KYC
            </button>
            <button
              onClick={() => runKycAction("reject")}
              disabled={busy}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              Reject KYC
            </button>
          </div>
        </article>
      )}
    </section>
  );
}
