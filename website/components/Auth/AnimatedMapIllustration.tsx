"use client";

import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";
import { CloudRain, Flame, Construction, Wallet, ShieldCheck, TrendingDown, Waves, Wind } from "lucide-react";
import { useRef, useState } from "react";

const ROUTE_PATH = "M 60 500 C 160 420, 200 460, 300 360 C 380 280, 400 310, 500 220 C 580 150, 640 180, 720 100";

function samplePath(svgEl: SVGPathElement | null, t: number) {
  if (!svgEl) return { x: 60, y: 500 };
  const len = svgEl.getTotalLength();
  const pt = svgEl.getPointAtLength(t * len);
  return { x: pt.x, y: pt.y };
}

// Each phase: which single zone is active + label info
// Cycle: 36s total
// 0-5s:   Normal
// 5-10s:  Rain
// 10-15s: Flood
// 15-20s: Roadblock
// 20-25s: Wind
// 25-28s: Heat
// 28-32s: Earnings drop (all dim)
// 32-36s: Wallet credited
const CYCLE = 36000;
type Phase = "normal" | "rain" | "flood" | "roadblock" | "wind" | "heat" | "drop" | "credited";

function getPhase(ms: number): Phase {
  const t = ms % CYCLE;
  if (t < 5000)  return "normal";
  if (t < 10000) return "rain";
  if (t < 15000) return "flood";
  if (t < 20000) return "roadblock";
  if (t < 25000) return "wind";
  if (t < 28000) return "heat";
  if (t < 32000) return "drop";
  return "credited";
}

interface Zone {
  id: string;
  x: number;
  y: number;
  r: number;
  Icon: React.ElementType;
  color: string;
  label: string;
  activePhase: Phase; // only visible in this phase (+ drop)
}

const ZONES: Zone[] = [
  { id: "rain",      x: 280, y: 370, r: 72,  Icon: CloudRain,    color: "#3b82f6", label: "Heavy Rain",    activePhase: "rain" },
  { id: "flood",     x: 190, y: 455, r: 78,  Icon: Waves,        color: "#06b6d4", label: "Flood Zone",    activePhase: "flood" },
  { id: "roadblock", x: 490, y: 225, r: 62,  Icon: Construction, color: "#f97316", label: "Roadblock",     activePhase: "roadblock" },
  { id: "wind",      x: 370, y: 305, r: 60,  Icon: Wind,         color: "#a855f7", label: "Strong Wind",   activePhase: "wind" },
  { id: "heat",      x: 650, y: 155, r: 68,  Icon: Flame,        color: "#ef4444", label: "Heat Zone",     activePhase: "heat" },
];

const DISRUPTION_PHASES: Phase[] = ["rain", "flood", "roadblock", "wind", "heat", "drop"];

const PHASE_LABEL: Partial<Record<Phase, { icon: React.ElementType; color: string; text: string; sub?: string }>> = {
  normal:    { icon: ShieldCheck,  color: "#10b981", text: "Coverage active",         sub: "Rider on route, all clear" },
  rain:      { icon: CloudRain,    color: "#3b82f6", text: "Heavy rain detected",      sub: "Rider slowing down" },
  flood:     { icon: Waves,        color: "#06b6d4", text: "Flood zone ahead",         sub: "Route partially blocked" },
  roadblock: { icon: Construction, color: "#f97316", text: "Roadblock detected",       sub: "Rerouting in progress" },
  wind:      { icon: Wind,         color: "#a855f7", text: "Strong winds — 60km/h",   sub: "Rider speed reduced" },
  heat:      { icon: Flame,        color: "#ef4444", text: "Extreme heat zone",        sub: "Work unsafe, coverage active" },
  drop:      { icon: TrendingDown, color: "#f43f5e", text: "Earnings drop detected",   sub: "Coverage triggered automatically" },
};

export default function AnimatedMapIllustration() {
  const pathRef = useRef<SVGPathElement>(null);
  const [bikePos, setBikePos] = useState({ x: 60, y: 500 });
  const tRef = useRef(0);
  const [phase, setPhase] = useState<Phase>("normal");
  const startRef = useRef<number | null>(null);

  useAnimationFrame((time, delta) => {
    if (startRef.current === null) startRef.current = time;
    const elapsed = time - startRef.current;
    const isDisrupted = DISRUPTION_PHASES.includes(phase);
    const speed = isDisrupted ? 0.25 : 1;
    tRef.current = (tRef.current + (delta / 14000) * speed) % 1;
    setBikePos(samplePath(pathRef.current, tRef.current));
    setPhase(getPhase(elapsed));
  });

  const isDisrupted = DISRUPTION_PHASES.includes(phase);
  const labelInfo = PHASE_LABEL[phase];

  return (
    <div className="relative w-full h-full bg-[#0b1120] overflow-hidden flex flex-col justify-between p-10 border-r border-slate-800/50">

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: `linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)`, backgroundSize: "60px 60px" }}
      />

      {/* Ambient background glow — shifts color per phase */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: phase === "rain" || phase === "flood"
            ? "radial-gradient(ellipse 70% 50% at 35% 65%, rgba(59,130,246,0.14) 0%, transparent 70%)"
            : phase === "heat"
            ? "radial-gradient(ellipse 60% 40% at 75% 25%, rgba(239,68,68,0.12) 0%, transparent 70%)"
            : phase === "wind"
            ? "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(168,85,247,0.10) 0%, transparent 70%)"
            : phase === "roadblock"
            ? "radial-gradient(ellipse 60% 40% at 65% 35%, rgba(249,115,22,0.10) 0%, transparent 70%)"
            : "radial-gradient(ellipse 50% 40% at 30% 30%, rgba(16,185,129,0.08) 0%, transparent 70%)"
        }}
        transition={{ duration: 1.5 }}
      />

      {/* Header */}
      <div className="relative z-10 shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <motion.span className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Live Simulation</span>
        </div>
        <h2 className="text-white text-3xl font-bold leading-tight tracking-tight mb-2">
          Earn even when<br />you can&apos;t work
        </h2>
        <p className="text-slate-400 text-sm max-w-xs">
          Real-time income protection for gig workers across India.
        </p>
      </div>

      {/* Map */}
      <div className="relative z-10 flex-1 min-h-0 my-3">
        <svg viewBox="0 0 780 560" className="w-full h-full" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="routeGradAM" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDisrupted ? "#f97316" : "#3b82f6"} />
              <stop offset="100%" stopColor={isDisrupted ? "#ef4444" : "#10b981"} />
            </linearGradient>
          </defs>

          {/* Ghost route */}
          <path d={ROUTE_PATH} fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />

          {/* Glowing active route */}
          <motion.path
            ref={pathRef}
            d={ROUTE_PATH}
            fill="none"
            stroke="url(#routeGradAM)"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: isDisrupted ? 40 : 12, repeat: Infinity, ease: "linear" }}
          />

          {/* Destination */}
          <circle cx="720" cy="100" r="7" fill="#10b981" />
          <motion.circle cx="720" cy="100" r="7" fill="none" stroke="#10b981" strokeWidth="2"
            animate={{ r: [7, 28], opacity: [0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Disruption Zones — only the active one shows */}
          {ZONES.map((z) => {
            const isActive = z.activePhase === phase;
            const isDrop = phase === "drop"; // during drop, show all dimmed
            const show = isActive || isDrop;
            const dim = isDrop && !isActive;

            return (
              <AnimatePresence key={z.id}>
                {show && (
                  <motion.g
                    key={`${z.id}-${phase}`}
                    transform={`translate(${z.x}, ${z.y})`}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{
                      opacity: dim ? 0.3 : [0.8, 1, 0.8],
                      scale: dim ? 0.7 : [1, 1.06, 1],
                    }}
                    exit={{ opacity: 0, scale: 0.4 }}
                    transition={{ duration: dim ? 0.3 : 2.8, repeat: dim ? 0 : Infinity, ease: "easeInOut" }}
                  >
                    {/* Outer glow */}
                    <circle r={z.r} fill={z.color} opacity={dim ? 0.04 : 0.10} />
                    <circle r={z.r * 0.62} fill={z.color} opacity={dim ? 0.06 : 0.15} />
                    {/* Expanding ring pulse */}
                    {!dim && (
                      <motion.circle r={z.r * 0.6} fill="none" stroke={z.color} strokeWidth="2"
                        animate={{ r: [z.r * 0.5, z.r * 1.15], opacity: [0.6, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    {/* Icon */}
                    <foreignObject x={-22} y={-22} width="44" height="44">
                      <div className="flex items-center justify-center w-full h-full" style={{ opacity: dim ? 0.4 : 1 }}>
                        <z.Icon size={32} color={z.color} strokeWidth={1.8} />
                      </div>
                    </foreignObject>
                    {/* Label badge — only on active */}
                    {isActive && (
                      <foreignObject x={-(z.r)} y={z.r + 8} width={z.r * 2} height="18">
                        <div className="flex justify-center">
                          <span style={{ fontSize: 10, color: z.color, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                            {z.label}
                          </span>
                        </div>
                      </foreignObject>
                    )}
                  </motion.g>
                )}
              </AnimatePresence>
            );
          })}

          {/* Bike */}
          <g transform={`translate(${bikePos.x}, ${bikePos.y})`}>
            <circle r="17"
              fill="#0f172a"
              stroke={isDisrupted ? (labelInfo?.color ?? "#f97316") : "#3b82f6"}
              strokeWidth="2.5"
              style={{ filter: `drop-shadow(0 0 12px ${isDisrupted ? (labelInfo?.color ?? "rgba(249,115,22,0.9)") : "rgba(59,130,246,0.9)"})` }}
            />
            <text textAnchor="middle" dominantBaseline="central" fontSize="16">🚴</text>
          </g>
        </svg>
      </div>

      {/* Status label — one at a time */}
      <div className="relative z-10 shrink-0 min-h-[90px] flex items-end">
        <AnimatePresence mode="wait">
          {phase !== "credited" && labelInfo && (
            <motion.div key={phase}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl border"
              style={{
                backgroundColor: `${labelInfo.color}12`,
                borderColor: `${labelInfo.color}30`,
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${labelInfo.color}20`, border: `1px solid ${labelInfo.color}40` }}>
                <labelInfo.icon size={18} color={labelInfo.color} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: labelInfo.color }}>{labelInfo.text}</p>
                {labelInfo.sub && <p className="text-white text-sm font-medium">{labelInfo.sub}</p>}
              </div>
            </motion.div>
          )}

          {phase === "credited" && (
            <motion.div key="credited"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 180, damping: 18 }}
              className="relative bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-emerald-400" />
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Wallet size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-bold text-2xl leading-none mb-1">+₹120 credited</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">All disruptions covered · Survival Lens</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
