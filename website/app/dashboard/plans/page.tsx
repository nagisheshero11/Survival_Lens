"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, XCircle, Info, Star, Cloud, Network, 
  Clock, ArrowRight, ShieldCheck, Zap, Activity, Calculator,
  MapPin, Coins
} from "lucide-react";

export default function PlansPage() {
  const [step, setStep] = useState<"calculator" | "plans">("calculator");
  const [isMounted, setIsMounted] = useState(false);
  
  // User Variables
  const [income, setIncome] = useState<number>(8000);
  const [location, setLocation] = useState<string>("Urban");
  const [kycLoaded, setKycLoaded] = useState<boolean>(false);

  // Read from KYC LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("survivalLensKyc");
    if (saved) {
      const kycData = JSON.parse(saved);
      let foundData = false;

      if (kycData.avgWeeklyIncome && !isNaN(parseInt(kycData.avgWeeklyIncome))) {
        setIncome(parseInt(kycData.avgWeeklyIncome));
        foundData = true;
      }
      if (kycData.location) {
        setLocation(kycData.location);
        foundData = true;
      }
      
      // If we found valid KYC parameters, automatically jump to the suggested plans
      if (foundData && kycData.status === "pending") {
        setStep("plans");
        setKycLoaded(true);
      } else if (foundData) {
        setKycLoaded(true);
      }
    }
    setIsMounted(true);
  }, []);
  
  // Calculate dynamic weekly pricing
  const calculatePricing = () => {
     let multiplier = 1.0;
     if (location === "Metropolitan") multiplier = 1.4;
     if (location === "Urban") multiplier = 1.1;
     if (location === "Semi-Urban") multiplier = 0.85;
     if (location === "Rural") multiplier = 0.6;

     // Lite: 1.5% of income * location factor
     const litePremium = Math.round(income * 0.015 * multiplier);
     const liteCoverage = Math.round(income * 0.5); // Covers 50%

     // Pro: 3.5% of income * location factor
     const proPremium = Math.round(income * 0.035 * multiplier);
     const proCoverage = Math.round(income * 1.0); // Covers 100%

     // Max: 6% of income * location factor
     const maxPremium = Math.round(income * 0.06 * multiplier);
     const maxCoverage = Math.round(income * 1.5); // Covers 150%

     return { 
       lite: { premium: litePremium, coverage: liteCoverage },
       pro: { premium: proPremium, coverage: proCoverage },
       max: { premium: maxPremium, coverage: maxCoverage }
     };
  };

  const pricing = calculatePricing();

  if (!isMounted) return null;

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full relative min-h-full">
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ── DYNAMIC PAGE HEADER ── */}
      <div className="relative z-10 max-w-2xl mb-12">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100/50 flex items-center gap-1.5">
            <Calculator size={12} strokeWidth={3} />
            Dynamic Quoting Engine
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
           {step === "calculator" ? "Calibrate Your Coverage" : "Your Weekly Buffers"}
        </h1>
        <p className="text-[15px] text-slate-500 font-medium leading-relaxed max-w-xl">
           {step === "calculator" 
            ? kycLoaded 
              ? "Your algorithmic parameters have been synced from your KYC Payload. You may recalibrate them below or generate your plans." 
              : "Configure your base operating metrics to calculate the exact algorithmic premium required to protect your weekly earnings." 
            : `Based on an authenticated footprint in a ${location} zone with ₹${income.toLocaleString()}/wk income, the protocol recommends these 3 active buffers.`}
        </p>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ── STEP 1: CALCULATOR FORM ── */}
        {step === "calculator" && (
          <motion.div 
            key="calculator"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-12 max-w-3xl border border-white shadow-[0_20px_60px_rgba(0,0,0,0.04)] mx-auto mb-16"
          >
            {/* Income Slider */}
            <div className="mb-10">
               <div className="flex justify-between items-end mb-4">
                  <div className="flex items-center gap-2">
                     <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50">
                        <Coins size={20} strokeWidth={2.5} />
                     </div>
                     <div>
                        <h3 className="text-[15px] font-black tracking-tight text-slate-900">Average Weekly Income</h3>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Baseline Target</p>
                     </div>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">₹{income.toLocaleString()}</h2>
               </div>
               
               <div className="relative pt-2 pb-6">
                  <input 
                     type="range" 
                     min="1000" 
                     max="30000" 
                     step="500"
                     value={income}
                     onChange={(e) => setIncome(Number(e.target.value))}
                     className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 outline-none"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                     <span>₹1,000</span>
                     <span>₹30,000+</span>
                  </div>
               </div>
            </div>

            {/* Location Selector */}
            <div className="mb-12">
               <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50">
                     <MapPin size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                     <h3 className="text-[15px] font-black tracking-tight text-slate-900">Geopolitical Zone</h3>
                     <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Risk Environment</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {["Metropolitan", "Urban", "Semi-Urban", "Rural"].map(loc => (
                     <button 
                        key={loc}
                        onClick={() => setLocation(loc)}
                        className={`py-4 px-2 rounded-2xl border-2 text-[13px] font-black tracking-tight transition-all duration-200 outline-none ${
                           location === loc 
                           ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm" 
                           : "border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900"
                        }`}
                     >
                        {loc}
                     </button>
                  ))}
               </div>
            </div>

            <button 
               onClick={() => setStep("plans")}
               className="w-full bg-slate-900 hover:bg-black text-white font-black tracking-tight py-4 rounded-2xl shadow-xl shadow-slate-900/10 hover:-translate-y-0.5 transition-all text-[15px] flex justify-center items-center gap-2 group"
            >
               Generate Weekly Plans
               <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </button>
          </motion.div>
        )}

        {/* ── STEP 2: GENERATED PLANS ── */}
        {step === "plans" && (
          <motion.div 
            key="plans"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16"
          >
            
            {/* LITE TIER */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white h-full relative group">
              <div className="mb-6">
                <span className="bg-slate-50 border border-slate-100/60 text-slate-500 text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg inline-block mb-4 shadow-sm">
                  Lite Buffer
                </span>
                <div className="flex flex-col gap-1 mb-2">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">₹{pricing.lite.premium}</h2>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">/ per week</span>
                </div>
                <p className="text-xs text-slate-500 font-bold leading-relaxed mb-6 h-10 mt-3">
                  Fundamental buffering covering exactly 50% of your ₹{income.toLocaleString()} target.
                </p>
              </div>
              
              <div className="flex-1">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                    <span className="text-[13px] font-black tracking-tight text-slate-700">₹{pricing.lite.coverage.toLocaleString()} Guaranteed Floor</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                    <span className="text-[13px] font-black tracking-tight text-slate-700">Rain & Snow Auto-Buffer</span>
                  </li>
                  <li className="flex items-start gap-3 opacity-40">
                    <XCircle size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
                    <span className="text-[13px] font-bold tracking-tight text-slate-500">Gridlock & Traffic Overrides</span>
                  </li>
                  <li className="flex items-start gap-3 opacity-40">
                    <XCircle size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
                    <span className="text-[13px] font-bold tracking-tight text-slate-500">Unjust deactivation legal fund</span>
                  </li>
                </ul>
              </div>
              
              <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 font-black tracking-tight py-4 rounded-2xl transition-all shadow-sm flex justify-center items-center gap-2">
                Pay ₹{pricing.lite.premium} / wk
              </button>
            </motion.div>

            {/* PRO TIER (RECOMMENDED) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900 rounded-[2.5rem] p-8 lg:p-10 flex flex-col relative shadow-[0_20px_50px_rgba(15,23,42,0.15)] h-full z-10 transform lg:-translate-y-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-transparent opacity-50 pointer-events-none" />
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[9px] uppercase font-black tracking-[0.2em] px-5 py-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] whitespace-nowrap z-20">
                AI Recommended
              </div>

              <div className="mb-6 pt-4 relative z-10">
                <span className="bg-blue-500/10 border border-blue-400/20 text-blue-400 text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg inline-block mb-4">
                  Geospatial Pro
                </span>
                <div className="flex flex-col gap-1 mb-2">
                  <h2 className="text-5xl font-black text-white tracking-tight">₹{pricing.pro.premium}</h2>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">/ per week</span>
                </div>
                <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6 h-10 mt-3">
                  Secures 100% of your ₹{income.toLocaleString()} target against any environment faults.
                </p>
              </div>
              
              <div className="flex-1 relative z-10">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5 fill-blue-50" strokeWidth={3} />
                    <span className="text-[14px] font-black tracking-tight text-white">₹{pricing.pro.coverage.toLocaleString()} Guaranteed Floor</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5 fill-blue-50" strokeWidth={3} />
                    <span className="text-[14px] font-black tracking-tight text-white">Gridlock & ETA Failure overrides</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5 fill-blue-50" strokeWidth={3} />
                    <span className="text-[14px] font-black tracking-tight text-white">Full Environmental Array</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5 fill-blue-50" strokeWidth={3} />
                    <span className="text-[14px] font-black tracking-tight text-white">100% DAO Voting Power</span>
                  </li>
                </ul>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black tracking-tight py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-colors text-[14px] relative z-10 border border-blue-500 flex justify-center items-center gap-2 group">
                Pay ₹{pricing.pro.premium} / wk
                <ArrowRight size={16} className="translate-x-0 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
              </button>
            </motion.div>

            {/* FLEET TIER */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white h-full relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Star size={100} strokeWidth={1} />
              </div>

              <div className="mb-6 relative z-10">
                <span className="bg-amber-50 border border-amber-100/50 text-amber-600 text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg inline-block mb-4 shadow-sm">
                  Max Authority
                </span>
                <div className="flex flex-col gap-1 mb-2">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tight">₹{pricing.max.premium}</h2>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">/ per week</span>
                </div>
                <p className="text-xs text-slate-500 font-bold leading-relaxed mb-6 h-10 mt-3">
                  Unrestricted legal and algorithmic shielding targeting 150% security.
                </p>
              </div>
              
              <div className="flex-1 relative z-10">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Star size={16} className="text-amber-500 shrink-0 mt-0.5 fill-amber-500" strokeWidth={2.5} />
                    <span className="text-[13px] font-black tracking-tight text-slate-800">₹{pricing.max.coverage.toLocaleString()} Max Guaranteed Cap</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star size={16} className="text-amber-500 shrink-0 mt-0.5 fill-amber-500" strokeWidth={2.5} />
                    <span className="text-[13px] font-black tracking-tight text-slate-800">Arbitrary Deactivation Legal Fund</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star size={16} className="text-amber-500 shrink-0 mt-0.5 fill-amber-500" strokeWidth={2.5} />
                    <span className="text-[13px] font-black tracking-tight text-slate-800">Priority human mediation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star size={16} className="text-amber-500 shrink-0 mt-0.5 fill-amber-500" strokeWidth={2.5} />
                    <span className="text-[13px] font-black tracking-tight text-slate-800">Direct DAO Treasury access</span>
                  </li>
                </ul>
              </div>
              
              <button className="w-full mt-auto bg-slate-900 hover:bg-black text-white font-black tracking-tight py-4 rounded-2xl shadow-lg shadow-slate-900/10 transition-all relative z-10 text-[14px] flex justify-center items-center gap-2">
                Pay ₹{pricing.max.premium} / wk
              </button>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RETURN BUTTON ── */}
      <AnimatePresence>
         {step === "plans" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center mb-16 relative z-10">
               <button onClick={() => setStep("calculator")} className="text-[13px] font-black tracking-tight text-slate-400 hover:text-slate-900 transition-colors uppercase">
                  ← Recalibrate Metrics
               </button>
            </motion.div>
         )}
      </AnimatePresence>


      {/* ── ALGORITHMIC GUARANTEE ── */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-12 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.02)] relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
             <Activity size={18} className="text-emerald-500" strokeWidth={3} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
               Decentralized Vault
             </span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-4">
            The Geospatial Reliability Guarantee
          </h2>
          <p className="text-[14px] text-slate-500 font-medium leading-relaxed mb-8 max-w-lg">
            We don't trust platforms; we trust math. Every subscription tier is backed by our proprietary smart-contracts, distributing risk automatically the moment your route goes red.
          </p>
          
          <div className="flex gap-10">
            <div>
              <p className="text-3xl font-black tracking-tight text-slate-900 mb-0.5">99.9%</p>
              <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest">
                Sensor Uptime
              </p>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight text-slate-900 mb-0.5">₹40M+</p>
              <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest">
                Community Locked Buffer
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          {/* Feature Grid */}
          <div className="bg-slate-50/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100/60 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
               <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] uppercase font-black tracking-[0.15em] text-slate-900">
              AES-256 Vault
            </span>
          </div>
          
          <div className="bg-slate-50/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100/60 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
               <Cloud size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] uppercase font-black tracking-[0.15em] text-slate-900">
              Live Radars
            </span>
          </div>
          
          <div className="bg-slate-50/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100/60 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
               <Network size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] uppercase font-black tracking-[0.15em] text-slate-900">
              Peer Validated
            </span>
          </div>
          
          <div className="bg-slate-50/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100/60 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
               <Zap size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] uppercase font-black tracking-[0.15em] text-slate-900">
              Instant Payout
            </span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
