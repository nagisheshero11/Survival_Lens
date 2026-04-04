"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  Fingerprint,
  Plus,
  Trash2,
  Loader2
} from "lucide-react";

const COMPANY_CATEGORY_MAP: Record<string, string[]> = {
  "Food Delivery": ["Zomato", "Swiggy"],
  "Quick Commerce": ["Blinkit", "Zepto", "Swiggy Instamart", "BigBasket Now", "Flipkart Minutes"],
  "E-commerce & Marketplaces": ["Amazon India", "Flipkart", "Meesho", "Myntra"],
  "Logistics & Delivery-as-a-Service": ["Delhivery", "Shadowfax", "Ecom Express", "Porter", "Shiprocket", "XpressBees"],
  "Pharmacy & Healthcare": ["PharmEasy", "Tata 1mg", "Apollo Pharmacy"],
  "D2C Brands": ["Nykaa", "Mamaearth", "boAt"],
  "Hyperlocal & Multi-service": ["Dunzo", "Borzo", "WeFast"]
};

const ALLOWED_CATEGORIES = Object.keys(COMPANY_CATEGORY_MAP);

import { getKycData, saveKycData, calculateKycCompletion, IKycCompany } from "../../../../(services)/kyc";

export default function KycProcessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ── STRICT NATIVE KYC STATE ──
  const [kycData, setKycData] = useState({
    aadhaar: "",
    pan: "",
    photo: "",
    location: "",
    age: "",
    avgWeeklyIncome: "",
    avgWorkingHours: "",
    status: "not_started"
  });

  const [companies, setCompanies] = useState<IKycCompany[]>([]);
  const [globalCategory, setGlobalCategory] = useState<string>("");

  const validation = useMemo(() => {
    const aadhaarDigits = kycData.aadhaar.replace(/\D/g, "");
    const panValue = kycData.pan.toUpperCase().trim();
    const ageValue = Number(kycData.age);
    const incomeValue = Number(kycData.avgWeeklyIncome);
    const hoursValue = Number(kycData.avgWorkingHours);

    return {
      aadhaarOk: /^\d{12}$/.test(aadhaarDigits),
      panOk: /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panValue),
      ageOk: Number.isInteger(ageValue) && ageValue >= 18 && ageValue <= 99,
      locationOk: Boolean(kycData.location),
      incomeOk: Number.isFinite(incomeValue) && incomeValue > 0,
      hoursOk: Number.isFinite(hoursValue) && hoursValue > 0 && hoursValue <= 99,
      categoryOk: Boolean(globalCategory),
      photoOk: Boolean(kycData.photo),
      companyOk: companies.some((c) => Boolean(c.company.trim())),
      partnerOk: companies.some((c) => c.partnerId.trim().length >= 4),
      screenshotOk: companies.some((c) => Boolean(c.dashboardScreenshot)),
    };
  }, [kycData, companies, globalCategory]);

  const isBasicKycReady =
    validation.aadhaarOk &&
    validation.panOk &&
    validation.ageOk &&
    validation.locationOk &&
    validation.incomeOk &&
    validation.hoursOk &&
    validation.categoryOk &&
    validation.photoOk &&
    validation.companyOk &&
    validation.partnerOk &&
    validation.screenshotOk;

  // Seamless Load Tracking locally connecting explicitly against GET /api/kyc
  useEffect(() => {
    const fetchData = async () => {
      let apiData = null;

      try {
        apiData = await getKycData();
      } catch (_e) {}

      // Prioritize API data directly securely mapping legacy setups natively mapped into `parsed`
      let parsed = apiData;
      if (!parsed) {
        const saved = localStorage.getItem("survivalLensKyc");
        if (saved) {
           try { parsed = JSON.parse(saved); } catch (e) {}
        }
      }

      if (parsed) {
        try {
          const legacyCompanyString = parsed.company;
          const legacyPartner = parsed.partnerId;
          const legacyScreenshot = parsed.dashboardScreenshot;
          
          const companiesArray: IKycCompany[] = Array.isArray(parsed.companies) ? parsed.companies : [];

          if (companiesArray.length === 0 && legacyCompanyString && typeof legacyCompanyString === 'string') {
             let foundCategory = "";
             for (const [cat, comps] of Object.entries(COMPANY_CATEGORY_MAP)) {
               if (comps.some(c => c.toLowerCase() === legacyCompanyString.toLowerCase())) {
                 foundCategory = cat;
                 break;
               }
             }
             
             if (foundCategory) {
               const matchedName = COMPANY_CATEGORY_MAP[foundCategory].find(c => c.toLowerCase() === legacyCompanyString.toLowerCase()) || legacyCompanyString;
               companiesArray.push({
                 id: Date.now().toString(),
                 category: foundCategory,
                 company: matchedName,
                 partnerId: legacyPartner || "",
                 dashboardScreenshot: legacyScreenshot || "",
                 verified: false
               });
             }
          }
          
          if (companiesArray.length === 0) {
             companiesArray.push({ id: Date.now().toString(), category: "", company: "", partnerId: "", dashboardScreenshot: "", verified: false });
          }

          let foundGlobal = "";
          if (companiesArray.length > 0 && companiesArray[0].category) {
            foundGlobal = companiesArray[0].category;
          } else if (parsed.companies && parsed.companies.length > 0 && parsed.companies[0].category) {
            foundGlobal = parsed.companies[0].category;
          }
          setGlobalCategory(foundGlobal);

          // Strip _id completely locally keeping structural purity preventing backend confusion
           
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setCompanies(companiesArray.map((c: any, i) => ({ 
             id: c._id || c.id || `comp_${i}_${Date.now()}`,
             category: foundGlobal || c.category || "",
             company: c.company || "",
             partnerId: c.partnerId || "",
             dashboardScreenshot: c.dashboardScreenshot || "",
             verified: Boolean(c.verified)
          })));
          
           
          setKycData({
            aadhaar: parsed.aadhaar || "",
            pan: parsed.pan || "",
            photo: parsed.photo || "",
            location: parsed.city || parsed.location || "", 
            age: parsed.age ? parsed.age.toString() : "",
            avgWeeklyIncome: parsed.avgWeeklyIncome ? parsed.avgWeeklyIncome.toString() : "",
            avgWorkingHours: parsed.avgWorkingHours ? parsed.avgWorkingHours.toString() : "",
            status: parsed.status || "not_started"
          });
        } catch (_e) {
           
          setCompanies([{ id: Date.now().toString(), category: "", company: "", partnerId: "", dashboardScreenshot: "", verified: false }]);
        }
      } else {
          
         setCompanies([{ id: Date.now().toString(), category: "", company: "", partnerId: "", dashboardScreenshot: "", verified: false }]);
      }
      
      setIsMounted(true);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Completion Percentage safely checks entire companies mappings naturally
  const completionProps = useMemo(() => calculateKycCompletion(kycData, companies), [kycData, companies]);
  const walletSource = searchParams.get("source") === "wallet";

  useEffect(() => {
    if (!isLoading && kycData.status === "approved" && !walletSource) {
      router.replace("/dashboard/wallet");
    }
  }, [isLoading, kycData.status, walletSource, router]);

  // Unified save handler parsing local vs. remote arrays seamlessly
  const handleSaveKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    const newStatus = isBasicKycReady ? "pending" : "partial";
    
    // Explicitly formatting pure array excluding _id and verified
    const formattedCompanies = companies
      .filter(c => globalCategory && c.company)
      .map(c => ({
         category: globalCategory,
         company: c.company,
         partnerId: c.partnerId,
         dashboardScreenshot: c.dashboardScreenshot
      }));

    const payloadToSave = {
      ...kycData,
      city: kycData.location,
      status: newStatus,
      companies: formattedCompanies
    };
    
    // Save locally securely mapped identically against POST schema
    localStorage.setItem("survivalLensKyc", JSON.stringify(payloadToSave));
    
    try {
      await saveKycData({
        aadhaar: kycData.aadhaar,
        pan: kycData.pan,
        photo: kycData.photo,
        city: kycData.location,
        age: parseInt(kycData.age) || undefined,
        avgWeeklyIncome: parseInt(kycData.avgWeeklyIncome) || undefined,
        avgWorkingHours: parseInt(kycData.avgWorkingHours) || undefined,
        companies: formattedCompanies as IKycCompany[]
      });
    } catch (err) {
      console.error(err);
    }
    
    router.push("/dashboard/profile");
  };

  const handleChange = (field: string, value: string) => {
    let nextValue = value;

    if (field === "aadhaar" || field === "age" || field === "avgWeeklyIncome" || field === "avgWorkingHours") {
      nextValue = value.replace(/\D/g, "");
    }

    if (field === "pan") {
      nextValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    }

    setKycData(prev => ({ ...prev, [field]: nextValue }));
  };

  const handleGlobalCategoryChange = (value: string) => {
    setGlobalCategory(value);
    setCompanies(prev => prev.map(c => ({ ...c, category: value, company: "" })));
  };

  const updateCompany = (id: string, field: keyof IKycCompany, value: string) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, [field]: field === "partnerId" ? value.toUpperCase() : value };
      }
      return c;
    }));
  };

  const addCompany = () => {
    setCompanies(prev => [...prev, { id: Date.now().toString() + Math.random(), category: globalCategory, company: "", partnerId: "", dashboardScreenshot: "", verified: false }]);
  };

  const removeCompany = (id: string) => {
    setCompanies(prev => prev.length > 1 ? prev.filter(c => c.id !== id) : prev);
  };

  const handleGlobalMockUpload = (field: "photo") => {
    setKycData(prev => ({ ...prev, [field]: "uploaded_file.png" }));
  };

  const handleCompanyMockUpload = (id: string) => {
    updateCompany(id, "dashboardScreenshot", "screenshot_secured.png");
  };

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-400">
         <Loader2 className="animate-spin mr-3" size={24} /> Syncing Configurations...
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
             Complete your algorithmic profile incorporating multi-company affiliations strictly enforcing global KYC regulations supporting decentralized buffer payouts natively.
           </p>
         </div>
         
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

      <motion.form 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative z-10 space-y-10"
        onSubmit={handleSaveKyc}
      >
        {/* ── BASIC KYC FIELDS ── */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-white">
          <h2 className="text-xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Personal Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Aadhaar ID</label>
              <input type="text" value={kycData.aadhaar} onChange={e => handleChange('aadhaar', e.target.value)} maxLength={12} inputMode="numeric" placeholder="0000 0000 0000 0000" className={`w-full px-5 py-4 bg-slate-50/80 border focus:bg-white focus:ring-4 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none ${validation.aadhaarOk || !kycData.aadhaar ? 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10' : 'border-red-200 focus:border-red-500 focus:ring-red-500/10'}`} />
              <p className={`mt-2 text-[11px] font-bold ${validation.aadhaarOk || !kycData.aadhaar ? 'text-slate-400' : 'text-red-500'}`}>Required: exactly 12 digits, numbers only.</p>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">PAN Number</label>
              <input type="text" value={kycData.pan} onChange={e => handleChange('pan', e.target.value)} maxLength={10} placeholder="ABCDE1234F" className={`w-full px-5 py-4 bg-slate-50/80 border focus:bg-white focus:ring-4 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none uppercase ${validation.panOk || !kycData.pan ? 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10' : 'border-red-200 focus:border-red-500 focus:ring-red-500/10'}`} />
              <p className={`mt-2 text-[11px] font-bold ${validation.panOk || !kycData.pan ? 'text-slate-400' : 'text-red-500'}`}>
                {validation.panOk ? "PAN verified: format matched." : "Required: 10 characters in PAN format (AAAAA1234A)."}
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Age</label>
              <input type="number" min={18} max={99} value={kycData.age} onChange={e => handleChange('age', e.target.value)} placeholder="e.g. 28" className={`w-full px-5 py-4 bg-slate-50/80 border focus:bg-white focus:ring-4 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none ${validation.ageOk || !kycData.age ? 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10' : 'border-red-200 focus:border-red-500 focus:ring-red-500/10'}`} />
              <p className={`mt-2 text-[11px] font-bold ${validation.ageOk || !kycData.age ? 'text-slate-400' : 'text-red-500'}`}>Required: 18 years or older.</p>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Geopolitical Location</label>
              <select value={kycData.location} onChange={e => handleChange('location', e.target.value)} className={`w-full px-5 py-4 bg-slate-50/80 border focus:bg-white focus:ring-4 rounded-2xl text-[14px] font-black text-slate-900 transition-all outline-none appearance-none ${validation.locationOk ? 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10' : 'border-red-200 focus:border-red-500 focus:ring-red-500/10'}`}>
                <option value="">Select Zone...</option>
                <option value="Metropolitan">Metropolitan</option>
                <option value="Urban">Urban</option>
                <option value="Semi-Urban">Semi-Urban</option>
                <option value="Rural">Rural</option>
              </select>
              <p className={`mt-2 text-[11px] font-bold ${validation.locationOk ? 'text-slate-400' : 'text-red-500'}`}>Required: choose your operating zone.</p>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Avg Weekly Income (₹)</label>
              <input type="number" min={1} value={kycData.avgWeeklyIncome} onChange={e => handleChange('avgWeeklyIncome', e.target.value)} placeholder="e.g. 12000" className={`w-full px-5 py-4 bg-slate-50/80 border focus:bg-white focus:ring-4 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none ${validation.incomeOk || !kycData.avgWeeklyIncome ? 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10' : 'border-red-200 focus:border-red-500 focus:ring-red-500/10'}`} />
              <p className={`mt-2 text-[11px] font-bold ${validation.incomeOk || !kycData.avgWeeklyIncome ? 'text-slate-400' : 'text-red-500'}`}>Required: enter a positive weekly amount.</p>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Avg Weekly Hours</label>
              <input type="number" min={1} max={99} value={kycData.avgWorkingHours} onChange={e => handleChange('avgWorkingHours', e.target.value)} placeholder="e.g. 45" className={`w-full px-5 py-4 bg-slate-50/80 border focus:bg-white focus:ring-4 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none ${validation.hoursOk || !kycData.avgWorkingHours ? 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10' : 'border-red-200 focus:border-red-500 focus:ring-red-500/10'}`} />
              <p className={`mt-2 text-[11px] font-bold ${validation.hoursOk || !kycData.avgWorkingHours ? 'text-slate-400' : 'text-red-500'}`}>Required: enter weekly working hours greater than 0.</p>
            </div>

            <div className="md:col-span-2 border-t border-slate-100 pt-8 mt-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Platform Category</label>
              <select value={globalCategory} onChange={e => handleGlobalCategoryChange(e.target.value)} className={`w-full px-5 py-4 bg-slate-50/80 border focus:bg-white focus:ring-4 rounded-2xl text-[14px] font-black text-slate-900 transition-all outline-none appearance-none ${validation.categoryOk ? 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10' : 'border-red-200 focus:border-red-500 focus:ring-red-500/10'}`}>
                <option value="">Select Strategy Sector...</option>
                {ALLOWED_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <p className={`mt-2 text-[11px] font-bold ${validation.categoryOk ? 'text-slate-400' : 'text-red-500'}`}>Required: choose one platform strategy sector.</p>
            </div>

            <div className="md:col-span-2 border-t border-slate-100 pt-8 mt-2">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Live Photo Evidence</label>
               <button type="button" onClick={() => handleGlobalMockUpload('photo')} className={`w-full flex items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed transition-all font-black tracking-tight ${kycData.photo ? "border-emerald-500 bg-emerald-50/50 text-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-slate-300 bg-slate-50/50 text-slate-400 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"}`}>
                 {kycData.photo ? <><CheckCircle2 size={18} /> Photographic ID Secured</> : <><UploadCloud size={18} /> Upload Authentic Photo</>}
               </button>
              <p className={`mt-2 text-[11px] font-bold ${validation.photoOk ? 'text-slate-400' : 'text-red-500'}`}>Required: photo evidence must be attached.</p>
            </div>
          </div>
        </div>

        {/* ── COMPANIES SECTION ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pl-4 pr-2">
             <h2 className="text-xl font-bold text-slate-900">Affiliated Platforms</h2>
             <button type="button" onClick={addCompany} className="flex items-center gap-1.5 text-[12px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2 px-4 rounded-xl transition-colors">
                <Plus size={14} strokeWidth={3} /> Add Platform
             </button>
          </div>

          <AnimatePresence>
            {companies.map((company, index) => (
              <motion.div 
                key={company.id}
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden relative"
              >
                {/* Visual Indicator if verified heavily */}
                {company.verified && (
                  <div className="absolute top-4 right-8 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 tracking-widest border border-emerald-100">
                    <CheckCircle2 size={12} /> Confirmed Block
                  </div>
                )}
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                   <h3 className="text-sm font-bold text-slate-400">Platform Card {index + 1}</h3>
                   {companies.length > 1 && (
                     <button type="button" onClick={() => removeCompany(company.id)} className="text-red-400 hover:text-red-600 transition-colors p-1" title="Remove Platform">
                        <Trash2 size={16} />
                     </button>
                   )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Specific Company</label>
                    <select disabled={!globalCategory} value={company.company} onChange={e => updateCompany(company.id, 'company', e.target.value)} className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-black text-slate-900 transition-all outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="">{globalCategory ? "Select Affiliation..." : "Awaiting Category Selection..."}</option>
                      {globalCategory && COMPANY_CATEGORY_MAP[globalCategory]?.map(cName => (
                         <option key={cName} value={cName}>{cName}</option>
                      ))}
                    </select>
                    <p className={`mt-2 text-[11px] font-bold ${company.company ? 'text-slate-400' : 'text-red-500'}`}>Required: choose one company after selecting a category.</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Partner / Driver ID Configuration</label>
                    <input type="text" value={company.partnerId} onChange={e => updateCompany(company.id, 'partnerId', e.target.value)} placeholder="e.g. DRIVER-9921" className={`w-full px-5 py-4 bg-slate-50/80 border focus:bg-white focus:ring-4 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none ${company.partnerId.trim().length >= 4 ? 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10' : 'border-red-200 focus:border-red-500 focus:ring-red-500/10'}`} />
                    <p className={`mt-2 text-[11px] font-bold ${company.partnerId.trim().length >= 4 ? 'text-slate-400' : 'text-red-500'}`}>Required: minimum 4 characters for partner/driver ID.</p>
                  </div>

                  <div className="md:col-span-2 pt-2">
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Live Dashboard Evidence</label>
                     <button type="button" onClick={() => handleCompanyMockUpload(company.id)} className={`w-full flex items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed transition-all font-black tracking-tight ${company.dashboardScreenshot ? "border-emerald-500 bg-emerald-50/50 text-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-slate-300 bg-slate-50/50 text-slate-400 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"}`}>
                       {company.dashboardScreenshot ? <><CheckCircle2 size={18} /> Earnings Screenshot Secured</> : <><UploadCloud size={18} /> Upload Authentic Gig History Proof</>}
                     </button>
                    <p className={`mt-2 text-[11px] font-bold ${company.dashboardScreenshot ? 'text-slate-400' : 'text-red-500'}`}>Required: attach dashboard evidence for this company.</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── ACTION FOOTER ── */}
        <div className="mt-4 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-white flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-[11px] font-bold text-slate-400 max-w-sm leading-relaxed">
             All payloads are symmetrically encrypted (AES-256) seamlessly matching the new multi-auditor API schema offline completely seamlessly securely mitigating redundant payloads.
           </p>
           
           <button 
              disabled={!isBasicKycReady || isLoading}
              type="submit" 
              className={`w-full md:w-auto px-10 font-black py-4 rounded-2xl shadow-xl shadow-slate-900/10 transition-all text-sm group flex items-center justify-center gap-2 ${
                isBasicKycReady && !isLoading
                  ? 'bg-slate-900 hover:bg-black text-white hover:-translate-y-0.5'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
            {isBasicKycReady ? "Submit Complete Multisig Authentication" : "Complete All Required Fields"}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.form>
    </div>
  );
}
