"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CloudRain, Flame, Construction, ShieldCheck, Wallet, TrendingDown, TrendingUp, Activity } from "lucide-react";
import { useState, useEffect } from "react";

const EVENTS = [
  { id: 1, icon: CloudRain, color: "blue", label: "Monsoon Downpour", impact: "Velocity drop: 40%", loss: "-₹300", payout: "+₹300", bg: "bg-blue-500/5", border: "border-blue-500/20", iconBg: "bg-blue-600", text: "text-blue-500" },
  { id: 2, icon: Flame, color: "red", label: "Extreme Heatwaves", impact: "Risk zone entered", loss: "-₹450", payout: "+₹450", bg: "bg-red-500/5", border: "border-red-500/20", iconBg: "bg-red-500", text: "text-red-500" },
  { id: 3, icon: Construction, color: "orange", label: "Unplanned Detour", impact: "Traffic congestion", loss: "-₹200", payout: "+₹200", bg: "bg-orange-500/5", border: "border-orange-500/20", iconBg: "bg-orange-500", text: "text-orange-500" }
];

export default function AnimatedMapIllustration() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"stable" | "crash" | "buffer">("stable");

  // Animation Sequence Logic
  // 0s: Stable (Graph flat/climbing gently)
  // 1.5s: Crash (Disruption alert pops, graph plummets)
  // 3s: Buffer (Survival Lens activates, graph fills back up)
  // 5.5s: Next Cycle
  useEffect(() => {
    let crashTimer: NodeJS.Timeout;
    let bufferTimer: NodeJS.Timeout;

    const runSequence = () => {
      setPhase("stable");
      
      crashTimer = setTimeout(() => {
        setPhase("crash");
        
        bufferTimer = setTimeout(() => {
          setPhase("buffer");
        }, 1500);

      }, 1500);
    };

    runSequence();
    const loop = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % EVENTS.length);
      runSequence();
    }, 5500);

    return () => {
      clearInterval(loop);
      clearTimeout(crashTimer);
      clearTimeout(bufferTimer);
    };
  }, []);

  const activeEvent = EVENTS[currentIndex];

  return (
    <div className="relative w-full h-full bg-[#f8fafc] overflow-hidden flex flex-col justify-center p-12 lg:p-16 border-r border-slate-200/50">
      
      {/* ── AMBIENT ENVIRONMENT ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[0%] left-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px]" />
        
        <svg className="absolute inset-0 w-full h-full opacity-[0.4]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="lightGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="gridFade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="black" stopOpacity="1" />
              <stop offset="80%" stopColor="black" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#lightGrid)" mask="url(#gridFade)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col gap-10">
        
        {/* ── TYPOGRAPHY HEADER ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-emerald-200/80 bg-white/80 mb-6 backdrop-blur-md shadow-sm">
            <TrendingUp size={14} className="text-emerald-500" strokeWidth={2.5} />
            <span className="text-slate-800 text-[10px] font-black uppercase tracking-[0.2em] pt-px">Eradicate Income Volatility</span>
          </div>
          <h2 className="text-slate-900 text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-5 drop-shadow-sm">
            End the struggle.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-600 to-emerald-500">
              Guarantee your pay.
            </span>
          </h2>
          <p className="text-slate-500 text-[15px] font-medium leading-relaxed max-w-md">
            Gig driving is financially brutal and unpredictable. Survival Lens stabilizes your earnings by instantly covering real-world wage drops.
          </p>
        </motion.div>

        {/* ── VOLATILITY ENGINE WIDGET ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04),_0_30px_60px_rgb(0,0,0,0.04)] relative z-20"
        >
          <div className="bg-[#fcfdfd] border border-slate-100 rounded-[2rem] p-5 h-[320px] flex flex-col w-full relative overflow-hidden">
            
            {/* Live Chart Status Bar */}
            <div className="flex justify-between items-center mb-4 relative z-20">
              <div className="flex items-center gap-2">
                <Activity size={12} className={phase === 'crash' ? 'text-red-500' : 'text-slate-400'} />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Live Earnings Trajectory</span>
              </div>
              
              <AnimatePresence mode="wait">
                 {phase === "stable" && (
                   <motion.div key="st" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-md">
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Optimal</span>
                   </motion.div>
                 )}
                 {phase === "crash" && (
                   <motion.div key="cr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-2 py-1 bg-red-50 border border-red-200 rounded-md">
                     <span className="text-[9px] font-black uppercase tracking-widest text-red-600">Disrupted</span>
                   </motion.div>
                 )}
                 {phase === "buffer" && (
                   <motion.div key="bu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                     <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Buffered</span>
                   </motion.div>
                 )}
              </AnimatePresence>
            </div>

            {/* SVG Live Volatility Graph */}
            <div className="absolute bottom-6 left-0 w-full h-32 pr-4 pl-4 z-10">
               <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" className="overflow-visible">
                 
                 {/* Standard Baseline Path */}
                 <motion.path 
                   d="M 50 80 L 100 70 L 150 75 L 200 65 L 250 20 L 300 20 L 350 20"
                   fill="none" 
                   stroke="#e2e8f0" 
                   strokeWidth="3" 
                   strokeLinecap="round" 
                   strokeDasharray="4 6"
                 />

                 {/* The Actual Earnings Trajectory */}
                 <motion.path 
                   d={phase === "crash" ? "M 50 80 L 100 70 L 150 75 L 200 65 L 250 90 L 300 95 L 350 95" : phase === "buffer" ? "M 50 80 L 100 70 L 150 75 L 200 65 L 250 20 L 300 20 L 350 20" : "M 50 80 L 100 70 L 150 75 L 200 65 L 250 60 L 300 55 L 350 50"}
                   fill="none" 
                   stroke={phase === "crash" ? "#ef4444" : phase === "buffer" ? "#10b981" : "#3b82f6"}
                   strokeWidth="4" 
                   strokeLinecap="round" 
                   animate={{ d: phase === "crash" ? "M 50 80 L 100 70 L 150 75 L 200 65 L 250 90 L 300 95 L 350 95" : phase === "buffer" ? "M 50 80 L 100 70 L 150 75 L 200 65 L 250 20 L 300 20 L 350 20" : "M 50 80 L 100 70 L 150 75 L 200 65 L 250 60 L 300 55 L 350 50" }}
                   transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                 />
                 
                 {/* The Buffer Glow Fill (Only visible during buffer) */}
                 <AnimatePresence>
                   {phase === "buffer" && (
                     <motion.path 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       transition={{ duration: 0.5 }}
                       d="M 200 65 L 250 20 L 300 20 L 350 20 L 350 95 L 300 95 L 250 90 Z"
                       fill="rgba(16,185,129,0.2)"
                     />
                   )}
                 </AnimatePresence>

                 {/* Floating Indicator Dot */}
                 <motion.circle 
                   r="6" 
                   fill={phase === "crash" ? "#ef4444" : phase === "buffer" ? "#10b981" : "#3b82f6"}
                   animate={{ 
                     cx: phase === "buffer" ? 350 : phase === "crash" ? 280 : 250, 
                     cy: phase === "crash" ? 93 : phase === "buffer" ? 20 : 60
                   }}
                   transition={{ duration: 0.8, type: "spring", bounce: 0.1 }}
                   style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))" }}
                 />
               </svg>
            </div>

            {/* Overlays */}
            <div className="relative z-20 mt-4 flex flex-col gap-3">
              
              <AnimatePresence mode="wait">
                {phase === "crash" && (
                  <motion.div 
                    key="alert"
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className={`bg-white border ${activeEvent.border} rounded-xl p-3 flex items-center justify-between shadow-xl cursor-default mx-2 mt-4`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${activeEvent.iconBg} flex items-center justify-center shrink-0 text-white`}>
                        <activeEvent.icon size={16} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="text-[12px] font-black tracking-tight text-slate-900">{activeEvent.label}</h4>
                        <p className={`text-[10px] font-bold text-red-500`}>Pay Dropping: {activeEvent.loss}</p>
                      </div>
                    </div>
                    <TrendingDown className="text-red-500 mr-2 opacity-50" size={18} />
                  </motion.div>
                )}

                {phase === "buffer" && (
                  <motion.div 
                    key="payout"
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className={`bg-slate-900 border border-slate-700 rounded-xl p-3 flex items-center justify-between shadow-[0_15px_30px_rgba(15,23,42,0.2)] mx-2 mt-4`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 border border-emerald-500/30`}>
                        <Wallet size={16} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="text-[12px] font-bold tracking-tight text-white">Loss Buffered</h4>
                        <p className={`text-[10px] uppercase tracking-widest font-black text-emerald-400`}>Income Stabilized</p>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-black tracking-tight mr-2">{activeEvent.payout}</span>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
