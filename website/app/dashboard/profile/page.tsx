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
  ShieldHalf,
  Briefcase,
  Store,
  ShoppingCart,
  Car
} from "lucide-react";
import { getKycData, calculateKycCompletion } from "../../../(services)/kyc";
import { getMe } from "../../../(services)/auth";

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

  // ── PARTNERS STATE ──
  const [selectedCategory, setSelectedCategory] = useState("Food Delivery");
  const [selectedPartners, setSelectedPartners] = useState<string[]>(["Swiggy", "Uber"]);
  
  const PARTNER_CATEGORIES = [
    { id: "Food Delivery", icon: Store, partners: ["Swiggy", "Zomato", "Eats"] },
    { id: "Quick Commerce", icon: ShoppingCart, partners: ["Blinkit", "Zepto", "Instamart"] },
    { id: "Mobility", icon: Car, partners: ["Uber", "Ola", "Rapido"] },
    { id: "E-Commerce", icon: Briefcase, partners: ["Amazon", "Flipkart", "Myntra"] }
  ];

  const handlePartnerToggle = (partner: string) => {
    if (selectedPartners.includes(partner)) {
       if (selectedPartners.length > 1) {
          setSelectedPartners(prev => prev.filter(p => p !== partner));
       }
    } else {
       if (selectedPartners.length < 4) {
          setSelectedPartners(prev => [...prev, partner]);
       }
    }
  };

  // Dynamically resolve mapped parameters strictly bypassing legacy crashing instances natively
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch User Identity Authenticity 
        try {
          const authData = await getMe();
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
        } catch (authErr) {
          console.error("Failed to load user profile:", authErr);
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
      <div 
         className={`absolute top-[-5%] right-[-5%] ${completionProps.percentage === 100 ? "bg-emerald-400/5" : "bg-amber-400/5"} rounded-full blur-[140px] pointer-events-none z-0 transition-colors duration-1000`} 
         style={{ width: "clamp(24rem, 45vw, 37.5rem)", height: "clamp(24rem, 45vw, 37.5rem)" }}
      />

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

        {/* ── MIDDLE COLUMN: Platform Affiliations ── */}
        <div className="flex flex-col">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex-1 flex flex-col">
             
             {/* Section 1: Delivery Partners */}
             <div className="mb-10 flex-1">
               <div className="flex justify-between items-end mb-6">
                 <div>
                   <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1 flex items-center gap-2">
                     <Briefcase size={16} className="text-slate-400" /> Platform Affiliations
                   </label>
                   <p className="text-[12px] text-slate-500 font-medium">Select your primary sectors and link up to 4 gig platforms.</p>
                 </div>
                 <div className="text-[11px] font-black tracking-widest uppercase bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-inner">
                    {selectedPartners.length} / 4 Linked
                 </div>
               </div>

               <div className="bg-slate-50 rounded-2xl p-2 border border-slate-100 flex overflow-x-auto no-scrollbar mb-6">
                 {PARTNER_CATEGORIES.map(cat => {
                   const isActive = selectedCategory === cat.id;
                   return (
                     <button 
                       key={cat.id} 
                       onClick={() => setSelectedCategory(cat.id)}
                       className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[12px] font-black tracking-tight whitespace-nowrap transition-all ${isActive ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                       <cat.icon size={14} className={isActive ? 'text-blue-500' : 'text-slate-400'} />
                       {cat.id}
                     </button>
                   )
                 })}
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-4 min-h-[140px]">
                 <AnimatePresence mode="popLayout">
                    {PARTNER_CATEGORIES.find(c => c.id === selectedCategory)?.partners.map(partner => {
                      const isSelected = selectedPartners.includes(partner);
                      return (
                         <motion.button
                            key={partner}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", bounce: 0.2 }}
                            onClick={() => handlePartnerToggle(partner)}
                            className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${isSelected ? 'border-blue-500 bg-blue-50/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                         >
                            <div className={`w-6 h-6 rounded-md border ${isSelected ? 'bg-blue-500 border-blue-600 shadow-sm flex items-center justify-center' : 'bg-white border-slate-200 mb-0'} text-white transition-colors mb-3`}>
                               {isSelected && <BadgeCheck size={14} strokeWidth={3} className="text-white fill-blue-500" />}
                            </div>
                            <span className={`text-[14px] font-black tracking-tight ${isSelected ? 'text-blue-900' : 'text-slate-600'}`}>{partner}</span>
                         </motion.button>
                      )
                    })}
                 </AnimatePresence>
               </div>
             </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Configuration ── */}
        <div className="flex flex-col">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex-1 flex flex-col">
             
             {/* Section 2: Address */}
             <div className="mb-10">
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
