"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, TrendingUp, Zap, Clock, Star } from "lucide-react";
import { useState, useEffect } from "react";

// Animated bar chart data — weekly earnings
const WEEKS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const EARNINGS = [820, 640, 950, 480, 1100, 760, 920];
const MAX = Math.max(...EARNINGS);

// Recent activity feed items
const ACTIVITY = [
  { icon: ShieldCheck, color: "emerald", label: "Rain coverage triggered", amount: "+₹120", time: "2h ago" },
  { icon: Zap,         color: "blue",    label: "Heat surge protection",   amount: "+₹80",  time: "Yesterday" },
  { icon: ShieldCheck, color: "emerald", label: "Road block payout",       amount: "+₹200", time: "3 days ago" },
];

// Stat cards
const STATS = [
  { label: "Protected this month",  value: "₹2,340", sub: "+12% vs last month",   color: "emerald" },
  { label: "Active streak",         value: "14 days", sub: "No coverage gap",      color: "blue"    },
  { label: "Disruptions covered",   value: "7 events", sub: "Rain, Heat, Traffic",  color: "violet"  },
];

const COLOR_MAP: Record<string, string> = {
  emerald: "#10b981",
  blue:    "#3b82f6",
  violet:  "#8b5cf6",
};

export default function LoginIllustration() {
  const [barsVisible, setBarsVisible] = useState(false);
  const [activityIdx, setActivityIdx] = useState(0);

  // Bars animate in on mount
  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Cycle through activity items
  useEffect(() => {
    const id = setInterval(() => setActivityIdx(i => (i + 1) % ACTIVITY.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-full bg-[#0b1120] overflow-hidden flex flex-col justify-between p-10 border-r border-slate-800/50">

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Welcome header */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <Star size={13} className="text-yellow-400 fill-yellow-400" />
          <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Welcome Back</span>
        </div>
        <h2 className="text-white text-3xl font-bold leading-tight tracking-tight mb-2">
          Your earnings are<br />protected. Always.
        </h2>
        <p className="text-slate-400 text-sm max-w-xs">
          Here&apos;s a snapshot of your coverage activity this week.
        </p>
      </div>

      {/* Weekly earnings chart */}
      <div className="relative z-10 bg-slate-900/50 border border-slate-800/60 rounded-2xl p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white text-sm font-bold">Weekly Earnings</p>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <TrendingUp size={13} />
            <span className="text-xs font-bold">+18% this week</span>
          </div>
        </div>
        <div className="flex items-end gap-2 h-28">
          {WEEKS.map((day, i) => {
            const heightPct = (EARNINGS[i] / MAX) * 100;
            const isFriday = i === 4;
            return (
              <div key={day} className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end">
                <div className="w-full flex-1 flex items-end">
                  <motion.div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: isFriday ? "#3b82f6" : "rgba(59,130,246,0.28)",
                      transformOrigin: "bottom",
                      boxShadow: isFriday ? "0 0 12px rgba(59,130,246,0.4)" : "none",
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: barsVisible ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: i * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-medium shrink-0">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="relative z-10 grid grid-cols-3 gap-3 mt-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
            className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3"
          >
            <p className="font-bold text-white text-base leading-none mb-1">{s.value}</p>
            <p className="text-[10px] text-slate-400 leading-snug mb-1.5">{s.label}</p>
            <p className="text-[10px] font-bold" style={{ color: COLOR_MAP[s.color] }}>{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Live recent activity ticker */}
      <div className="relative z-10 mt-4 bg-slate-900/50 border border-slate-800/60 rounded-2xl p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Recent Activity</p>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
            <Clock size={11} /> Live
          </span>
        </div>
        <div className="relative h-12 overflow-hidden">
          <AnimatePresence mode="wait">
            {ACTIVITY.map((item, i) =>
              i === activityIdx ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${COLOR_MAP[item.color]}20`, border: `1px solid ${COLOR_MAP[item.color]}40` }}>
                      <item.icon size={14} style={{ color: COLOR_MAP[item.color] }} />
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">{item.label}</p>
                      <p className="text-slate-500 text-[10px]">{item.time}</p>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-sm font-bold shrink-0">{item.amount}</span>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
