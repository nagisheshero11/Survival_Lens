"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Pencil, 
  MapPin, 
  Lock, 
  ArrowRight,
  ShieldAlert,
  Fingerprint,
  BadgeCheck,
  Mail,
  Smartphone,
  ShieldHalf
} from "lucide-react";
import { getKycData, calculateKycCompletion } from "../../../(services)/kyc";

export default function ProfilePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // ── USER PROFILE STATE ──
  const [profile, setProfile] = useState({
    fullName: "",
    mobile: "",
    mobileVerified: false,
    email: "",
    emailVerified: false,
    address: ""
  });

  // ── KYC API FETCH ──
  const [completionProps, setCompletionProps] = useState({ percentage: 0, filledFields: 0, totalFields: 11 });

  // Dynamically resolve mapped parameters strictly bypassing legacy crashing instances natively
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch User Identity Authenticity 
        const meRes = await fetch("/api/auth/me", {
          method: "GET",
          headers: token ? { "Authorization": `Bearer ${token}` } : {},
          credentials: "include"
        });
        
        if (meRes.ok) {
          const authData = await meRes.json();
          if (authData.user) {
            setProfile(prev => ({
               ...prev,
               fullName: authData.user.fullName || "",
               email: authData.user.email || "",
               mobile: authData.user.mobile || "",
               emailVerified: Boolean(authData.user.email),
               mobileVerified: Boolean(authData.user.mobile)
            }));
          }
        }

        // Fetch KYC Dependencies securely
        let kycDataResponse = await getKycData();
        if (!kycDataResponse) {
          const saved = localStorage.getItem("survivalLensKyc");
          if (saved) {
             try { kycDataResponse = JSON.parse(saved); } catch (e) {}
          }
        }
        
        if (kycDataResponse) {
           if (kycDataResponse.city && profile.address === "") {
              setProfile(prev => ({ ...prev, address: kycDataResponse.city }));
           }
           setCompletionProps(calculateKycCompletion(kycDataResponse, kycDataResponse.companies || []));
        }
      } catch (e) {
        // Fallback
        const saved = localStorage.getItem("survivalLensKyc");
        if (saved) {
           try {
             const data = JSON.parse(saved);
             setCompletionProps(calculateKycCompletion(data, data.companies || []));
           } catch (_err) {}
        }
      }
      setIsMounted(true);
    };
    
    loadProfileData();
  }, [profile.address]);

  if (!isMounted) return null;

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full relative min-h-full">
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className={`absolute top-[-5%] right-[-5%] w-[500px] h-[500px] ${completionProps.percentage === 100 ? "bg-emerald-400/5" : "bg-amber-400/5"} rounded-full blur-[140px] pointer-events-none z-0 transition-colors duration-1000`} />

      {/* ── CRITICAL KYC NOTIFICATION ── */}
      {completionProps.percentage < 100 ? (
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
      ) : (
        <div className="relative z-10 bg-emerald-50 border border-emerald-200/60 rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 shadow-[0_5px_30px_rgba(16,185,129,0.05)]">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-200/50">
                  <BadgeCheck size={24} strokeWidth={2.5} />
               </div>
               <div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight mb-0.5">
                   Identity Verified & Active
                 </h2>
                 <p className="text-[13px] text-emerald-800 font-medium leading-relaxed">
                   Your algorithmic parameters and legal documents are fully synced with the protocol.
                 </p>
               </div>
            </div>
            <button 
               onClick={() => router.push("/dashboard/profile/kyc")}
               className="text-[12px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-5 py-3 rounded-xl transition-colors border border-emerald-200/50"
            >
               View Identity Payload
            </button>
        </div>
      )}

      {/* ── MAIN PROFILE GRID ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* ── LEFT COLUMN: Identity & Contacts ── */}
        <div className="space-y-6 lg:space-y-8 flex flex-col">
          
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col items-center flex-1">
            <div className="relative mb-6 z-10">
              <div className={`w-32 h-32 ${completionProps.percentage === 100 ? "bg-emerald-950 border-emerald-50" : "bg-slate-900 border-white"} rounded-full border-4 shadow-xl overflow-hidden flex flex-col items-center justify-end relative transition-colors duration-500`}>
                <div className={`w-14 h-14 ${completionProps.percentage === 100 ? "bg-emerald-100" : "bg-amber-100"} rounded-t-full absolute bottom-4 z-10 transition-colors duration-500`}></div>
                <div className="w-20 h-10 bg-slate-800 rounded-t-[2.5rem] absolute bottom-0 z-20"></div>
                <div className={`w-20 h-8 ${completionProps.percentage === 100 ? "bg-emerald-950" : "bg-slate-900"} rounded-full absolute top-3 z-20 transition-colors duration-500`}></div>
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight z-10 text-center">
              {profile.fullName}
            </h2>
            <p className={`text-[11px] font-black ${completionProps.percentage === 100 ? "text-emerald-500" : "text-amber-500"} mb-8 uppercase tracking-[0.2em] transition-colors duration-500 z-10 text-center`}>
              {completionProps.percentage === 100 ? "Verified Operative" : "Unverified Driver"}
            </p>

            <div className="w-full space-y-4">
               {/* Mobile Input */}
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Mobile Contact</label>
                  <div className="flex items-center gap-2">
                     <span className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                        <Smartphone size={16} strokeWidth={2.5}/>
                     </span>
                     <input type="text" value={profile.mobile} readOnly className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold text-slate-800 outline-none" />
                  </div>
                  <div className="mt-2 text-right">
                     {profile.mobileVerified ? (
                        <span className="text-[10px] font-black text-emerald-500 flex items-center justify-end gap-1 uppercase tracking-widest"><BadgeCheck size={12}/> Verified</span>
                     ) : (
                        <button className="text-[10px] font-black text-blue-600 hover:text-blue-800 flex items-center justify-end gap-1 uppercase tracking-widest">Verify Number</button>
                     )}
                  </div>
               </div>
               
               {/* Email Input */}
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Email Intel</label>
                  <div className="flex items-center gap-2">
                     <span className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                        <Mail size={16} strokeWidth={2.5}/>
                     </span>
                     <input type="text" value={profile.email} readOnly className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold text-slate-800 outline-none" />
                  </div>
                  <div className="mt-2 text-right">
                     {profile.emailVerified ? (
                        <span className="text-[10px] font-black text-emerald-500 flex items-center justify-end gap-1 uppercase tracking-widest"><BadgeCheck size={12}/> Verified</span>
                     ) : (
                        <button className="text-[10px] font-black text-blue-600 hover:text-blue-800 flex items-center justify-end gap-1 uppercase tracking-widest w-full text-right underline decoration-blue-600/30 underline-offset-4">Verify Email to secure account</button>
                     )}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Configuration ── */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8 flex flex-col">
          
          {/* KYC Tracking Widget - ONLY SHOWN IF < 100%, otherwise hidden because banner takes over! */}
          {completionProps.percentage < 100 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-amber-100 relative overflow-hidden shrink-0">
               <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-amber-50/50 to-transparent pointer-events-none" />
               <div className="flex items-center gap-3 mb-6 relative z-10">
                 <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                    <Fingerprint size={20} strokeWidth={2.5} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Regulatory Authentication</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">KYC Protocol Sequence</p>
                 </div>
               </div>

               <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm relative z-10">
                  <div className="flex justify-between items-end mb-4">
                     <h3 className="text-md font-black text-slate-900 tracking-tight">Completion Progress</h3>
                     <span className="text-[14px] font-black text-amber-600 tracking-tight">{completionProps.filledFields} out of {completionProps.totalFields} verified</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-6 shadow-inner">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${completionProps.percentage}%` }} className="bg-amber-500 h-full rounded-full transition-all duration-700 ease-out" />
                  </div>
                  <button onClick={() => router.push("/dashboard/profile/kyc")} className="w-full py-4 rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50 text-slate-600 hover:text-amber-700 transition-colors font-black tracking-tight text-[14px]">
                     Continue KYC Protocol
                  </button>
               </div>
            </div>
          )}

          {/* Delivery Partners & Setup */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex-1 min-h-[500px]">
             
             {/* Section 2: Address */}
             <div className="mb-10 pt-8 border-t border-slate-100">
               <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <MapPin size={16} className="text-slate-400" /> Complete Registration Address
               </label>
               <textarea 
                 rows={3} 
                 value={profile.address} 
                 onChange={e => setProfile({...profile, address: e.target.value})}
                 placeholder="Enter full physical address for legal verification..." 
                 className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-medium text-slate-800 placeholder-slate-400 transition-all outline-none resize-none" 
               />
             </div>

             {/* Section 3: Auth Security */}
             <div className="pt-8 border-t border-slate-100">
               <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Lock size={16} className="text-slate-400" /> Local Protocol Security
               </label>
               <div className="bg-slate-900 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-white text-md font-black tracking-tight mb-1">Account Password</h4>
                    <p className="text-slate-400 text-[12px] font-medium">Last changed 45 days ago. Update regularly to prevent illicit tracking.</p>
                  </div>
                  <button className="w-full md:w-auto bg-white hover:bg-slate-100 text-slate-900 font-black tracking-tight px-6 py-3 rounded-xl transition-all shadow-md text-[13px] flex shrink-0 items-center justify-center gap-2">
                    <ShieldHalf size={16}/> Modify Password
                  </button>
               </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
}
