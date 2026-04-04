"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminWallet } from "@/admin-services/wallet.service";
import { getErrorMessage, isUnauthorizedError } from "@/admin-services/error";
import type { Wallet } from "@/admin-services/types";

export default function AdminWalletPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const data = await getAdminWallet();
        setWallet(data);
      } catch (err) {
        if (isUnauthorizedError(err)) {
          router.replace("/v1/admin/auth/login");
          return;
        }
        setError(getErrorMessage(err, "Failed to load admin wallet"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Admin Wallet</h2>
        <p className="text-sm font-medium text-slate-500">Wallet balance and recent transactions.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

      {loading || !wallet ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500">Loading wallet...</div>
      ) : (
        <>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Balance</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">INR {wallet.balance.toLocaleString("en-IN")}</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-slate-900">Transactions</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Source</th>
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {wallet.transactions.length === 0 ? (
                    <tr><td className="px-3 py-3 text-slate-500" colSpan={5}>No transactions available.</td></tr>
                  ) : (
                    wallet.transactions.map((tx, index) => (
                      <tr key={`${tx.referenceId || tx.createdAt}-${index}`} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-700">{tx.type}</td>
                        <td className="px-3 py-2 text-slate-700">INR {tx.amount.toLocaleString("en-IN")}</td>
                        <td className="px-3 py-2 text-slate-700">{tx.source}</td>
                        <td className="px-3 py-2 text-slate-700">{tx.userName || tx.userId || "-"}</td>
                        <td className="px-3 py-2 text-slate-700">{new Date(tx.createdAt).toLocaleString("en-IN")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </>
      )}
    </section>
  );
}
