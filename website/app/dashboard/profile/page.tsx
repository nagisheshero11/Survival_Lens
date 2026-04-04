"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
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
import { withCacheBust } from "@/lib/avatar";
import { getScopedLocalStorageItem } from "@/lib/clientStorage";

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
    address: "",
    avatarUrl: ""
  });

  // ── KYC API FETCH ──
  const [completionProps, setCompletionProps] = useState({ percentage: 0, filledFields: 0, totalFields: 11 });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const token = localStorage.getItem("token");

        const savedAvatar = getScopedLocalStorageItem("survivalLensAvatar");
        if (savedAvatar) {
          setProfile((prev) => ({ ...prev, avatarUrl: savedAvatar }));
        }
        
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

            if (authData.user.kyc?.photo?.trim()) {
              setProfile((prev) => ({
                ...prev,
                avatarUrl: withCacheBust(authData.user.kyc.photo, authData.user.kyc.updatedAt),
              }));
            }
          }
        }

        // Fetch KYC Dependencies securely
        let kycDataResponse = await getKycData();
        if (!kycDataResponse) {
          const saved = getScopedLocalStorageItem("survivalLensKyc");
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
        const saved = getScopedLocalStorageItem("survivalLensKyc");
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
    <div className="p-8 lg:p-12 max-w-4xl mx-auto w-full relative min-h-full">
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div 
         className={`absolute top-[-5%] right-[-10%] ${completionProps.percentage === 100 ? "bg-emerald-400/5" : "bg-amber-400/5"} rounded-full blur-[140px] pointer-events-none z-0 transition-colors duration-1000`} 
         style={{ width: "clamp(24rem, 45vw, 37.5rem)", height: "clamp(24rem, 45vw, 37.5rem)" }}
      />

      {/* ── HEADER ── */}
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2 mt-4">
            Profile Settings
        </h1>
        <p className="text-[13px] text-slate-500 font-medium tracking-tight">
            Manage your personal intelligence and delivery network configurations.
        </p>
      </div>

      {/* ── CRITICAL KYC NOTIFICATION ── */}
      {completionProps.percentage < 100 ? (
        <div className="relative z-10 bg-amber-50/80 border border-amber-200/60 rounded-[2rem] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0 border border-amber-200/50">
               <ShieldAlert size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-1 inline-block">
                Action Required
              </span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">
                Authentication Pending ({completionProps.percentage}%)
              </h2>
              <p className="text-[13px] text-amber-800 font-medium leading-relaxed max-w-xl">
                Compliance regulations require identity verification before we can activate your 
                algorithmic buffers. Your account payouts are currently <strong>frozen</strong>.
              </p>
            </div>
          </div>
          <button 
            onClick={() => router.push("/dashboard/profile/kyc")}
            className="w-full md:w-auto bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-xl shadow-md hover:-translate-y-0.5 transition-all text-[13px] flex items-center justify-center gap-2 group shrink-0"
          >
            <Fingerprint size={16} />
            {completionProps.percentage > 0 ? "Resume Protocol" : "Start Protocol"}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="relative z-10 bg-emerald-50/80 border border-emerald-200/60 rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shadow-sm">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-200/50">
                  <BadgeCheck size={20} strokeWidth={2.5} />
               </div>
               <div>
                 <h2 className="text-lg font-black text-slate-900 tracking-tight mb-0.5">
                   Identity Verified & Active
                 </h2>
                 <p className="text-[12px] text-emerald-800 font-medium leading-relaxed">
                   Your algorithmic parameters and legal documents are fully synced with the protocol.
                 </p>
               </div>
            </div>
            <button 
              onClick={() => router.push("/dashboard/profile/kyc?source=profile")}
               className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-5 py-2.5 rounded-lg transition-colors border border-emerald-200/50"
            >
              Manage KYC
            </button>
        </div>
      )}

      {/* ── VERTICAL SETTINGS STACK ── */}
      <div className="relative z-10 flex flex-col space-y-6 mb-12">
        
        {/* Identity Block */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col md:flex-row gap-8 items-start md:items-center hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-shadow duration-500">
            <div className={`w-28 h-28 shrink-0 ${completionProps.percentage === 100 ? "bg-emerald-950 border-emerald-50" : "bg-slate-900 border-white"} rounded-full border-4 shadow-lg overflow-hidden flex flex-col items-center justify-center relative transition-colors duration-500 bg-emerald-50`}>
              {profile.avatarUrl ? (
                 <img src={profile.avatarUrl} alt="User avatar" className="w-full h-full object-cover z-30 relative" />
              ) : (
                 <>
                   <div className={`w-12 h-12 ${completionProps.percentage === 100 ? "bg-emerald-100" : "bg-amber-100"} rounded-t-full absolute bottom-3 z-10 transition-colors duration-500`}></div>
                   <div className="w-[4.5rem] h-8 bg-slate-800 rounded-t-[2rem] absolute bottom-0 z-20"></div>
                   <div className={`w-[4.5rem] h-6 ${completionProps.percentage === 100 ? "bg-emerald-950" : "bg-slate-900"} rounded-full absolute top-[14px] z-20 transition-colors duration-500`}></div>
                 </>
              )}
            </div>

            <div className="flex-1 space-y-5 w-full">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 mb-0.5 tracking-tight">{profile.fullName || "Driver"}</h2>
                   <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${completionProps.percentage === 100 ? "text-emerald-500" : "text-amber-500"}`}>
                     {completionProps.percentage === 100 ? "Verified Operative" : "Unverified Status"}
                   </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {/* Mobile */}
                   <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center group hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                           <Smartphone size={14} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Mobile</p>
                            <p className="text-sm font-bold text-slate-900 tracking-tight">{profile.mobile || "Not Linked"}</p>
                         </div>
                      </div>
                      {profile.mobileVerified ? (
                        <BadgeCheck size={16} className="text-emerald-500 fill-emerald-50 shrink-0" />
                      ) : (
                        <button className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors shrink-0">Verify</button>
                      )}
                   </div>

                   {/* Email */}
                   <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center group hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-3 w-full pr-2 overflow-hidden">
                         <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                           <Mail size={14} />
                         </div>
                         <div className="min-w-0 pr-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Email</p>
                            <p className="text-sm font-bold text-slate-900 tracking-tight truncate max-w-[120px]">{profile.email || "Not Linked"}</p>
                         </div>
                      </div>
                      {profile.emailVerified ? (
                        <BadgeCheck size={16} className="text-emerald-500 fill-emerald-50 shrink-0" />
                      ) : (
                        <button className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors shrink-0">Verify</button>
                      )}
                   </div>
                </div>
            </div>
        </div>

        {/* Registration Address */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-shadow duration-500">
           <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2 mb-1">
             <MapPin size={18} className="text-slate-400" /> Physical Registration
           </h3>
           <p className="text-[13px] text-slate-500 font-medium mb-6 tracking-tight">Enter your full physical address for legal verification and jurisdictional tracking.</p>
           
           <div className="relative">
             <textarea 
               rows={3} 
               value={profile.address} 
               onChange={e => setProfile({...profile, address: e.target.value})}
               placeholder="Enter full physical address..." 
               className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-medium text-slate-800 placeholder-slate-400 transition-all outline-none resize-none shadow-inner" 
             />
           </div>
        </div>

        {/* Security Box */}
        <div className="bg-slate-900 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(15,23,42,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
           <div className="relative z-10 flex items-start flex-col sm:flex-row gap-4">
             <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Lock size={20} strokeWidth={2.5} />
             </div>
             <div>
               <h4 className="text-white text-lg font-black tracking-tight mb-1">Local Protocol Security</h4>
               <p className="text-slate-400 text-[13px] font-medium max-w-sm leading-relaxed">Your account password was last changed 45 days ago. Update regularly to prevent tracking.</p>
             </div>
           </div>
           <button className="w-full md:w-auto bg-white hover:bg-slate-100 text-slate-900 font-black tracking-tight px-6 py-3.5 rounded-xl transition-all shadow-md text-[13px] flex shrink-0 items-center justify-center gap-2 relative z-10 hover:-translate-y-0.5 hover:shadow-lg">
             <ShieldHalf size={16}/> Modify Access Key
           </button>
        </div>

      </div>
    </div>
  );
}
