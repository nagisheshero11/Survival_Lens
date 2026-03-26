"use client";

import {
  TrendingUp, TrendingDown, AlertTriangle, ShieldAlert, ShieldCheck,
  Clock, Users, BarChart3, Activity, Zap, Globe, ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

// ─── Simple animated bar ─────────────────────────────────────────────────────
function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

// ─── Metric card ─────────────────────────────────────────────────────────────
function MetricCard({
  label, value, sub, icon: Icon, color, bg, trend, up,
}: {
  label: string; value: string; sub: string;
  icon: React.ElementType; color: string; bg: string;
  trend: string; up: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-4`}>
        <Icon size={16} className={color} />
      </div>
      <p className="text-2xl font-bold text-slate-900 leading-none mb-1">{value}</p>
      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-3">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{sub}</p>
        <div className={`flex items-center gap-1 text-[10px] font-bold ${up ? "text-emerald-600" : "text-rose-500"}`}>
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {trend}
        </div>
      </div>
    </div>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6"
    >
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {sub && <p className="text-xs text-slate-400 font-medium mt-0.5">{sub}</p>}
      </div>
      {children}
    </motion.div>
  );
}

const SECTOR_RISKS = [
  { name: "Mumbai, IN",    risk: 78, claims: 84,  color: "bg-red-500" },
  { name: "London, UK",   risk: 61, claims: 52,  color: "bg-amber-500" },
  { name: "New York, US", risk: 55, claims: 41,  color: "bg-amber-400" },
  { name: "Delhi, IN",    risk: 42, claims: 37,  color: "bg-blue-500" },
  { name: "Miami, US",    risk: 38, claims: 29,  color: "bg-blue-400" },
  { name: "Paris, FR",    risk: 21, claims: 14,  color: "bg-emerald-500" },
];

const PLATFORM_DATA = [
  { name: "Uber Eats",  pct: 31, claims: 398, color: "bg-blue-500" },
  { name: "Swiggy",     pct: 22, claims: 282, color: "bg-orange-400" },
  { name: "Instacart",  pct: 18, claims: 231, color: "bg-emerald-500" },
  { name: "DoorDash",   pct: 14, claims: 180, color: "bg-rose-500" },
  { name: "Rapido",     pct: 9,  claims: 115, color: "bg-violet-500" },
  { name: "Others",     pct: 6,  claims: 78,  color: "bg-slate-400" },
];

const WEEKLY = [
  { day: "Mon", claims: 28, payout: 4200 },
  { day: "Tue", claims: 41, payout: 6800 },
  { day: "Wed", claims: 35, payout: 5300 },
  { day: "Thu", claims: 62, payout: 9400 },
  { day: "Fri", claims: 54, payout: 8100 },
  { day: "Sat", claims: 19, payout: 2900 },
  { day: "Sun", claims: 14, payout: 2100 },
];
const maxClaims = Math.max(...WEEKLY.map(d => d.claims));

const ALERTS = [
  { id: "A-09", title: "Fraud spike — Mumbai cluster",   severity: "HIGH", time: "Just now",  icon: ShieldAlert,  color: "text-rose-600",   bg: "bg-rose-50" },
  { id: "A-08", title: "Duplicate claim detected #8799", severity: "HIGH", time: "14m ago",   icon: AlertTriangle,color: "text-rose-600",   bg: "bg-rose-50" },
  { id: "A-07", title: "Payout delay > 6h on DoorDash", severity: "MED",  time: "1h ago",    icon: Clock,        color: "text-amber-600",  bg: "bg-amber-50" },
  { id: "A-06", title: "New sector coverage gap — Paris",severity: "LOW",  time: "3h ago",    icon: Globe,        color: "text-blue-600",   bg: "bg-blue-50" },
];

export default function RiskAnalyticsPage() {
  return (
    <div className="p-8 max-w-[1200px] mx-auto w-full space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Risk Analytics</h1>
          <p className="text-sm text-slate-500 font-medium">
            Platform-wide risk intelligence, fraud signals, and payout trends.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <select className="h-9 px-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 focus:outline-none focus:border-blue-400">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="h-9 px-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <ArrowUpRight size={13} /> Export
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Claim Fraud Rate"    value="3.1%"   sub="vs 2.7% last week" icon={ShieldAlert}  color="text-rose-600"    bg="bg-rose-50"    trend="+0.4%"  up={false} />
        <MetricCard label="Avg. Payout Time"    value="4.2 h"  sub="Target: 4h"        icon={Clock}        color="text-blue-600"   bg="bg-blue-50"    trend="−0.8h"  up={true}  />
        <MetricCard label="Active Covered Users" value="6,841" sub="Platform total"     icon={Users}        color="text-violet-600" bg="bg-violet-50"  trend="+9%"    up={true}  />
        <MetricCard label="Claims This Week"    value="253"    sub="Across all sectors" icon={BarChart3}    color="text-emerald-600"bg="bg-emerald-50" trend="+12%"   up={true}  />
      </div>

      {/* Row 2: chart + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Weekly claims bar chart */}
        <Section title="Weekly Claims Volume" sub="Claim count per day · This week" >
          <div className="lg:col-span-3">
            <div className="flex items-end gap-3 h-36">
              {WEEKLY.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                  <p className="text-[10px] font-bold text-slate-400">{d.claims}</p>
                  <motion.div
                    className="w-full rounded-t-md bg-blue-500"
                    style={{ originY: 1 }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: WEEKLY.indexOf(d) * 0.06, ease: "easeOut" }}
                    custom={d.claims}
                  >
                    <div style={{ height: `${Math.round((d.claims / maxClaims) * 100)}px` }} className="w-full rounded-t-md bg-blue-500 min-h-[4px]" />
                  </motion.div>
                  <p className="text-[10px] text-slate-400 font-medium">{d.day}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Risk alerts */}
        <div className="lg:col-span-2">
          <Section title="Risk Alerts" sub="Flagged events requiring attention">
            <div className="space-y-3">
              {ALERTS.map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/60 transition-colors">
                  <div className={`w-8 h-8 rounded-lg ${a.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <a.icon size={14} className={a.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate">{a.title}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                        a.severity === "HIGH" ? "bg-red-100 text-red-600" :
                        a.severity === "MED"  ? "bg-amber-100 text-amber-600" :
                                                "bg-blue-100 text-blue-600"
                      }`}>{a.severity}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{a.id} · {a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      {/* Row 3: sector risk + platform breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Sector risk heatmap */}
        <Section title="Sector Risk Index" sub="Risk score per geographic sector (0–100)">
          <div className="space-y-4">
            {SECTOR_RISKS.map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-32 shrink-0">
                  <Globe size={12} className="text-slate-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-700 truncate">{s.name}</span>
                </div>
                <div className="flex-1">
                  <Bar pct={s.risk} color={s.color} />
                </div>
                <div className="text-right w-20 shrink-0">
                  <span className="text-xs font-bold text-slate-900">{s.risk}/100</span>
                  <span className="text-[10px] text-slate-400 ml-1.5">({s.claims} claims)</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Platform claim share */}
        <Section title="Claims by Platform" sub="Share of total claims this period">
          <div className="space-y-4">
            {PLATFORM_DATA.map((p) => (
              <div key={p.name} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-24 shrink-0">
                  <Activity size={12} className="text-slate-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-700">{p.name}</span>
                </div>
                <div className="flex-1">
                  <Bar pct={p.pct * 3} color={p.color} />
                </div>
                <div className="text-right w-20 shrink-0">
                  <span className="text-xs font-bold text-slate-900">{p.pct}%</span>
                  <span className="text-[10px] text-slate-400 ml-1.5">({p.claims})</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

      </div>
    </div>
  );
}
