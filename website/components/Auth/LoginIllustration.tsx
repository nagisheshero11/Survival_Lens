"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, TrendingUp, Zap, Clock, Activity } from "lucide-react";
import { useState, useEffect } from "react";

// Animated bar chart data — weekly earnings
const WEEKS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const EARNINGS = [320, 440, 550, 480, 1100, 760, 920];
const MAX = Math.max(...EARNINGS);

// Live Feed Items
const ACTIVITY = [
  { icon: ShieldCheck, color: "emerald", label: "Rain coverage triggered", amount: "+₹120", time: "2h ago" },
  { icon: Zap,         color: "indigo",  label: "Algorithm Drop Protected", amount: "+₹840", time: "Yesterday" },
  { icon: Activity,    color: "blue",    label: "Zone Volatility Secured", amount: "+₹450", time: "3 days ago" },
];

export default function LoginIllustration() {
  const [barsVisible, setBarsVisible] = useState(false);
  const [activityIdx, setActivityIdx] = useState(0);

  // Bars animate in on mount
  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Cycle through activity items
  useEffect(() => {
    const id = setInterval(() => setActivityIdx(i => (i + 1) % ACTIVITY.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-50 overflow-hidden flex flex-col justify-center p-12 lg:p-16 border-r border-slate-200/50">
      
      {/* ── IMMERSIVE BACKGROUND EFFECTS ── */}
      <div className="absolute inset-0 z-0">
        {/* Soft pastel mesh gradient */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-sky-300/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Tech Grid (Subtle Dark on Light) */}
        <div 
          className="absolute inset-0 opacity-[0.25] mix-blend-multiply"
          style={{
            backgroundImage: `linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)"
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col gap-10">
        
        {/* ── WELCOME HEADER ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-white/70 mb-6 backdrop-blur-md shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
            <span className="text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] pt-px">Secure Node Active</span>
          </div>
          <h2 className="text-slate-900 text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight mb-4 drop-shadow-sm">
            Guaranteed <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Income Floor.
            </span>
          </h2>
          <p className="text-slate-600 text-[15px] font-medium leading-relaxed max-w-sm">
            Live infrastructure preview. Watch the automated protocol intelligently buffer real-world disruption metrics.
          </p>
        </motion.div>

        {/* ── MAIN DASHBOARD WIDGET ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-2xl border border-slate-200 rounded-[2rem] p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50 duration-700 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Weekly Payouts</p>
               <h3 className="text-slate-900 text-2xl font-black tracking-tight flex items-baseline gap-1">
                 <span className="text-slate-400 font-medium">₹</span>4,150
               </h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 shadow-sm">
              <TrendingUp size={16} strokeWidth={2.5} />
              <span className="text-xs font-black tracking-wide">+34.5%</span>
            </div>
          </div>

          {/* Chart Area */}
          <div className="flex items-end gap-3 h-32 lg:h-40 relative z-10">
            {WEEKS.map((day, i) => {
              const heightPct = (EARNINGS[i] / MAX) * 100;
              const isFriday = i === 4; // Highlighted Bar
              return (
                <div key={day} className="flex flex-col items-center gap-3 flex-1 h-full justify-end group/bar cursor-pointer">
                  <div className="w-full flex-1 flex items-end relative w-full max-w-[40px]">
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-black py-1.5 px-2 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20">
                      ₹{EARNINGS[i]}
                    </div>

                    <motion.div
                      className="w-full rounded-md lg:rounded-lg relative overflow-hidden"
                      style={{
                        height: `${heightPct}%`,
                        background: isFriday 
                          ? "linear-gradient(to top, #3b82f6, #6366f1)" // Solid bright gradient for active
                          : "rgba(226, 232, 240, 0.6)", // Slate 200 for inactive
                        boxShadow: isFriday ? "0 10px 25px rgba(59,130,246,0.35)" : "none",
                        border: isFriday ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.8)",
                        transformOrigin: "bottom",
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: barsVisible ? 1 : 0 }}
                      transition={{ duration: 0.8, delay: i * 0.08, type: "spring", bounce: 0.3 }}
                    >
                      {/* Active inner highlight */}
                      {isFriday && <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/30 to-transparent" />}
                    </motion.div>
                  </div>
                  <span className={`text-[10px] font-bold tracking-wider ${isFriday ? "text-blue-600" : "text-slate-400"}`}>{day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── LIVE ACTIVITY FEED ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-[1.5rem] p-5 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2">
              <Activity size={12} className="text-blue-600" /> Live Protocol Events
            </p>
            <span className="flex items-center gap-1.5 text-[9px] text-blue-600 font-bold uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md border border-blue-100/50">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" /> Syncing
            </span>
          </div>

          <div className="relative h-14 overflow-hidden">
            <AnimatePresence mode="wait">
              {ACTIVITY.map((item, i) =>
                i === activityIdx ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="absolute inset-0 flex items-center justify-between bg-white border border-slate-100 rounded-xl p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border`}
                        style={{ 
                          backgroundColor: item.color === 'emerald' ? '#f0fdf4' : item.color === 'indigo' ? '#eef2ff' : '#eff6ff',
                          borderColor: item.color === 'emerald' ? '#d1fae5' : item.color === 'indigo' ? '#e0e7ff' : '#dbeafe',
                          color: item.color === 'emerald' ? '#059669' : item.color === 'indigo' ? '#4f46e5' : '#2563eb'
                        }}>
                        <item.icon size={18} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-slate-900 text-sm font-bold tracking-wide">{item.label}</p>
                        <p className="text-slate-500 text-[11px] font-medium">{item.time}</p>
                      </div>
                    </div>
                    <span 
                      className="text-sm font-black tracking-tight"
                      style={{ color: item.color === 'emerald' ? '#059669' : item.color === 'indigo' ? '#4f46e5' : '#2563eb' }}
                    >
                      {item.amount}
                    </span>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
