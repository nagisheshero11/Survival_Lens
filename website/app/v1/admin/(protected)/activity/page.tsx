"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, getRange, getToday } from "@/admin-services/activity.service";
import { getErrorMessage, isUnauthorizedError } from "@/admin-services/error";
import type { ActivityProfile, ActivityRangeItem, ActivityToday } from "@/admin-services/types";

export default function AdminActivityPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [profile, setProfile] = useState<ActivityProfile | null>(null);
  const [today, setToday] = useState<ActivityToday | null>(null);
  const [range, setRange] = useState<ActivityRangeItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!userId.trim()) {
      setError("User ID is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [profileData, todayData, rangeData] = await Promise.all([
        getProfile(userId.trim()),
        getToday(userId.trim()),
        from && to ? getRange({ userId: userId.trim(), from, to }) : Promise.resolve([]),
      ]);

      setProfile(profileData);
      setToday(todayData);
      setRange(rangeData);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        router.replace("/v1/admin/auth/login");
        return;
      }
      setError(getErrorMessage(err, "Failed to load activity"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Activity</h2>
        <p className="text-sm font-medium text-slate-500">Fetch profile, today, and date-range activity by user ID.</p>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" required />
        <input value={from} onChange={(e) => setFrom(e.target.value)} type="date" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <input value={to} onChange={(e) => setTo(e.target.value)} type="date" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        <button type="submit" disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-blue-300">
          {loading ? "Loading..." : "Fetch Activity"}
        </button>
      </form>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

      {profile && (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-black text-slate-900">Profile</h3>
          <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-2">
            <p><span className="font-black text-slate-900">Company:</span> {profile.company}</p>
            <p><span className="font-black text-slate-900">City:</span> {profile.city}</p>
            <p><span className="font-black text-slate-900">Zone:</span> {profile.zone}</p>
            <p><span className="font-black text-slate-900">Rating:</span> {profile.rating}</p>
            <p><span className="font-black text-slate-900">Working Hours/Day:</span> {profile.workingHoursPerDay}</p>
            <p><span className="font-black text-slate-900">Avg Orders/Day:</span> {profile.avgOrdersPerDay}</p>
          </div>
        </article>
      )}

      {today && (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-black text-slate-900">Today</h3>
          <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-2">
            <p><span className="font-black text-slate-900">Date:</span> {today.date}</p>
            <p><span className="font-black text-slate-900">Hours Worked:</span> {today.hoursWorked}</p>
            <p><span className="font-black text-slate-900">Orders Completed:</span> {today.ordersCompleted}</p>
            <p><span className="font-black text-slate-900">Total Earnings:</span> INR {today.totalEarnings.toLocaleString("en-IN")}</p>
            <p><span className="font-black text-slate-900">Weather:</span> {today.weather}</p>
          </div>
        </article>
      )}

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-black text-slate-900">Range Activity</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-[11px] font-black uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Orders</th>
                <th className="px-3 py-2">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {range.length === 0 ? (
                <tr><td className="px-3 py-3 text-slate-500" colSpan={3}>No range records to show.</td></tr>
              ) : (
                range.map((item) => (
                  <tr key={item.date} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-700">{item.date}</td>
                    <td className="px-3 py-2 text-slate-700">{item.ordersCompleted}</td>
                    <td className="px-3 py-2 text-slate-700">INR {item.totalEarnings.toLocaleString("en-IN")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
