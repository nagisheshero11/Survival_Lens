"use client";

import {
  TrendingUp, TrendingDown, CheckCircle2, Clock,
  Search, CheckCheck, X, ChevronRight,
  Users, BarChart3, ShieldAlert, Zap, AlertTriangle, Settings2
} from "lucide-react";
import { motion } from "framer-motion";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, badge, badgeColor, sub,
}: {
  label: string; value: string; badge: string; badgeColor: string; sub: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
      <div className="flex items-end gap-3 mb-1">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <p className="text-xs text-slate-400 font-medium">{sub}</p>
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      className="scroll-mt-6"
    >
      {children}
    </motion.section>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="p-8 max-w-[1280px] mx-auto w-full space-y-8">

      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      <Section id="overview">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Platform Control</h1>
            <p className="text-sm text-slate-500 font-medium">
              Monitoring financial risk signals and claims integrity across the ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <button className="h-9 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
              System Logs
            </button>
            <button className="h-9 px-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
              Export Global Report
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Claim Volume"
            value="1,284"
            badge="↑ 12%"
            badgeColor="bg-emerald-100 text-emerald-700"
            sub="vs. last 30 days"
          />
          <StatCard
            label="Approval Rate"
            value="94.2%"
            badge="Stable"
            badgeColor="bg-slate-100 text-slate-600"
            sub="Within target range"
          />
          <StatCard
            label="Risk Mitigation"
            value="$2.4M"
            badge="Target Met"
            badgeColor="bg-emerald-100 text-emerald-700"
            sub="Ecosystem-wide savings"
          />
          <StatCard
            label="Pending Review"
            value="42"
            badge="High Priority"
            badgeColor="bg-red-100 text-red-600"
            sub="Requires immediate action"
          />
        </div>
      </Section>

      {/* ── MAIN 2-COL ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* LEFT (col-span-3) */}
        <div className="lg:col-span-3 space-y-6">

          {/* ── CLAIMS QUEUE ──────────────────────────────────────────── */}
          <Section id="claims-queue">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Claims Approval Queue</h2>
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-0.5">Manual Review Required</p>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View All <ChevronRight size={13} />
                </button>
              </div>

              <div className="divide-y divide-slate-50">
                {[
                  { id: "#8821", title: "Gig-Injury Reimbursement", user: "@alex_jaxon", time: "2h ago", amount: "$1,450.00", status: "Verified Evidence", statusColor: "text-emerald-600" },
                  { id: "#8819", title: "Vehicle Downtime Subsidy", user: "@uber_pro_99", time: "4h ago", amount: "$420.00", status: "Awaiting Police Report", statusColor: "text-amber-600" },
                  { id: "#8815", title: "Equipment Damage Claim", user: "@jeet_swiggy", time: "6h ago", amount: "$880.00", status: "Under Review", statusColor: "text-blue-600" },
                ].map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <ShieldAlert size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{claim.title} <span className="text-slate-400 font-medium">{claim.id}</span></p>
                        <p className="text-xs text-slate-400 font-medium">User: {claim.user} · Submitted {claim.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900">{claim.amount}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-wide ${claim.statusColor}`}>{claim.status}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
                          <X size={14} strokeWidth={2.5} />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-colors">
                          <CheckCheck size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ── USER MANAGEMENT ───────────────────────────────────────── */}
          <Section id="user-management">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">User Management</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-8 pr-3 py-1.5 text-xs bg-slate-100 rounded-lg border-transparent focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none font-medium text-slate-700 w-36"
                    />
                  </div>
                  <button className="text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors">All Companies</button>
                  <button className="text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors">All Locations</button>
                </div>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-12 px-6 py-2 bg-slate-50 text-[10px] uppercase tracking-widest font-bold text-slate-400 border-b border-slate-100">
                <div className="col-span-4">User Entity</div>
                <div className="col-span-2">Platform</div>
                <div className="col-span-3">Sector</div>
                <div className="col-span-2">Risk</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              <div className="divide-y divide-slate-50">
                {[
                  { name: "Sarah Mitchell", uid: "992-LX", platform: "Uber Eats", sector: "New York, US", risk: "LOW", riskColor: "bg-emerald-100 text-emerald-700", initials: "SM", bg: "bg-emerald-200" },
                  { name: "Marcus Thorne",  uid: "441-PT", platform: "Instacart", sector: "London, UK",   risk: "HIGH", riskColor: "bg-red-100 text-red-700",     initials: "MT", bg: "bg-red-200" },
                  { name: "Elena Rodriguez",uid: "215-VK", platform: "DoorDash",  sector: "Miami, US",    risk: "MED",  riskColor: "bg-amber-100 text-amber-700",  initials: "ER", bg: "bg-amber-200" },
                ].map((user) => (
                  <div key={user.uid} className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                    <div className="col-span-4 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${user.bg} flex items-center justify-center text-[11px] font-bold text-slate-700 shrink-0`}>
                        {user.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">UID: {user.uid}</p>
                      </div>
                    </div>
                    <div className="col-span-2 text-sm font-medium text-slate-600">{user.platform}</div>
                    <div className="col-span-3 text-sm font-medium text-slate-600">{user.sector}</div>
                    <div className="col-span-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${user.riskColor}`}>{user.risk}</span>
                    </div>
                    <div className="col-span-1 text-right">
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline underline-offset-2">Ledger</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ── RISK ANALYTICS ────────────────────────────────────────── */}
          <Section id="risk-analytics">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
              <h2 className="text-base font-bold text-slate-900 mb-4">Risk Analytics</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Claim Fraud Detected", value: "3.1%", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50", trend: "+0.4%", up: true },
                  { label: "Avg. Payout Time",     value: "4.2h", icon: Clock,         color: "text-blue-500",  bg: "bg-blue-50",  trend: "−0.8h", up: false },
                  { label: "Active Users",          value: "6,841",icon: Users,         color: "text-emerald-500",bg: "bg-emerald-50",trend: "+9%",up: true },
                ].map((s) => (
                  <div key={s.label} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                      <s.icon size={16} className={s.color} />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mb-0.5">{s.value}</p>
                    <p className="text-[10px] text-slate-400 font-medium mb-2">{s.label}</p>
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${s.up ? "text-emerald-600" : "text-blue-600"}`}>
                      {s.up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
                      {s.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ── SYSTEM SETTINGS ───────────────────────────────────────── */}
          <Section id="system-settings">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
              <h2 className="text-base font-bold text-slate-900 mb-4">System Settings</h2>
              <div className="space-y-3">
                {[
                  { label: "Auto-approve low-risk claims (< $200)", enabled: true },
                  { label: "Send SMS alerts on High-risk events",    enabled: true },
                  { label: "Require 2FA for admin actions",          enabled: true },
                  { label: "Enable public voting on proposals",      enabled: false },
                  { label: "Maintenance mode",                       enabled: false },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <Settings2 size={14} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{s.label}</span>
                    </div>
                    {/* Toggle */}
                    <div className={`relative w-10 h-6 rounded-full cursor-pointer transition-colors ${s.enabled ? "bg-blue-600" : "bg-slate-200"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${s.enabled ? "left-5" : "left-1"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>

        {/* RIGHT col (col-span-2) */}
        <div className="lg:col-span-2">
          <Section id="voting">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 sticky top-4">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-slate-900">Real-Time Voting</h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live</span>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  {
                    title: "Risk Threshold Revision",
                    desc: "Proposal #104 receives +24 community votes in the London sector.",
                    time: "Just Now",
                    barColor: "bg-blue-600",
                    barPct: 82,
                    badge: "82% Support",
                    badgeColor: "text-blue-600 bg-blue-50",
                  },
                  {
                    title: "Premium Allocation Shift",
                    desc: "Consensus reached for Q3 health-risk adjustments.",
                    time: "14m ago",
                    barColor: "bg-emerald-500",
                    barPct: 91,
                    badge: "91% Passed",
                    badgeColor: "text-emerald-700 bg-emerald-50",
                  },
                  {
                    title: "New Benefit Proposal",
                    desc: 'Community initiating vote for "Extreme Weather" coverage.',
                    time: "42m ago",
                    barColor: "bg-amber-400",
                    barPct: 64,
                    badge: "Pending Quorum (64/100)",
                    badgeColor: "text-amber-700 bg-amber-50",
                  },
                ].map((v) => (
                  <div key={v.title} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-sm font-bold text-slate-900 leading-snug">{v.title}</p>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">{v.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2.5">{v.desc}</p>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                      <div className={`h-1.5 rounded-full ${v.barColor}`} style={{ width: `${v.barPct}%` }} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${v.badgeColor}`}>{v.badge}</span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                View Full Voting Registry <ChevronRight size={13} />
              </button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
