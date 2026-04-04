"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  BadgeCheck,
  CloudRain,
  Loader2,
  ShieldAlert,
  ThumbsUp,
} from "lucide-react";

type Claim = {
  id: string;
  icon: typeof CloudRain;
  color: string;
  title: string;
  desc: string;
  risk: string;
  status: string;
  progress: number;
  location: string;
  severity: string;
  details: string;
  votes: number;
  hasVoted: boolean;
};

type IncidentApiItem = {
  id: string;
  sourceCity: string;
  riskLevel: "WARNING" | "CRITICAL";
  action: string;
  safetyProbability: number;
  weather: {
    temperatureCelsius: number;
    rainMmHr: number;
    windspeedKmh: number;
  };
  votes: number;
  hasVoted: boolean;
};

function mapIncidentToClaim(item: IncidentApiItem): Claim {
  const isCritical = item.riskLevel === "CRITICAL";
  const icon = item.weather.rainMmHr > 3 ? CloudRain : isCritical ? ShieldAlert : Activity;
  const color = isCritical ? "red" : "orange";
  const severity = isCritical ? "Critical" : "High Risk";

  return {
    id: item.id,
    icon,
    color,
    title: `${item.riskLevel} weather disruption in ${item.sourceCity}`,
    desc: `Rain ${item.weather.rainMmHr.toFixed(1)} mm/hr, wind ${item.weather.windspeedKmh.toFixed(1)} km/h, temp ${item.weather.temperatureCelsius.toFixed(1)} C.`,
    risk: severity,
    status: `${item.votes} votes`,
    progress: Math.min(item.votes, 100),
    location: item.sourceCity,
    severity,
    details: `AI action: ${item.action}. Safety probability: ${item.safetyProbability}%.`,
    votes: item.votes,
    hasVoted: item.hasVoted,
  };
}

export default function VotingPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [activeTab, setActiveTab] = useState<"support" | "supported">("support");
  const [selectedItem, setSelectedItem] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [votingId, setVotingId] = useState("");

  const supportedClaims = useMemo(() => claims.filter((claim) => claim.hasVoted), [claims]);

  async function fetchIncidents() {
    try {
      setError("");
      const res = await fetch("/api/voting/incidents", { credentials: "include" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load incidents");
      }

      const mapped = (data as IncidentApiItem[]).map(mapIncidentToClaim);
      setClaims(mapped);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load voting incidents");
    } finally {
      setLoading(false);
    }
  }

  async function runWeatherScanIfDue() {
    try {
      await fetch("/api/voting/scan-weather", { credentials: "include" });
    } catch {
      // Non-blocking; incidents endpoint still determines what to show.
    }
  }

  async function castVote(claimId: string) {
    try {
      setVotingId(claimId);
      const res = await fetch(`/api/voting/incidents/${claimId}/vote`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Vote could not be recorded");
      }

      setClaims((current) =>
        current.map((claim) =>
          claim.id === claimId
            ? {
                ...claim,
                hasVoted: true,
                votes: claim.votes + 1,
                status: `${claim.votes + 1} votes`,
                progress: Math.min(claim.votes + 1, 100),
              }
            : claim
        )
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to submit vote");
    } finally {
      setVotingId("");
    }
  }

  useEffect(() => {
    const boot = async () => {
      await runWeatherScanIfDue();
      await fetchIncidents();
    };

    boot();
  }, []);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full relative min-h-full">
      <div 
        className="absolute top-[-5%] left-[-10%] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none z-0 transition-opacity duration-1000" 
        style={{ width: "clamp(20rem, 40vw, 37.5rem)", height: "clamp(20rem, 40vw, 37.5rem)" }}
      />

      <div className="relative z-10 mb-10">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100/50">
            Decentralized Consensus
          </span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Voting Chamber</h1>
        <p className="text-slate-500 font-medium">Validate community risk claims to trigger protective payouts.</p>
      </div>

      {error && (
        <div className="relative z-10 mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={18} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      <AnimatePresence>
        {selectedItem && (
          <motion.div className="fixed inset-y-0 left-64 right-0 z-[60] flex items-center justify-center px-4 py-6">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
              aria-label="Close claim details"
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              className="relative z-10 max-w-3xl rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] border border-slate-100 p-6 lg:p-8"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 mb-2">Complete Details</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-5">{selectedItem.title}</h2>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">Severity</p>
                  <p className="font-bold text-slate-900">{selectedItem.severity}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">Location</p>
                  <p className="font-bold text-slate-900">{selectedItem.location}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">Status</p>
                  <p className="font-bold text-slate-900">{selectedItem.status}</p>
                </div>
              </div>

              <p className="text-sm leading-7 text-slate-600 font-medium mb-6">{selectedItem.details}</p>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex border-b border-slate-200/60 mb-8 overflow-x-auto no-scrollbar">
        {(["support", "supported"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex items-center gap-2 pb-4 px-4 mr-4 text-sm font-bold tracking-tight transition-colors whitespace-nowrap outline-none ${activeTab === tab ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "support" && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === tab ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                {claims.length}
              </span>
            )}
            {tab === "supported" && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === tab ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
              >
                {supportedClaims.length}
              </span>
            )}

            {activeTab === tab && (
              <motion.div
                layoutId="votingTab"
                className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-slate-900 rounded-t-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="relative z-10 min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "support" && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {loading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-500">
                  <Loader2 size={28} className="animate-spin mb-3 text-blue-500" />
                  <p className="text-sm font-bold">Loading active incidents...</p>
                </div>
              ) : claims.length === 0 ? (
                <div className="col-span-full bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 border border-white text-center">
                  <p className="text-slate-900 font-black text-lg tracking-tight">No active weather incidents nearby</p>
                  <p className="text-slate-500 text-sm mt-2">The scan runs every 2 hours and creates votes for nearby users when risk spikes.</p>
                </div>
              ) : (
              claims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col justify-between group hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300"
                >
                  <div>
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                        <claim.icon size={22} className={`text-${claim.color}-500`} strokeWidth={2.5} />
                      </div>
                      <span className={`bg-${claim.color}-50 text-${claim.color}-600 border border-${claim.color}-100/50 text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg shrink-0`}>
                        {claim.risk}
                      </span>
                    </div>

                    <h3 className="text-[17px] font-black text-slate-900 leading-tight mb-2 tracking-tight">{claim.title}</h3>
                    <p className="text-[13px] text-slate-500 font-medium mb-6 leading-relaxed line-clamp-3">{claim.desc}</p>
                  </div>

                  <div>
                    <div className="bg-slate-50/80 rounded-2xl p-4 mb-5 border border-slate-100/60">
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        <span>Consensus Status</span>
                        <span className="text-slate-900">{claim.status}</span>
                      </div>
                      <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${claim.progress}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="bg-slate-900 h-full rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedItem(claim)}
                        className="w-full flex-1 flex items-center justify-center bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-bold py-3.5 rounded-2xl transition-all text-[13px] shadow-sm"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => castVote(claim.id)}
                        disabled={claim.hasVoted || votingId === claim.id}
                        className={`w-full flex-1 flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all text-[13px] ${
                          claim.hasVoted
                            ? "bg-emerald-600 shadow-emerald-600/20"
                            : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 hover:-translate-y-0.5"
                        } ${(votingId === claim.id || claim.hasVoted) ? "opacity-80 cursor-not-allowed" : ""}`}
                      >
                        {votingId === claim.id ? <Loader2 size={16} className="animate-spin" /> : <ThumbsUp size={16} strokeWidth={2.5} />}
                        {claim.hasVoted ? "Supported" : "Support"}
                      </button>
                    </div>
                  </div>
                </div>
              ))) }
            </motion.div>
          )}

          {activeTab === "supported" && (
            <motion.div
              key="supported"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {supportedClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-white flex flex-col justify-between group transition-all duration-300"
                >
                  <div>
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-100/50">
                        <claim.icon size={22} className={`text-${claim.color}-500`} strokeWidth={2.5} />
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100/50 text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg shrink-0">
                        Verified
                      </span>
                    </div>

                    <h3 className="text-[17px] font-black text-slate-900 leading-tight mb-2 tracking-tight">{claim.title}</h3>
                    <p className="text-[13px] text-slate-500 font-medium mb-6 leading-relaxed line-clamp-3">{claim.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100/60 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex justify-center items-center">
                      <BadgeCheck size={16} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 leading-none mb-0.5">Your vote was recorded</p>
                      <p className="text-[9px] text-slate-400 tracking-widest uppercase font-black">Consensus Executed</p>
                    </div>
                  </div>
                </div>
              ))}
              {!supportedClaims.length && (
                <div className="col-span-full bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 border border-white text-center">
                  <p className="text-slate-900 font-black text-lg tracking-tight">No supported incidents yet</p>
                  <p className="text-slate-500 text-sm mt-2">Support active incidents to see your vote history here.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
