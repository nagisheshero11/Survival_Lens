"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  Fingerprint
} from "lucide-react";

export default function KycProcessPage() {
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

  const handleSaveKyc = (e: React.FormEvent) => {
    e.preventDefault();
    const newStatus = completionProps.percentage === 100 ? "pending" : "partial";
    const dataToSave = { ...kycData, status: newStatus };
    
    // Save to local storage explicitly to share state across pages
    localStorage.setItem("survivalLensKyc", JSON.stringify(dataToSave));
    
    // Navigate back to profile
    router.push("/dashboard/profile");
  };

  const handleChange = (field: string, value: string) => {
    setKycData(prev => ({ ...prev, [field]: value }));
  };

  const handleMockUpload = (field: "photo" | "dashboardScreenshot") => {
    setKycData(prev => ({ ...prev, [field]: "uploaded_file.png" }));
  };

  if (!isMounted) return null;

  // Lockdown guard: if it's already verified, they shouldn't be here
  if (kycData.status === "approved" || kycData.status === "pending") {
    return (
       <div className="flex flex-col items-center justify-center p-20 min-h-full">
         <h2 className="text-2xl font-black text-slate-900 mb-4">KYC Already Submitted</h2>
         <p className="text-slate-500 mb-6 font-medium text-center">Your payload is currently under review by our agents.</p>
         <button onClick={() => router.push("/dashboard/profile")} className="text-white hover:bg-blue-700 bg-blue-600 px-6 py-3 rounded-xl font-bold transition-all shadow-md">Return to Profile Dashboard</button>
       </div>
    );
  }


  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto w-full relative min-h-full">
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ── NAVIGATION ── */}
      <button 
        onClick={() => router.push("/dashboard/profile")}
        className="relative z-10 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 hover:text-slate-900 transition-colors mb-12 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Return to Profile
      </button>

      {/* ── HEADER ── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
         <div className="max-w-xl">
           <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100 mb-6">
              <Fingerprint size={24} strokeWidth={2.5} />
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">
             Identity Authentication
           </h1>
           <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
             Complete your algorithmic profile. Strict global KYC regulations require these data points to activate your decentralized buffer payouts.
           </p>
         </div>
         
         {/* Live Progress Tracker */}
         <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[1.5rem] shadow-sm border border-slate-100 shrink-0 w-full md:w-64">
             <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Completion</span>
                <span className="text-[13px] font-black tracking-tight text-blue-600">{completionProps.percentage}%</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${completionProps.percentage}%` }} 
                   className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                />
             </div>
             <span className="text-[11px] font-bold text-slate-500">{completionProps.filledFields} out of {completionProps.totalFields} parameters</span>
         </div>
      </div>

      {/* ── THE EXACT FORM FROM YOUR SPECS ── */}
      <motion.form 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-white"
        onSubmit={handleSaveKyc}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          
          {/* Aadhaar */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Aadhaar ID</label>
            <input type="text" value={kycData.aadhaar} onChange={e => handleChange('aadhaar', e.target.value)} placeholder="0000 0000 0000 0000" className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none" />
          </div>
          
          {/* PAN */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">PAN Number</label>
            <input type="text" value={kycData.pan} onChange={e => handleChange('pan', e.target.value)} placeholder="ABCDE1234F" className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none uppercase" />
          </div>

          {/* Age & Location */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Age</label>
            <input type="number" value={kycData.age} onChange={e => handleChange('age', e.target.value)} placeholder="e.g. 28" className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Geopolitical Location</label>
            <select value={kycData.location} onChange={e => handleChange('location', e.target.value)} className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-black text-slate-900 transition-all outline-none appearance-none">
              <option value="">Select Zone...</option>
              <option value="Metropolitan">Metropolitan</option>
              <option value="Urban">Urban</option>
              <option value="Semi-Urban">Semi-Urban</option>
              <option value="Rural">Rural</option>
            </select>
          </div>

          {/* Company & Partner ID */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Gig Platform / Company</label>
            <input type="text" value={kycData.company} onChange={e => handleChange('company', e.target.value)} placeholder="e.g. Uber, Swiggy" className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Partner / Driver ID</label>
            <input type="text" value={kycData.partnerId} onChange={e => handleChange('partnerId', e.target.value)} placeholder="e.g. DRIVER-9921" className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none" />
          </div>

          {/* Avg Metrics */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Avg Weekly Income (₹)</label>
            <input type="number" value={kycData.avgWeeklyIncome} onChange={e => handleChange('avgWeeklyIncome', e.target.value)} placeholder="e.g. 12000" className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Avg Weekly Hours</label>
            <input type="number" value={kycData.avgWorkingHours} onChange={e => handleChange('avgWorkingHours', e.target.value)} placeholder="e.g. 45" className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none" />
          </div>

          {/* Upload Fields */}
          <div className="md:col-span-1 border-t border-slate-100 pt-8 mt-4">
             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Live Photo Evidence</label>
             <button type="button" onClick={() => handleMockUpload('photo')} className={`w-full flex items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed transition-all font-black tracking-tight ${kycData.photo ? "border-emerald-500 bg-emerald-50/50 text-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-slate-300 bg-slate-50/50 text-slate-400 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"}`}>
               {kycData.photo ? <><CheckCircle2 size={18} /> Photographic ID Secured</> : <><UploadCloud size={18} /> Upload Authentic Photo</>}
             </button>
          </div>
          <div className="md:col-span-1 border-t border-slate-100 pt-8 mt-4">
             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Dashboard Screenshot</label>
             <button type="button" onClick={() => handleMockUpload('dashboardScreenshot')} className={`w-full flex items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed transition-all font-black tracking-tight ${kycData.dashboardScreenshot ? "border-emerald-500 bg-emerald-50/50 text-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-slate-300 bg-slate-50/50 text-slate-400 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"}`}>
               {kycData.dashboardScreenshot ? <><CheckCircle2 size={18} /> Earnings Screenshot Secured</> : <><UploadCloud size={18} /> Upload Gig History Proof</>}
             </button>
          </div>

        </div>

        {/* ── ACTION FOOTER ── */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-[11px] font-bold text-slate-400 max-w-sm leading-relaxed">
             All payloads are symmetrically encrypted (AES-256) entirely offline before transmission to the network.
           </p>
           
           <button type="submit" className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-10 font-black py-4 rounded-2xl shadow-xl shadow-slate-900/10 hover:-translate-y-0.5 transition-all text-sm group flex items-center justify-center gap-2">
            {completionProps.percentage === 100 ? "Submit KYC Payload to Auditors" : "Save Partial Validation Sequence"}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.form>
    </div>
  );
}
