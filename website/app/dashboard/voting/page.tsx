"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FilePlus, BarChart2, ShieldCheck, Wrench, Eye, ThumbsUp, 
  BadgeCheck, X, Activity, ArrowRight, CloudRain, ShieldAlert
} from "lucide-react";

export default function VotingPage() {
  const [activeTab, setActiveTab] = useState<"support" | "supported" | "raised">("support");
  const [isRaising, setIsRaising] = useState(false);

  // Re-themed data using Gig Worker/Geospatial contexts
  const CLAIMS = [
    {
      id: "CLM-9092",
      icon: CloudRain,
      color: "blue",
      title: "Flash Flood Alert - Lower East Side",
      desc: "Water levels rising rapidly on 4th Ave making deliveries extremely hazardous. Seeking validation to trigger auto-protection for route #4A.",
      risk: "High Risk",
      status: "34% / 100%",
      progress: 34,
    },
    {
      id: "CLM-8831",
      icon: ShieldAlert,
      color: "red",
      title: "Arbitrary Deactivations Spiking",
      desc: "Multiple drivers reporting sudden account suspensions on Platform Z without appeal options. Seeking consensus to trigger legal fund.",
      risk: "Critical",
      status: "82% / 100%",
      progress: 82,
    },
    {
      id: "CLM-7712",
      icon: Activity,
      color: "orange",
      title: "Algorithm Payout Suppression",
      desc: "Fare mapping shows a 15% reduction in base pay across all zones since the v4.0 app update. Need 100 signatures to dispute.",
      risk: "Medium Risk",
      status: "91% / 100%",
      progress: 91,
    }
  ];

  const SUPPORTED_CLAIMS = [
    {
      id: "CLM-6621",
      icon: CloudRain,
      color: "emerald",
      title: "Hurricane Base Payout",
      desc: "Emergency payout multipliers successfully dispensed to coastal drivers over 48 hours. Consensus reached and executed.",
      tag: "Verified",
    },
    {
      id: "CLM-5100",
      icon: Wrench,
      color: "emerald",
      title: "Payment Gateway Crash",
      desc: "Bank API failure affected direct withdrawals. Loss of time completely buffered and credited to all active workers.",
      tag: "Verified",
    },
    {
      id: "CLM-4882",
      icon: ShieldAlert,
      color: "emerald",
      title: "City-Wide Curfew Active",
      desc: "Mandatory curfew restricted route operations for 12 hours. Platform losses fully reimbursed from the protection pool.",
      tag: "Verified",
    }
  ];

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full relative min-h-full">
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ── HEADER ── */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
           <div className="flex items-center gap-2.5 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100/50">
              Decentralized Consensus
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
            Voting Chamber
          </h1>
          <p className="text-slate-500 font-medium">
            Validate community risk claims to trigger protective payouts.
          </p>
        </div>
        
        <button 
          onClick={() => setIsRaising(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 transition-all text-sm group shrink-0"
        >
          <FilePlus size={18} strokeWidth={2.5} />
          Raise Risk Ticket
        </button>
      </div>

      {/* ── RAISE TICKET MODAL ── */}
      <AnimatePresence>
        {isRaising && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setIsRaising(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] relative z-10 border border-slate-100"
            >
              <button 
                onClick={() => setIsRaising(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
              
              <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Raise Risk Ticket</h2>
              <p className="text-sm text-slate-500 font-medium mb-8">Submit disruptive events for community validation.</p>
              
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsRaising(false); }}>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Event Title</label>
                  <input type="text" placeholder="e.g. Major Highway Blocked" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-medium text-slate-900 placeholder-slate-400 transition-all outline-none" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Severity / Impact</label>
                  <select className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-medium text-slate-900 transition-all outline-none">
                    <option>High Risk (Immediate payouts)</option>
                    <option>Medium Risk (Algorithmic routing)</option>
                    <option>Low Risk (Observation)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Evidence / Description</label>
                  <textarea placeholder="Describe the conditions..." rows={3} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-medium text-slate-900 placeholder-slate-400 transition-all outline-none resize-none" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 transition-all text-sm mt-4">
                  Broadcast to Network
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── INTERACTIVE TABS ── */}
      <div className="relative z-10 flex border-b border-slate-200/60 mb-8 overflow-x-auto no-scrollbar">
        {(["support", "supported", "raised"] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex items-center gap-2 pb-4 px-4 mr-4 text-sm font-bold tracking-tight transition-colors whitespace-nowrap outline-none ${activeTab === tab ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "support" && <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === tab ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}>12</span>}
            {tab === "supported" && <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === tab ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}>48</span>}
            
            {activeTab === tab && (
              <motion.div layoutId="votingTab" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-slate-900 rounded-t-full" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
            )}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="relative z-10 min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* SUPPORT TAB (ACTIVE POLLS) */}
          {activeTab === "support" && (
            <motion.div key="support" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {CLAIMS.map((claim) => (
                <div key={claim.id} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col justify-between group hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <div>
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                        <claim.icon size={22} className={`text-${claim.color}-500`} strokeWidth={2.5} />
                      </div>
                      <span className={`bg-${claim.color}-50 text-${claim.color}-600 border border-${claim.color}-100/50 text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg shrink-0`}>
                        {claim.risk}
                      </span>
                    </div>
                    
                    <h3 className="text-[17px] font-black text-slate-900 leading-tight mb-2 tracking-tight">
                      {claim.title}
                    </h3>
                    <p className="text-[13px] text-slate-500 font-medium mb-6 leading-relaxed line-clamp-3">
                      {claim.desc}
                    </p>
                  </div>

                  <div>
                    <div className="bg-slate-50/80 rounded-2xl p-4 mb-5 border border-slate-100/60">
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        <span>Consensus Status</span>
                        <span className="text-slate-900">{claim.status}</span>
                      </div>
                      <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${claim.progress}%` }} transition={{ duration: 1, delay: 0.2 }} className="bg-slate-900 h-full rounded-full" />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 flex items-center justify-center bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-bold py-3.5 rounded-2xl transition-all text-[13px] shadow-sm">
                        Details
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 transition-all text-[13px]">
                        <ThumbsUp size={16} strokeWidth={2.5} />
                        Support
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* SUPPORTED TAB (HISTORY) */}
          {activeTab === "supported" && (
            <motion.div key="supported" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {SUPPORTED_CLAIMS.map((claim) => (
                <div key={claim.id} className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-white flex flex-col justify-between group transition-all duration-300">
                  <div>
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-100/50">
                        <claim.icon size={22} className={`text-${claim.color}-500`} strokeWidth={2.5} />
                      </div>
                      <span className={`bg-${claim.color}-50 text-${claim.color}-600 border border-${claim.color}-100/50 text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg shrink-0`}>
                        {claim.tag}
                      </span>
                    </div>
                    
                    <h3 className="text-[17px] font-black text-slate-900 leading-tight mb-2 tracking-tight">
                      {claim.title}
                    </h3>
                    <p className="text-[13px] text-slate-500 font-medium mb-6 leading-relaxed line-clamp-3">
                      {claim.desc}
                    </p>
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
            </motion.div>
          )}

          {/* RAISED TAB (MY ISSUES) */}
          {activeTab === "raised" && (
            <motion.div key="raised" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-500 mb-4 border border-blue-100/50">
                <FilePlus size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">No Active Tickets</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-6">You haven't submitted any risk tickets to the network for validation yet.</p>
              <button onClick={() => setIsRaising(true)} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 hover:bg-black transition-colors flex items-center gap-2">
                 Raise a Ticket
                 <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── INTELLIGENCE FOOTER (Visible on all tabs) ── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2 bg-slate-900 rounded-[2rem] p-8 lg:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-3 tracking-tight">Why your vote matters?</h2>
            <p className="text-slate-400 font-medium leading-relaxed max-w-xl mb-8">
              Every supported claim strengthens the collective intelligence. Your validation mathematically triggers automated risk mitigation payouts for the entire driver network.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex pl-2">
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-600 -ml-2" />
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-emerald-500 -ml-2" />
                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-blue-500 -ml-2 flex items-center justify-center text-[10px] font-black">+</div>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                2,401 nodes active
              </span>
            </div>
          </div>
        </div>

        {/* Rep Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 flex flex-col justify-center border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-center sm:text-left">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Network Authority
          </p>
          <div className="mb-4">
            <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-2">
              84<span className="text-2xl text-slate-400">%</span>
            </h2>
            <p className="text-sm font-bold text-slate-500">
              Reliability Score
            </p>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-auto text-emerald-600 bg-emerald-50 border border-emerald-100/50 py-1.5 px-3 rounded-lg w-auto sm:w-max">
            <BadgeCheck size={14} className="fill-emerald-50" strokeWidth={2.5} />
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">
              Top Validator
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
