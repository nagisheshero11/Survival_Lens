"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BadgeCheck, Loader2, ThumbsDown, ThumbsUp, Vote } from "lucide-react";

type ClaimVoteItem = {
  claimId: string;
  reason: string;
  amount: number;
  claimStatus: "pending" | "approved" | "rejected";
  claimCreatedAt: string;
  votingCity: string;
  votingStatus: "active" | "closed";
  startTime: string;
  endTime: string;
  yesCount: number;
  noCount: number;
  canVote: boolean;
  hasVoted: boolean;
  myVote: "yes" | "no" | null;
};

export default function VotingPage() {
  const [items, setItems] = useState<ClaimVoteItem[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [votingActionByClaim, setVotingActionByClaim] = useState<Record<string, boolean>>({});
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeItems = useMemo(
    () => items.filter((item) => item.votingStatus === "active"),
    [items]
  );

  const historyItems = useMemo(
    () => items.filter((item) => item.votingStatus === "closed" || item.hasVoted),
    [items]
  );

  async function fetchClaimVoting() {
    try {
      setError("");
      const res = await fetch("/api/vote", { credentials: "include" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load claim voting");
      }

      setItems(Array.isArray(data) ? (data as ClaimVoteItem[]) : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load claim voting");
    } finally {
      setLoading(false);
    }
  }

  async function castVote(claimId: string, vote: "yes" | "no") {
    try {
      setError("");
      setSuccess("");
      setVotingActionByClaim((prev) => ({ ...prev, [claimId]: true }));
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ claimId, vote }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Vote could not be recorded");
      }

      setSuccess("Vote submitted successfully.");
      await fetchClaimVoting();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to submit vote");
    } finally {
      setVotingActionByClaim((prev) => ({ ...prev, [claimId]: false }));
    }
  }

  useEffect(() => {
    fetchClaimVoting();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

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
        <p className="text-slate-500 font-medium">Community voting for claims happens here. Voting window is 2 minutes per claim.</p>
      </div>

      {error && (
        <div className="relative z-10 mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={18} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {success && (
        <div className="relative z-10 mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl">
          <p className="text-sm font-semibold">{success}</p>
        </div>
      )}

      <div className="relative z-10 flex border-b border-slate-200/60 mb-8 overflow-x-auto no-scrollbar">
        {(["active", "history"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex items-center gap-2 pb-4 px-4 mr-4 text-sm font-bold tracking-tight transition-colors whitespace-nowrap outline-none ${activeTab === tab ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
          >
            {tab === "active" ? "Active Voting" : "History"}
            {tab === "active" && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === tab ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                {activeItems.length}
              </span>
            )}
            {tab === "history" && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === tab ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
              >
                {historyItems.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="relative z-10 min-h-[400px]">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-500">
            <Loader2 size={28} className="animate-spin mb-3 text-blue-500" />
            <p className="text-sm font-bold">Loading claim voting...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {(activeTab === "active" ? activeItems : historyItems).map((item) => {
              const remainingSeconds = Math.max(
                0,
                Math.floor((new Date(item.endTime).getTime() - nowMs) / 1000)
              );
              const totalVotes = item.yesCount + item.noCount;
              const yesPercent = totalVotes ? Math.round((item.yesCount / totalVotes) * 100) : 0;

              return (
                <div
                  key={item.claimId}
                  className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4 gap-3">
                      <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                        <Vote size={12} />
                        Claim Vote
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-widest font-black border ${
                          item.votingStatus === "active"
                            ? "bg-orange-50 text-orange-700 border-orange-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        }`}
                      >
                        {item.votingStatus}
                      </span>
                    </div>

                    <p className="text-[15px] font-black text-slate-900 leading-snug line-clamp-3 mb-3">{item.reason}</p>
                    <p className="text-xs text-slate-500 font-semibold mb-2">City: {item.votingCity}</p>
                    <p className="text-xs text-slate-500 font-semibold mb-3">Claimed: {formatDate(item.claimCreatedAt)}</p>

                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 mb-4">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">Voting Score</p>
                      <p className="text-sm font-bold text-slate-800 mb-2">Yes {item.yesCount} | No {item.noCount}</p>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${yesPercent}%` }} />
                      </div>
                    </div>

                    <p className="text-sm font-black text-slate-900 mb-1">{formatCurrency(item.amount)}</p>
                    <p className="text-xs text-slate-500 font-semibold">
                      {item.votingStatus === "active"
                        ? `Ends in ${remainingSeconds}s`
                        : "Voting closed, waiting for admin decision"}
                    </p>
                    {item.hasVoted && (
                      <p className="text-xs text-blue-600 font-bold mt-1">You voted: {item.myVote}</p>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => castVote(item.claimId, "yes")}
                      disabled={!item.canVote || !!votingActionByClaim[item.claimId]}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider border transition-colors ${
                        item.canVote && !votingActionByClaim[item.claimId]
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                          : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {votingActionByClaim[item.claimId] ? <Loader2 size={14} className="animate-spin" /> : <ThumbsUp size={14} />}
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => castVote(item.claimId, "no")}
                      disabled={!item.canVote || !!votingActionByClaim[item.claimId]}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider border transition-colors ${
                        item.canVote && !votingActionByClaim[item.claimId]
                          ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                          : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {votingActionByClaim[item.claimId] ? <Loader2 size={14} className="animate-spin" /> : <ThumbsDown size={14} />}
                      No
                    </button>
                  </div>
                </div>
              );
            })}

            {(activeTab === "active" ? activeItems : historyItems).length === 0 && (
              <div className="col-span-full bg-white/80 backdrop-blur-xl rounded-[2rem] p-10 border border-white text-center">
                {activeTab === "active" ? (
                  <>
                    <p className="text-slate-900 font-black text-lg tracking-tight">No active claim voting right now</p>
                    <p className="text-slate-500 text-sm mt-2">Active claim votes in your city will appear here for 2 minutes.</p>
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 mb-3">
                      <BadgeCheck size={18} />
                    </div>
                    <p className="text-slate-900 font-black text-lg tracking-tight">No voting history yet</p>
                    <p className="text-slate-500 text-sm mt-2">Once you vote or votes close, they will appear here.</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
