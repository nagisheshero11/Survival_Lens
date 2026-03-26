"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Vote, Plus, ChevronDown, Clock, Users,
  CheckCircle2, XCircle, AlertCircle, ThumbsUp, ThumbsDown,
  Filter, Search, TrendingUp,
} from "lucide-react";

type VoteStatus = "ALL" | "active" | "passed" | "rejected" | "pending";

const PROPOSALS = [
  {
    id: "P-104", title: "Risk Threshold Revision", category: "Risk Policy",
    desc: "Revise the claim auto-approval threshold from $200 to $350 for low-risk gig workers, reducing manual review load by ~40%.",
    support: 82, against: 18, totalVotes: 248, quorum: 200,
    status: "active", timeLeft: "2d 14h", sector: "London, UK", author: "admin@sl.com",
    comments: 14, created: "Mar 20, 2025",
  },
  {
    id: "P-103", title: "Premium Allocation Shift", category: "Finance",
    desc: "Shift 8% of Q3 premium pool toward extreme-weather coverage riders, effective from next billing cycle.",
    support: 91, against: 9, totalVotes: 310, quorum: 200,
    status: "passed", timeLeft: "—", sector: "Global", author: "admin@sl.com",
    comments: 22, created: "Mar 18, 2025",
  },
  {
    id: "P-102", title: "New Benefit — Extreme Weather", category: "Coverage",
    desc: 'Introduce "Extreme Weather" as a first-class disruption event with automatic payout up to ₹500 per event.',
    support: 64, against: 36, totalVotes: 100, quorum: 200,
    status: "pending", timeLeft: "5d 6h", sector: "India", author: "policy@sl.com",
    comments: 31, created: "Mar 15, 2025",
  },
  {
    id: "P-101", title: "Identity Verification Mandate", category: "Security",
    desc: "Mandate biometric or OTP-based identity check for claims above $1,000 before payout processing.",
    support: 38, against: 62, totalVotes: 190, quorum: 200,
    status: "rejected", timeLeft: "—", sector: "Global", author: "sec@sl.com",
    comments: 8, created: "Mar 10, 2025",
  },
  {
    id: "P-100", title: "Flood Coverage Expansion", category: "Coverage",
    desc: "Extend flood zone compensation to Tier-2 Indian cities currently excluded from the standard plan.",
    support: 77, against: 23, totalVotes: 215, quorum: 200,
    status: "passed", timeLeft: "—", sector: "India", author: "ops@sl.com",
    comments: 19, created: "Mar 5, 2025",
  },
];

const STATUS_META: Record<string, { label: string; icon: React.ElementType; bg: string; text: string; dot: string }> = {
  active:   { label: "Active",    icon: Vote,         bg: "bg-blue-50",    text: "text-blue-700",   dot: "bg-blue-500 animate-pulse" },
  passed:   { label: "Passed",    icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-500" },
  rejected: { label: "Rejected",  icon: XCircle,      bg: "bg-red-50",     text: "text-red-600",    dot: "bg-red-500" },
  pending:  { label: "Pending Quorum", icon: AlertCircle, bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400 animate-pulse" },
};

const CATEGORY_COLORS: Record<string, string> = {
  "Risk Policy": "bg-violet-100 text-violet-700",
  "Finance":     "bg-blue-100 text-blue-700",
  "Coverage":    "bg-emerald-100 text-emerald-700",
  "Security":    "bg-rose-100 text-rose-700",
};

export default function RealTimeVotingPage() {
  const [statusFilter, setStatusFilter] = useState<VoteStatus>("ALL");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = PROPOSALS.filter((p) => {
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    ALL: PROPOSALS.length,
    active:   PROPOSALS.filter(p => p.status === "active").length,
    passed:   PROPOSALS.filter(p => p.status === "passed").length,
    rejected: PROPOSALS.filter(p => p.status === "rejected").length,
    pending:  PROPOSALS.filter(p => p.status === "pending").length,
  };

  return (
    <div className="p-8 max-w-[1100px] mx-auto w-full">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">Real-Time Voting</h1>
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Monitor community proposals and governance decisions in real time.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button className="h-9 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5">
            <Filter size={13} /> Filter
          </button>
          <button className="h-9 px-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <Plus size={13} /> New Proposal
          </button>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Proposals", value: PROPOSALS.length,     icon: Vote,        color: "text-blue-600",    bg: "bg-blue-50" },
          { label: "Active Votes",    value: counts.active,         icon: TrendingUp,  color: "text-violet-600",  bg: "bg-violet-50" },
          { label: "Passed",          value: counts.passed,         icon: CheckCircle2,color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending Quorum",  value: counts.pending,        icon: AlertCircle, color: "text-amber-600",   bg: "bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon size={16} className={s.color} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 leading-none">{s.value}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs + search */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(["ALL", "active", "passed", "rejected", "pending"] as VoteStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
              statusFilter === s
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {s === "ALL" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${statusFilter === s ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
              {counts[s]}
            </span>
          </button>
        ))}
        <div className="relative ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" placeholder="Search proposals..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-full focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none font-medium text-slate-700 w-44"
          />
        </div>
      </div>

      {/* Proposal cards */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {filtered.map((p) => {
            const meta = STATUS_META[p.status];
            const isOpen = expanded === p.id;
            const quorumPct = Math.min((p.totalVotes / p.quorum) * 100, 100);

            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden"
              >
                {/* Card header row */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : p.id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Status dot + ID */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                      <span className="text-[9px] font-bold text-slate-400">{p.id}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="text-sm font-bold text-slate-900">{p.title}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${CATEGORY_COLORS[p.category] ?? "bg-slate-100 text-slate-600"}`}>
                          {p.category}
                        </span>
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.text}`}>
                          <meta.icon size={10} /> {meta.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">{p.sector} · {p.created}</p>
                    </div>
                  </div>

                  {/* Right mini bar */}
                  <div className="flex items-center gap-6 shrink-0 ml-4">
                    <div className="text-right hidden md:block">
                      <p className="text-xs font-bold text-slate-900">{p.support}% Support</p>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${p.support >= 75 ? "bg-emerald-500" : p.support >= 50 ? "bg-blue-500" : "bg-rose-400"}`}
                          style={{ width: `${p.support}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs font-bold text-slate-500">{p.totalVotes} votes</p>
                      {p.status === "active" && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-medium">
                          <Clock size={10} /> {p.timeLeft}
                        </div>
                      )}
                    </div>
                    <ChevronDown size={14} className={`text-slate-300 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      key="detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 border-t border-slate-100 bg-slate-50/60">
                        {/* Description */}
                        <p className="text-sm text-slate-600 leading-relaxed mb-4 mt-3">{p.desc}</p>

                        {/* Vote breakdown */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-[10px] font-bold mb-1">
                              <span className="text-emerald-600">For — {p.support}%</span>
                              <span className="text-rose-500">Against — {p.against}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-rose-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${p.support}%` }} />
                            </div>
                          </div>
                        </div>

                        {/* Quorum */}
                        <div className="mb-4">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                            <span className="flex items-center gap-1"><Users size={10} /> Quorum Progress</span>
                            <span>{p.totalVotes} / {p.quorum} votes</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${quorumPct >= 100 ? "bg-emerald-500" : "bg-blue-400"}`} style={{ width: `${quorumPct}%` }} />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {p.status === "active" && (
                            <>
                              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors">
                                <ThumbsUp size={12} /> Approve
                              </button>
                              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-100 text-rose-600 text-xs font-bold hover:bg-rose-200 transition-colors">
                                <ThumbsDown size={12} /> Reject
                              </button>
                            </>
                          )}
                          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors ml-auto">
                            View Full Registry
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-100">
            <Vote size={28} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400">No proposals match your filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
