"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { approveClaim, getClaimById, rejectClaim } from "@/admin-services/claim.service";
import { getErrorMessage, isUnauthorizedError } from "@/admin-services/error";
import type { Claim } from "@/admin-services/types";

export default function AdminClaimDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const claimId = params.id;

  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await getClaimById(claimId);
      setClaim(data);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        router.replace("/v1/admin/auth/login");
        return;
      }
      setError(getErrorMessage(err, "Failed to load claim"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [claimId]);

  const runAction = async (action: "approve" | "reject") => {
    if (!claim) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      if (action === "approve") {
        await approveClaim(claim.id);
        setSuccess("Claim approved successfully.");
      } else {
        await rejectClaim(claim.id);
        setSuccess("Claim rejected successfully.");
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
      <button onClick={() => router.push("/v1/admin/claims")} className="text-sm font-bold text-blue-600 hover:text-blue-700">Back to claims</button>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{success}</div>}

      {loading || !claim ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500">Loading claim...</div>
      ) : (
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Claim {claim.id}</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p><span className="font-black text-slate-900">User ID:</span> {claim.userId}</p>
            <p><span className="font-black text-slate-900">Amount:</span> INR {claim.amount.toLocaleString("en-IN")}</p>
            <p><span className="font-black text-slate-900">Status:</span> {claim.status}</p>
            <p><span className="font-black text-slate-900">Created At:</span> {claim.createdAt}</p>
            <p><span className="font-black text-slate-900">Reason:</span> {claim.reason}</p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => runAction("approve")}
              disabled={busy}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              Approve Claim
            </button>
            <button
              onClick={() => runAction("reject")}
              disabled={busy}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              Reject Claim
            </button>
          </div>
        </article>
      )}
    </section>
  );
}
