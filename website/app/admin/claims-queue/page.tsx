"use client";

import { useState } from "react";
import {
  Search, Filter, CheckCheck, X, ChevronDown,
  ShieldAlert, ShieldCheck, Clock, AlertTriangle, Eye,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Status = "all" | "pending" | "approved" | "rejected" | "flagged";

const CLAIMS = [
  { id: "#8821", title: "Gig-Injury Reimbursement",  user: "@alex_jaxon",   platform: "Uber Eats",  amount: 1450.00, status: "pending",  risk: "HIGH", evidence: "Verified Evidence",       time: "2h ago",  sector: "Mumbai, IN" },
  { id: "#8819", title: "Vehicle Downtime Subsidy",   user: "@uber_pro_99",  platform: "Uber",       amount: 420.00,  status: "pending",  risk: "MED",  evidence: "Awaiting Police Report",  time: "4h ago",  sector: "London, UK" },
  { id: "#8815", title: "Equipment Damage Claim",     user: "@jeet_swiggy",  platform: "Swiggy",     amount: 880.00,  status: "pending",  risk: "MED",  evidence: "Under Review",            time: "6h ago",  sector: "Delhi, IN" },
  { id: "#8810", title: "Rain Disruption Payout",     user: "@meena_ola",    platform: "Ola",        amount: 120.00,  status: "approved", risk: "LOW",  evidence: "Auto Approved",           time: "8h ago",  sector: "Chennai, IN" },
  { id: "#8808", title: "Heat Zone Compensation",     user: "@raj_rapido",   platform: "Rapido",     amount: 200.00,  status: "approved", risk: "LOW",  evidence: "Verified Evidence",       time: "12h ago", sector: "Hyderabad, IN" },
  { id: "#8805", title: "Contract Violation Claim",   user: "@sam_doord",    platform: "DoorDash",   amount: 2400.00, status: "flagged",  risk: "HIGH", evidence: "Fraud Suspected",         time: "14h ago", sector: "New York, US" },
  { id: "#8802", title: "Flood Zone Road Block",      user: "@priya_blinkit",platform: "Blinkit",    amount: 340.00,  status: "rejected", risk: "MED",  evidence: "Insufficient Evidence",   time: "18h ago", sector: "Pune, IN" },
  { id: "#8799", title: "Identity Protection Claim",  user: "@carlos_inst",  platform: "Instacart",  amount: 750.00,  status: "flagged",  risk: "HIGH", evidence: "Duplicate Detected",      time: "1d ago",  sector: "Miami, US" },
  { id: "#8796", title: "Strong Wind Coverage",       user: "@leila_bolt",   platform: "Bolt",       amount: 90.00,   status: "approved", risk: "LOW",  evidence: "Auto Approved",           time: "1d ago",  sector: "Paris, FR" },
  { id: "#8790", title: "Premium Subsidy Request",    user: "@tom_lyft",     platform: "Lyft",       amount: 5000.00, status: "pending",  risk: "HIGH", evidence: "Legal Review Required",   time: "2d ago",  sector: "Chicago, US" },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  pending:  { bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400",  label: "Pending" },
  approved: { bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-500",label: "Approved" },
  rejected: { bg: "bg-red-50",     text: "text-red-700",    dot: "bg-red-500",    label: "Rejected" },
  flagged:  { bg: "bg-rose-50",    text: "text-rose-700",   dot: "bg-rose-500",   label: "Flagged" },
};

const RISK_STYLES: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700",
  MED:  "bg-amber-100 text-amber-700",
  LOW:  "bg-emerald-100 text-emerald-700",
};

export default function ClaimsQueuePage() {
  const [filter, setFilter] = useState<Status>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = CLAIMS.filter((c) => {
    const matchStatus = filter === "all" || c.status === filter;
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.user.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all: CLAIMS.length,
    pending:  CLAIMS.filter((c) => c.status === "pending").length,
    approved: CLAIMS.filter((c) => c.status === "approved").length,
    rejected: CLAIMS.filter((c) => c.status === "rejected").length,
    flagged:  CLAIMS.filter((c) => c.status === "flagged").length,
  };

  return (
    <div className="p-8 max-w-[1100px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Claims Approval Queue</h1>
          <p className="text-sm text-slate-500 font-medium">
            Review, approve, or reject incoming claims from the platform.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button className="h-9 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5">
            <Filter size={13} /> Filter
          </button>
          <button className="h-9 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5">
            <ArrowUpDown size={13} /> Sort
          </button>
          <button className="h-9 px-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {(["all", "pending", "approved", "rejected", "flagged"] as Status[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
              filter === s
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === s ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
              {counts[s]}
            </span>
          </button>
        ))}

        {/* Search */}
        <div className="relative ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search claims..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-full focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none font-medium text-slate-700 w-44"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-12 px-5 py-3 bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest font-bold text-slate-400">
          <div className="col-span-4">Claim</div>
          <div className="col-span-2">User / Platform</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-1 text-center">Risk</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-50">
          <AnimatePresence initial={false}>
            {filtered.map((claim) => {
              const s = STATUS_STYLES[claim.status];
              const isOpen = expanded === claim.id;
              return (
                <motion.div
                  key={claim.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Main row */}
                  <div
                    className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-slate-50/60 transition-colors cursor-pointer"
                    onClick={() => setExpanded(isOpen ? null : claim.id)}
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        {claim.risk === "HIGH" ? (
                          <AlertTriangle size={14} className="text-rose-500" />
                        ) : (
                          <ShieldAlert size={14} className="text-blue-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">{claim.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{claim.id} · {claim.time}</p>
                      </div>
                      <ChevronDown
                        size={14}
                        className={`text-slate-300 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs font-bold text-slate-700">{claim.user}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{claim.platform}</p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-sm font-bold text-slate-900">${claim.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${RISK_STYLES[claim.risk]}`}>{claim.risk}</span>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${s.bg} ${s.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </div>
                    <div className="col-span-2 flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors" title="View details">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors" title="Reject">
                        <X size={14} strokeWidth={2.5} />
                      </button>
                      <button className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors" title="Approve">
                        <CheckCheck size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* Expandable detail row */}
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
                        <div className="px-16 py-4 bg-slate-50/80 border-t border-slate-100 grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sector</p>
                            <p className="font-bold text-slate-800">{claim.sector}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Evidence Status</p>
                            <p className={`font-bold ${claim.evidence.includes("Fraud") || claim.evidence.includes("Duplicate") ? "text-rose-600" : "text-slate-800"}`}>{claim.evidence}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Submitted</p>
                            <p className="font-bold text-slate-800">{claim.time}</p>
                          </div>
                          <div className="flex items-end gap-2">
                            <button className="flex-1 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
                              View Full Ledger
                            </button>
                            <button className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                              <ShieldCheck size={12} /> Approve
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
            <div className="py-16 text-center">
              <ShieldAlert size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-400">No claims match your filter</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium">Showing <span className="font-bold text-slate-600">{filtered.length}</span> of <span className="font-bold text-slate-600">{CLAIMS.length}</span> claims</p>
          <div className="flex items-center gap-1.5">
            {["1", "2", "3"].map((p) => (
              <button key={p} className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${p === "1" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
