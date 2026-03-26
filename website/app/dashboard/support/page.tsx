"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  MapPin, 
  AlertTriangle, 
  LineChart, 
  CornerUpLeft, 
  Ban, 
  Clock,
  ShieldAlert,
  HelpCircle,
  FileText,
  BadgeCheck,
  Send
} from "lucide-react";

export default function SupportPage() {
  const [isRaising, setIsRaising] = useState(false);

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto w-full relative min-h-full">
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="absolute top-[-5%] left-[10%] w-[500px] h-[500px] bg-red-400/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ── HEADER ── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
           <div className="flex items-center gap-2.5 mb-3">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100/50 flex items-center gap-1.5">
               <ShieldAlert size={12} strokeWidth={3} />
               Priority Mediation
             </span>
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
             Dispute Resolution
           </h1>
           <p className="text-[15px] text-slate-500 font-medium leading-relaxed">
             Execute legal requests, challenge algorithmic deactivations, and recover frozen buffer payouts directly through the operational desk.
           </p>
        </div>
        
        <button 
           onClick={() => setIsRaising(!isRaising)}
           className="w-full md:w-auto bg-slate-900 hover:bg-black text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-slate-900/10 hover:-translate-y-0.5 transition-all text-[14px] flex items-center justify-center gap-2 shrink-0 group"
        >
          {isRaising ? <span className="rotate-45 transition-transform"><Plus size={18} strokeWidth={3} /></span> : <Plus size={18} strokeWidth={3} />}
          {isRaising ? "Cancel Sequence" : "Initialize Support Ticket"}
        </button>
      </div>

      {/* ── RAISE TICKET FORM MODULE ── */}
      {isRaising && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="relative z-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-slate-200 mb-12"
        >
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-100">
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
               <FileText size={20} strokeWidth={2.5} />
             </div>
             <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Generate New Payload</h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Formal Dispute Sequence</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
             <div className="md:col-span-2">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Incident Headline</label>
               <input type="text" placeholder="e.g. Unjust Algorithmic Deactivation Notice" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none" />
             </div>
             <div>
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Dispute Classification</label>
               <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-black text-slate-900 transition-all outline-none appearance-none">
                  <option value="">Select Category...</option>
                  <option value="deactivation">Threat of Deactivation</option>
                  <option value="payment">Failed Buffer Payout</option>
                  <option value="gps">Faulty GPS Re-routing</option>
                  <option value="other">Legal Contingency</option>
               </select>
             </div>
             <div>
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Geospatial Target Area</label>
               <input type="text" placeholder="e.g. Sector 4, Metropolitan Zone" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none" />
             </div>
             <div className="md:col-span-2">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Detailed Incident Report</label>
               <textarea rows={4} placeholder="Describe the operational failure or algorithmic inaccuracy in detail..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-medium text-slate-900 placeholder-slate-400 transition-all outline-none resize-none" />
             </div>
          </div>
          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 transition-all text-[14px] flex justify-center items-center gap-2 group">
              <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={2.5} />
              Transmit Dispute to Underwriters
          </button>
        </motion.div>
      )}

      {/* ── TICKET HISTORY ── */}
      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-6 flex items-center gap-2">
         <Clock size={12} strokeWidth={3} /> Active Sequence History
      </h3>

      <div className="space-y-6 relative z-10 w-full max-w-4xl">
        
        {/* Ticket 1: Pending */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col group transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-amber-100/50">
                <AlertTriangle size={20} className="text-amber-500" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  SL-9421
                </p>
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight max-w-md">
                  Unreasonable Account Deactivation Threat by Logistics App
                </h3>
              </div>
            </div>
            <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[9px] uppercase font-black tracking-[0.15em] px-3 py-1.5 rounded-lg shrink-0">
              Audit Pending
            </span>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-6 mb-6 border border-slate-100/60">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Driver Payload Submission
            </p>
            <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
              Received an automated warning for late delivery despite being blocked by a massive unauthorized parade that wasn't tracked on the maps. Requesting legal fund clearance if this leads to immediate termination.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 text-slate-400">
                 <Clock size={12} strokeWidth={2.5}/>
                 <span className="text-[10px] font-bold tracking-widest uppercase">Opened 45 mins ago</span>
               </div>
               <div className="flex items-center gap-2 text-red-500">
                 <span className="text-[12px] font-black leading-none uppercase tracking-widest flex items-center gap-1">
                    <ShieldAlert size={10} strokeWidth={3} /> Priority Level I
                 </span>
               </div>
            </div>
            <button className="text-[11px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100">
               Expand Timeline →
            </button>
          </div>
        </div>

        {/* Ticket 2: Resolved */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col group transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-emerald-100/50">
                <BadgeCheck size={20} className="text-emerald-500" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  SL-9402
                </p>
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight max-w-md">
                  Automated Payout Failure during Hurricane Protocol
                </h3>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/50 text-[9px] uppercase font-black tracking-[0.15em] px-3 py-1.5 rounded-lg shrink-0">
              Dispute Settled
            </span>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-6 mb-4 border border-slate-100/60 opacity-60">
            <p className="text-[13px] font-medium text-slate-600 leading-relaxed truncate">
              The gig-economy risk multiplier for my coastal zone did not trigger the 1.5x buffer during yesterday's severe flash floods.
            </p>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl border-l-4 border-l-emerald-500 p-6 flex gap-4">
            <div className="text-emerald-500 shrink-0 mt-0.5">
               <CornerUpLeft size={16} strokeWidth={3} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-700 mb-2">
                 Survival Lens Auditor Network
               </p>
               <p className="text-[13px] font-black text-emerald-900/80 leading-relaxed italic">
                 &quot;Verified geospatial disconnect on the routing API. We have manually overriden the zone sensor. Your ledger has been credited with the ₹2,500 difference under your Pro Coverage.&quot;
               </p>
            </div>
          </div>
        </div>

        {/* Ticket 3: Rejected */}
        <div className="bg-white/80 backdrop-blur-xl opacity-75 rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col pt-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-slate-100 opacity-50 pointer-events-none">
             <Ban size={100} strokeWidth={1} />
          </div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-200">
                <MapPin size={20} className="text-slate-400" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  SL-9388
                </p>
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight max-w-md">
                  Add custom coverage for International Transit
                </h3>
              </div>
            </div>
            <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[9px] uppercase font-black tracking-[0.15em] px-3 py-1.5 rounded-lg shrink-0">
              Request Refused
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl border-l-4 border-l-slate-400 p-6 flex gap-4 relative z-10">
            <div className="text-slate-400 shrink-0 mt-0.5">
               <CornerUpLeft size={16} strokeWidth={3} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-2">
                 System Policy Enforcement
               </p>
               <p className="text-[13px] font-bold text-slate-600 leading-relaxed italic">
                 &quot;Survival Lens currently only supports domestic fiat-based risk intelligence for gig workers. Cross-border arbitrage logistics are not under our protection umbrella at this stage.&quot;
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
