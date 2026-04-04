"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";

type MonitorRun = {
  id: string;
  startedAt: string;
  finishedAt: string | null;
  status: "skipped" | "completed" | "failed";
  reason: string | null;
  scannedCities: string[];
  createdIncidents: number;
  createdNotifications: number;
};

type MonitorData = {
  summary: {
    openIncidents: number;
    completedRuns: number;
    totalIncidents: number;
    totalNotifications: number;
    latestIncidentAt: string | null;
  };
  runs: MonitorRun[];
};

export default function WeatherMonitorPage() {
  const [data, setData] = useState<MonitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [runningScan, setRunningScan] = useState(false);
  const [error, setError] = useState("");

  async function loadData(showLoader = true) {
    if (showLoader) {
      setLoading(true);
    }

    try {
      setError("");
      const res = await fetch("/api/admin/voting/monitor", { credentials: "include" });
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.error || "Failed to load monitor data");
      }

      setData(payload as MonitorData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load monitor data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData(true);
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh] text-slate-500">
        <Loader2 size={28} className="animate-spin mr-3" /> Loading weather monitor...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1280px] mx-auto w-full space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Weather Scan Monitor</h1>
          <p className="text-sm text-slate-500">2-hour georisk scans, incident creation, and notification fanout.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              setRunningScan(true);
              try {
                await fetch("/api/voting/scan-weather?force=true", { credentials: "include" });
                await loadData(false);
              } finally {
                setRunningScan(false);
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-black transition-colors disabled:opacity-60"
            disabled={runningScan}
          >
            <Loader2 size={16} className={runningScan ? "animate-spin" : ""} />
            Run Scan Now
          </button>

          <button
            onClick={async () => {
              setRefreshing(true);
              await loadData(false);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60"
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 flex items-center gap-2">
          <AlertCircle size={18} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-5">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Open Incidents</p>
              <p className="text-3xl font-bold text-slate-900">{data.summary.openIncidents}</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Completed Runs</p>
              <p className="text-3xl font-bold text-slate-900">{data.summary.completedRuns}</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Incidents Created</p>
              <p className="text-3xl font-bold text-slate-900">{data.summary.totalIncidents}</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Notifications Sent</p>
              <p className="text-3xl font-bold text-slate-900">{data.summary.totalNotifications}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Recent Scan Runs</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-widest">
                  <tr>
                    <th className="text-left px-6 py-3">Started</th>
                    <th className="text-left px-6 py-3">Status</th>
                    <th className="text-left px-6 py-3">Scanned Cities</th>
                    <th className="text-left px-6 py-3">Incidents</th>
                    <th className="text-left px-6 py-3">Notifications</th>
                    <th className="text-left px-6 py-3">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {data.runs.map((run) => (
                    <tr key={run.id} className="border-t border-slate-100 text-sm text-slate-700">
                      <td className="px-6 py-3.5">{new Date(run.startedAt).toLocaleString()}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            run.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : run.status === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {run.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">{run.scannedCities.length}</td>
                      <td className="px-6 py-3.5">{run.createdIncidents}</td>
                      <td className="px-6 py-3.5">{run.createdNotifications}</td>
                      <td className="px-6 py-3.5 text-slate-500">{run.reason || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
