"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Pencil, 
  IdCard, 
  Lock, 
  FileWarning,
  ArrowRight,
  ShieldAlert,
  Fingerprint,
  Wallet,
  Clock,
  BadgeCheck
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // ── KYC STATE ──
  const [kycData, setKycData] = useState({
    aadhaar: "",
    pan: "",
    photo: "",
    location: "",
    age: "",
    company: "",
    partnerId: "",
    dashboardScreenshot: "",
    avgWeeklyIncome: "",
    avgWorkingHours: "",
    status: "not_started"
  });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("survivalLensKyc");
    if (saved) {
      setKycData(JSON.parse(saved));
    }
    setIsMounted(true);
  }, []);

  // Calculate KYC Completion Percentage
  const completionProps = useMemo(() => {
    const fields = [
      kycData.aadhaar, kycData.pan, kycData.photo, kycData.location,
      kycData.age, kycData.company, kycData.partnerId, kycData.dashboardScreenshot,
      kycData.avgWeeklyIncome, kycData.avgWorkingHours
    ];
    
    const filledFields = fields.filter(f => f.trim() !== "").length;
    const totalFields = fields.length;
    const percentage = Math.round((filledFields / totalFields) * 100);

    return { percentage, filledFields, totalFields };
  }, [kycData]);

  if (!isMounted) return null;

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full relative min-h-full">
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className={`absolute top-[-5%] right-[-5%] w-[500px] h-[500px] ${completionProps.percentage === 100 ? "bg-emerald-400/5" : "bg-amber-400/5"} rounded-full blur-[140px] pointer-events-none z-0 transition-colors duration-1000`} />

      {/* ── CRITICAL KYC BANNER (Only show if not 100% complete) ── */}
      {completionProps.percentage < 100 && (
        <div className="relative z-10 bg-amber-50 border border-amber-200/60 rounded-[2.5rem] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 shadow-[0_10px_40px_rgba(251,191,36,0.1)]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0 border border-amber-200/50">
               <ShieldAlert size={24} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 bg-amber-100/50 px-2.5 py-1 rounded-md mb-2 inline-block">
                Action Required
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">
                KYC Authentication Pending ({completionProps.percentage}%)
              </h2>
              <p className="text-[13px] text-amber-800 font-medium leading-relaxed max-w-2xl">
                Compliance regulations require identity verification before we can activate your 
                algorithmic buffers. Your account payouts are currently <strong>frozen</strong>.
              </p>
            </div>
          </div>
          <button 
            onClick={() => router.push("/dashboard/profile/kyc")}
            className="w-full md:w-auto bg-slate-900 hover:bg-black text-white font-black px-8 py-4 rounded-2xl shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 transition-all text-[14px] flex items-center justify-center gap-2 group shrink-0"
          >
            <Fingerprint size={18} />
            {completionProps.percentage > 0 ? "Resume KYC Protocol" : "Start KYC Protocol"}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* ── SUCCESS BANNER (Show when 100% complete) ── */}
      {completionProps.percentage === 100 && (
        <div className="relative z-10 bg-emerald-50 border border-emerald-200/60 rounded-[2.5rem] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 shadow-[0_10px_40px_rgba(16,185,129,0.05)]">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-200/50">
               <BadgeCheck size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">
                Identity Verified & Active
              </h2>
              <p className="text-[13px] text-emerald-800 font-medium leading-relaxed">
                Your algorithmic parameters and legal documents are fully synced with the protocol.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* ── LEFT COLUMN: Profile Status ── */}
        <div className="space-y-6 lg:space-y-8 flex flex-col">
          
          {/* Identity Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col items-center relative overflow-hidden">
            {completionProps.percentage === 100 && (
              <div className="absolute top-0 right-0 p-8 text-emerald-50 opacity-10 pointer-events-none">
                 <BadgeCheck size={120} strokeWidth={1} />
              </div>
            )}
            
            <div className="relative mb-6 z-10">
              <div className={`w-32 h-32 ${completionProps.percentage === 100 ? "bg-emerald-950 border-emerald-50" : "bg-slate-900 border-white"} rounded-full border-4 shadow-xl overflow-hidden flex flex-col items-center justify-end relative transition-colors duration-500`}>
                <div className={`w-14 h-14 ${completionProps.percentage === 100 ? "bg-emerald-100" : "bg-amber-100"} rounded-t-full absolute bottom-4 z-10 transition-colors duration-500`}></div>
                <div className="w-20 h-10 bg-slate-800 rounded-t-[2.5rem] absolute bottom-0 z-20"></div>
                <div className={`w-20 h-8 ${completionProps.percentage === 100 ? "bg-emerald-950" : "bg-slate-900"} rounded-full absolute top-3 z-20 transition-colors duration-500`}></div>
              </div>
              <button disabled className="absolute bottom-1 right-1 bg-white rounded-full p-2.5 text-slate-400 border border-slate-100 shadow-sm cursor-not-allowed z-20">
                <Pencil size={14} strokeWidth={2.5} />
              </button>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight z-10">
              Marcus Sterling
            </h2>
            <p className={`text-[13px] font-bold ${completionProps.percentage === 100 ? "text-emerald-500" : "text-slate-400"} mb-8 uppercase tracking-widest transition-colors duration-500 z-10`}>
              {completionProps.percentage === 100 ? "Verified Operative" : "Unverified Driver"}
            </p>
            
            <div className="w-full flex justify-between px-2 border-t border-slate-100/60 pt-6 z-10">
              <div className="text-center">
                <p className={`text-[9px] uppercase font-black ${completionProps.percentage === 100 ? "text-emerald-500" : "text-amber-500"} tracking-[0.2em] mb-1.5 flex items-center justify-center gap-1 transition-colors duration-500`}>
                  {completionProps.percentage === 100 ? <BadgeCheck size={10} strokeWidth={3} /> : <FileWarning size={10} strokeWidth={3} />} Status
                </p>
                <p className="text-[13px] font-black text-slate-900 tracking-tight">
                  {completionProps.percentage === 100 ? "Active Buffer" : "Restricted"}
                </p>
              </div>
              <div className="text-center">
                <p className={`text-[9px] uppercase font-black ${completionProps.percentage === 100 ? "text-emerald-500" : "text-slate-300"} tracking-[0.2em] mb-1.5 flex items-center justify-center gap-1 transition-colors duration-500`}>
                  <Lock size={10} strokeWidth={3} /> Authority
                </p>
                <p className="text-[13px] font-black text-slate-900 tracking-tight">
                  {completionProps.percentage === 100 ? "Level 3 Access" : "Level 0"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Support Hotlink (Only if verified) */}
          {completionProps.percentage === 100 && (
             <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl text-white text-center">
                <h3 className="text-lg font-black tracking-tight mb-2">Legal Dispute?</h3>
                <p className="text-[12px] font-medium text-slate-400 mb-6">Your verified identity gives you priority access to live network analysts.</p>
                <button onClick={() => router.push('/dashboard/support')} className="bg-white/10 hover:bg-white/20 text-white font-black py-3 px-6 rounded-xl transition-all border border-white/5 text-[13px] tracking-tight">Access Control Center</button>
             </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: Configuration ── */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          
          {/* KYC Tracking Widget (ONLY show if NOT 100% complete) */}
          {completionProps.percentage < 100 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                   <Fingerprint size={20} strokeWidth={2.5} />
                </div>
                <div>
                   <h2 className="text-xl font-black text-slate-900 tracking-tight">Regulatory Authentication</h2>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">KYC Protocol Sequence</p>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100/60 mb-6 relative z-10 flex flex-col items-center">
                 <div className="w-full">
                      <div className="flex justify-between items-end mb-4">
                         <h3 className="text-lg font-black text-slate-900 tracking-tight">Completion Progress</h3>
                         <span className="text-[14px] font-black text-blue-600 tracking-tight">{completionProps.filledFields} of {completionProps.totalFields} Fields</span>
                      </div>

                      <div className="w-full bg-slate-200/60 rounded-full h-3 overflow-hidden mb-6 shadow-inner">
                          <motion.div 
                             initial={{ width: 0 }} 
                             animate={{ width: `${completionProps.percentage}%` }} 
                             className="bg-blue-600 h-full rounded-full transition-all duration-700 ease-out" 
                          />
                      </div>
                      
                      <button 
                         onClick={() => router.push("/dashboard/profile/kyc")}
                         className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors font-black tracking-tight text-[14px]"
                      >
                         + Supply Missing Documents
                      </button>
                   </div>
              </div>
            </div>
          )}

          {/* Profile Data Display (Changes dynamically based on verification status) */}
          <div className={`bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white ${completionProps.percentage < 100 ? "opacity-60 pointer-events-none" : ""}`}>
            <div className="flex justify-between items-start mb-10">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/50">
                    <IdCard size={20} strokeWidth={2.5} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                       {completionProps.percentage === 100 ? "Gig Platform Integrations" : "Profile Data Frozen"}
                    </h2>
                    <p className={`text-[11px] font-bold uppercase tracking-widest ${completionProps.percentage === 100 ? "text-emerald-500" : "text-slate-400"}`}>
                       {completionProps.percentage === 100 ? "Verified Metrics" : "Locked during KYC"}
                    </p>
                 </div>
               </div>
               
               {completionProps.percentage === 100 && (
                 <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/50 text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1">
                   <Lock size={12} strokeWidth={2.5} /> Encrypted
                 </span>
               )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {/* Box 1 */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Company / Platform</label>
                <div className={`w-full px-5 py-4 rounded-2xl text-[14px] font-black tracking-tight border ${completionProps.percentage === 100 ? "bg-white border-blue-100/50 text-blue-900 shadow-[0_4px_20px_rgba(59,130,246,0.05)]" : "bg-slate-50/80 border-slate-100/60 text-slate-700"}`}>
                  <div className="flex items-center gap-2">
                     {completionProps.percentage === 100 && <BadgeCheck size={16} className="text-blue-500" />}
                     {kycData.company || "Pending Input..."}
                  </div>
                </div>
              </div>
              
              {/* Box 2 */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Registered Authority Zone</label>
                <div className={`w-full px-5 py-4 rounded-2xl text-[14px] font-black tracking-tight border ${completionProps.percentage === 100 ? "bg-white border-blue-100/50 text-blue-900 shadow-[0_4px_20px_rgba(59,130,246,0.05)]" : "bg-slate-50/80 border-slate-100/60 text-slate-700"}`}>
                  {kycData.location || "Pending Input..."}
                </div>
              </div>

              {/* Box 3 */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-1"><Wallet size={12}/> Target Weekly Income</label>
                <div className={`w-full px-5 py-4 rounded-2xl text-[14px] font-black tracking-tight border ${completionProps.percentage === 100 ? "bg-emerald-50/50 border-emerald-100/50 text-emerald-900" : "bg-slate-50/80 border-slate-100/60 text-slate-700"}`}>
                  {kycData.avgWeeklyIncome ? `₹${Number(kycData.avgWeeklyIncome).toLocaleString()}` : "Pending Input..."}
                </div>
              </div>

              {/* Box 4 */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-1"><Clock size={12}/> Average Weekly Hours</label>
                <div className={`w-full px-5 py-4 rounded-2xl text-[14px] font-black tracking-tight border ${completionProps.percentage === 100 ? "bg-slate-50 outline outline-1 outline-slate-200/50 border-transparent text-slate-900" : "bg-slate-50/80 border-slate-100/60 text-slate-700"}`}>
                  {kycData.avgWorkingHours ? `${kycData.avgWorkingHours} Hours Active` : "Pending Input..."}
                </div>
              </div>
            </div>
            
            {/* Warning block if still locked */}
            {completionProps.percentage < 100 && (
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-3 text-slate-400">
                   <Lock size={16} />
                   <span className="text-[11px] font-bold uppercase tracking-widest">Awaiting algorithmic clearance</span>
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
