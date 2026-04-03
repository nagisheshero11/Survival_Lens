"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BadgeCheck,
  CloudRain,
  ShieldAlert,
  ThumbsUp,
  Wrench,
} from "lucide-react";

type Claim = {
  id: string;
  icon: typeof CloudRain;
  color: string;
  title: string;
  desc: string;
  risk: string;
  status: string;
  progress: number;
  location: string;
  severity: string;
  details: string;
};

const CLAIMS: Claim[] = [
  {
    id: "CLM-9092",
    icon: CloudRain,
    color: "blue",
    title: "Flash Flood Alert - Lower East Side",
    desc: "Water levels rising rapidly on 4th Ave making deliveries extremely hazardous. Seeking validation to trigger auto-protection for route #4A.",
    risk: "High Risk",
    status: "34% / 100%",
    progress: 34,
    location: "Lower East Side, Manhattan",
    severity: "High Risk",
    details:
      "Flooding is blocking storefront access and creating unsafe delivery conditions. Supporters are being asked to validate the route risk so protection payouts can be activated.",
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
    location: "Platform Z Network",
    severity: "Critical",
    details:
      "Account suspensions are being reported without notice, review, or appeal. This ticket aggregates the latest reports and evidence to support network action.",
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
    location: "All active zones",
    severity: "Medium Risk",
    details:
      "The current payout mapping is returning lower base earnings across multiple routes after the v4.0 rollout. Community validation is requested before escalation.",
  },
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
  },
];

export default function VotingPage() {
  const [activeTab, setActiveTab] = useState<"support" | "supported">("support");
  const [selectedItem, setSelectedItem] = useState<Claim | null>(null);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full relative min-h-full">
      <div 
        className="absolute top-[-5%] left-[-10%] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none z-0 transition-opacity duration-1000" 
        style={{ width: "clamp(20rem, 40vw, 37.5rem)", height: "clamp(20rem, 40vw, 37.5rem)" }}
      />

      <div className="relative z-10 mb-10">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100/50">
            Decentralized Consensus
          </span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Voting Chamber</h1>
        <p className="text-slate-500 font-medium">Validate community risk claims to trigger protective payouts.</p>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div className="fixed inset-y-0 left-64 right-0 z-[60] flex items-center justify-center px-4 py-6">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
              aria-label="Close claim details"
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              className="relative z-10 max-w-3xl rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] border border-slate-100 p-6 lg:p-8"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 mb-2">Complete Details</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-5">{selectedItem.title}</h2>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">Severity</p>
                  <p className="font-bold text-slate-900">{selectedItem.severity}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">Location</p>
                  <p className="font-bold text-slate-900">{selectedItem.location}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">Status</p>
                  <p className="font-bold text-slate-900">{selectedItem.status}</p>
                </div>
              </div>

              <p className="text-sm leading-7 text-slate-600 font-medium mb-6">{selectedItem.details}</p>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex border-b border-slate-200/60 mb-8 overflow-x-auto no-scrollbar">
        {(["support", "supported"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex items-center gap-2 pb-4 px-4 mr-4 text-sm font-bold tracking-tight transition-colors whitespace-nowrap outline-none ${activeTab === tab ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "support" && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === tab ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                12
              </span>
            )}
            {tab === "supported" && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === tab ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}
              >
                48
              </span>
            )}

            {activeTab === tab && (
              <motion.div
                layoutId="votingTab"
                className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-slate-900 rounded-t-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="relative z-10 min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "support" && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {CLAIMS.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col justify-between group hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300"
                >
                  <div>
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                        <claim.icon size={22} className={`text-${claim.color}-500`} strokeWidth={2.5} />
                      </div>
                      <span className={`bg-${claim.color}-50 text-${claim.color}-600 border border-${claim.color}-100/50 text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg shrink-0`}>
                        {claim.risk}
                      </span>
                    </div>

                    <h3 className="text-[17px] font-black text-slate-900 leading-tight mb-2 tracking-tight">{claim.title}</h3>
                    <p className="text-[13px] text-slate-500 font-medium mb-6 leading-relaxed line-clamp-3">{claim.desc}</p>
                  </div>

                  <div>
                    <div className="bg-slate-50/80 rounded-2xl p-4 mb-5 border border-slate-100/60">
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        <span>Consensus Status</span>
                        <span className="text-slate-900">{claim.status}</span>
                      </div>
                      <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${claim.progress}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="bg-slate-900 h-full rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedItem(claim)}
                        className="w-full flex-1 flex items-center justify-center bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-bold py-3.5 rounded-2xl transition-all text-[13px] shadow-sm"
                      >
                        Details
                      </button>
                      <button className="w-full flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 transition-all text-[13px]">
                        <ThumbsUp size={16} strokeWidth={2.5} />
                        Support
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "supported" && (
            <motion.div
              key="supported"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {SUPPORTED_CLAIMS.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-white flex flex-col justify-between group transition-all duration-300"
                >
                  <div>
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-100/50">
                        <claim.icon size={22} className={`text-${claim.color}-500`} strokeWidth={2.5} />
                      </div>
                      <span className={`bg-${claim.color}-50 text-${claim.color}-600 border border-${claim.color}-100/50 text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg shrink-0`}>
                        {claim.tag}
                      </span>
                    </div>

                    <h3 className="text-[17px] font-black text-slate-900 leading-tight mb-2 tracking-tight">{claim.title}</h3>
                    <p className="text-[13px] text-slate-500 font-medium mb-6 leading-relaxed line-clamp-3">{claim.desc}</p>
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
        </AnimatePresence>
      </div>
    </div>
  );
}
