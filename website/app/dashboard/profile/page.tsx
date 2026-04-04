"use client";

import { useState, useEffect } from "react";
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
import { getKycData, saveKycData, calculateKycCompletion } from "../../../(services)/kyc";

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
  const [addressForm, setAddressForm] = useState({
    houseNo: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [addressSaved, setAddressSaved] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [isResolvingPopulation, setIsResolvingPopulation] = useState(false);
  const [populationLookupError, setPopulationLookupError] = useState("");
  const [resolvedPopulation, setResolvedPopulation] = useState<number | null>(null);
  const [resolvedServiceZone, setResolvedServiceZone] = useState("");
  const [resolvedCityName, setResolvedCityName] = useState("");

  // ── KYC API FETCH ──
  const [completionProps, setCompletionProps] = useState({ percentage: 0, filledFields: 0, totalFields: 11 });
  const [kycStatus, setKycStatus] = useState("not_started");
  const [kycRecord, setKycRecord] = useState<any>(null);

  // ── PARTNERS STATE ──
  const [selectedCategory, setSelectedCategory] = useState("Food Delivery");
  const [selectedPartners, setSelectedPartners] = useState<string[]>(["Swiggy"]);
  
  const PARTNER_CATEGORIES = [
    { id: "Food Delivery", icon: Store, partners: ["Swiggy", "Zomato", "Eats"] },
    { id: "Quick Commerce", icon: ShoppingCart, partners: ["Blinkit", "Zepto", "Instamart"] },
    { id: "Mobility", icon: Car, partners: ["Uber", "Ola", "Rapido"] },
    { id: "E-Commerce", icon: Briefcase, partners: ["Amazon", "Flipkart", "Myntra"] }
  ];

  const resolveCategoryFromCompany = (companyName: string) => {
    const normalized = companyName.toLowerCase().trim();
    for (const category of PARTNER_CATEGORIES) {
      const isExactMatch = category.partners.some((partner) => partner.toLowerCase() === normalized);
      const isFuzzyMatch = category.partners.some((partner) => normalized.includes(partner.toLowerCase()) || partner.toLowerCase().includes(normalized));
      if (isExactMatch || isFuzzyMatch) {
        return category.id;
      }
    }
    return "";
  };

  const handlePartnerToggle = (partner: string) => {
    setSelectedPartners([partner]);
  };

  const handleAddressFieldChange = (field: keyof typeof addressForm, value: string) => {
    setAddressSaved(false);
    if (field === "city") {
      const upperCity = value.toUpperCase();
      setPopulationLookupError("");
      setResolvedCityName("");
      setResolvedPopulation(null);
      setResolvedServiceZone("");
      setAddressForm((prev) => ({ ...prev, [field]: upperCity }));
      return;
    }

    if (field === "state") {
      setPopulationLookupError("");
    }
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAddress = async () => {
    const cityValue = addressForm.city.trim();
    if (!cityValue) {
      setAddressError("City is required.");
      setAddressSaved(false);
      return;
    }

    const parts = [
      addressForm.houseNo,
      addressForm.street,
      addressForm.area,
      cityValue,
      addressForm.state,
      addressForm.pincode,
    ]
      .map((part) => part.trim())
      .filter(Boolean);

    const fullAddress = parts.join(", ");
    const effectiveZone =
      resolvedServiceZone ||
      (typeof kycRecord?.serviceZone === "string" ? kycRecord.serviceZone.trim() : "") ||
      (typeof kycRecord?.zone === "string" ? kycRecord.zone.trim() : "");
    const effectivePopulation =
      resolvedPopulation ??
      (Number.isFinite(Number(kycRecord?.population)) ? Number(kycRecord?.population) : undefined);

    setProfile((prev) => ({ ...prev, address: fullAddress }));
    localStorage.setItem(
      "survivalLensAddress",
      JSON.stringify({ ...addressForm, city: cityValue.toUpperCase() })
    );
    setAddressError("");

    // Keep KYC city in sync so overview/profile cards reflect the edited address city.
    setKycRecord((prev: any) => ({
      ...(prev || {}),
      city: cityValue.toUpperCase(),
      location: cityValue.toUpperCase(),
      zone: effectiveZone,
      serviceZone: effectiveZone,
      population: effectivePopulation,
    }));

    const savedKyc = localStorage.getItem("survivalLensKyc");
    if (savedKyc) {
      try {
        const parsed = JSON.parse(savedKyc);
        localStorage.setItem(
          "survivalLensKyc",
          JSON.stringify({
            ...parsed,
            city: cityValue.toUpperCase(),
            location: cityValue.toUpperCase(),
            zone: effectiveZone,
            serviceZone: effectiveZone,
            population: effectivePopulation,
          })
        );
      } catch {
        // Ignore malformed local KYC cache.
      }
    }

    try {
      await saveKycData({
        city: cityValue.toUpperCase(),
        location: cityValue.toUpperCase(),
        zone: effectiveZone,
        serviceZone: effectiveZone,
        population: effectivePopulation,
      });
    } catch {
      // Keep local sync even if API call fails temporarily.
    }

    setAddressSaved(true);
  };

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

        const savedAvatar = localStorage.getItem("survivalLensAvatar");
        if (savedAvatar) {
           setProfile(prev => ({ ...prev, avatarUrl: savedAvatar }));
        }

        const savedAddress = localStorage.getItem("survivalLensAddress");
        if (savedAddress) {
          try {
            const parsedAddress = JSON.parse(savedAddress);
            setAddressForm((prev) => ({
              ...prev,
              houseNo: parsedAddress.houseNo || "",
              street: parsedAddress.street || "",
              area: parsedAddress.area || "",
              city: (parsedAddress.city || "").toUpperCase(),
              state: parsedAddress.state || "",
              pincode: parsedAddress.pincode || "",
            }));
          } catch {
            // Ignore malformed saved address payload.
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
           const kycCity = String(kycDataResponse.city || kycDataResponse.location || "").trim().toUpperCase();
           const savedZone =
             typeof kycDataResponse.serviceZone === "string"
               ? kycDataResponse.serviceZone.trim()
               : typeof kycDataResponse.zone === "string"
                 ? kycDataResponse.zone.trim()
                 : "";
           const savedPopulation = Number(kycDataResponse.population);

           if (savedZone) {
             setResolvedServiceZone(savedZone);
           }
           if (Number.isFinite(savedPopulation) && savedPopulation > 0) {
             setResolvedPopulation(savedPopulation);
           }

             if (kycCity) {
                setProfile((prev) => ({
                  ...prev,
                  address: prev.address || kycCity,
                }));
                setAddressForm((prev) => ({
                  ...prev,
                  city: kycCity,
                }));
           }
            if (kycDataResponse.status) {
              setKycStatus(kycDataResponse.status);
            }
            setKycRecord(kycDataResponse);

           const companyNames = [
             ...(Array.isArray(kycDataResponse.companies)
               ? kycDataResponse.companies.map((item: any) => String(item?.company || "").trim()).filter(Boolean)
               : []),
             ...(typeof kycDataResponse.company === "string" && kycDataResponse.company.trim() ? [kycDataResponse.company.trim()] : []),
           ];

           const uniquePartners = Array.from(new Set(companyNames)).slice(0, 1);
           if (uniquePartners.length > 0) {
             setSelectedPartners(uniquePartners);
             const inferredCategory = resolveCategoryFromCompany(uniquePartners[0]);
             if (inferredCategory) {
               setSelectedCategory(inferredCategory);
             }
           }

           setCompletionProps(calculateKycCompletion(kycDataResponse, kycDataResponse.companies || []));
        }
      } catch (e) {
        // Fallback
        const saved = localStorage.getItem("survivalLensKyc");
        if (saved) {
           try {
             const data = JSON.parse(saved);
             if (data.status) {
               setKycStatus(data.status);
             }
             setKycRecord(data);
             setCompletionProps(calculateKycCompletion(data, data.companies || []));
           } catch (_err) {}
        }
      }
      setIsMounted(true);
    };
    
    loadProfileData();
  }, [profile.address]);

  useEffect(() => {
    const cityValue = addressForm.city.trim();
    const stateValue = addressForm.state.trim();

    if (cityValue.length < 2) {
      setIsResolvingPopulation(false);
      setPopulationLookupError("");
      setResolvedCityName("");
      setResolvedPopulation(null);
      setResolvedServiceZone("");
      return;
    }

    const controller = new AbortController();
    setIsResolvingPopulation(true);
    setPopulationLookupError("");

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ city: cityValue });
        if (stateValue) {
          params.set("state", stateValue);
        }
        params.set("country", "IN");

        const response = await fetch(`/api/location/population?${params.toString()}`, {
          method: "GET",
          signal: controller.signal,
          cache: "no-store",
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Unable to resolve population");
        }

        const fetchedPopulation = Number(data?.population);
        const fetchedZone = typeof data?.serviceZone === "string" ? data.serviceZone : "";

        setResolvedCityName(typeof data?.matchedCity === "string" ? data.matchedCity : cityValue);
        setResolvedPopulation(Number.isFinite(fetchedPopulation) ? fetchedPopulation : null);
        setResolvedServiceZone(fetchedZone);
      } catch (error: unknown) {
        if (controller.signal.aborted) return;

        const message = error instanceof Error ? error.message : "Failed to resolve population";
        setResolvedCityName("");
        setResolvedPopulation(null);
        setResolvedServiceZone("");
        setPopulationLookupError(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsResolvingPopulation(false);
        }
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [addressForm.city, addressForm.state]);

  useEffect(() => {
    const cityFromKyc = String(kycRecord?.city || kycRecord?.location || "").trim();
    const existingZone = String(kycRecord?.serviceZone || kycRecord?.zone || "").trim();
    const hasPopulation = Number.isFinite(Number(kycRecord?.population)) && Number(kycRecord?.population) > 0;

    if (!cityFromKyc || existingZone || hasPopulation) return;

    const controller = new AbortController();

    const resolveZoneFromKycCity = async () => {
      try {
        const params = new URLSearchParams({ city: cityFromKyc, country: "IN" });
        const response = await fetch(`/api/location/population?${params.toString()}`, {
          method: "GET",
          signal: controller.signal,
          cache: "no-store",
        });

        const data = await response.json();
        if (!response.ok) return;

        const fetchedPopulation = Number(data?.population);
        const fetchedZone = typeof data?.serviceZone === "string" ? data.serviceZone : "";
        if (!fetchedZone) return;

        setResolvedServiceZone(fetchedZone);
        setResolvedPopulation(Number.isFinite(fetchedPopulation) ? fetchedPopulation : null);

        setKycRecord((prev: any) => ({
          ...(prev || {}),
          zone: fetchedZone,
          serviceZone: fetchedZone,
          population: Number.isFinite(fetchedPopulation) ? fetchedPopulation : prev?.population,
        }));

        const savedKyc = localStorage.getItem("survivalLensKyc");
        if (savedKyc) {
          try {
            const parsed = JSON.parse(savedKyc);
            localStorage.setItem(
              "survivalLensKyc",
              JSON.stringify({
                ...parsed,
                zone: fetchedZone,
                serviceZone: fetchedZone,
                population: Number.isFinite(fetchedPopulation) ? fetchedPopulation : parsed?.population,
              })
            );
          } catch {
            // Ignore malformed local KYC cache.
          }
        }

        try {
          await saveKycData({
            zone: fetchedZone,
            serviceZone: fetchedZone,
            population: Number.isFinite(fetchedPopulation) ? fetchedPopulation : undefined,
          });
        } catch {
          // Non-blocking persistence fallback.
        }
      } catch {
        // Ignore transient lookup failures.
      }
    };

    void resolveZoneFromKycCity();

    return () => {
      controller.abort();
    };
  }, [kycRecord?.city, kycRecord?.location, kycRecord?.serviceZone, kycRecord?.zone, kycRecord?.population]);

  useEffect(() => {
    const kycCity = String(kycRecord?.city || kycRecord?.location || "").trim().toUpperCase();
    if (!kycCity) return;

    setAddressForm((prev) => ({
      ...prev,
      city: kycCity,
    }));
  }, [kycRecord?.city, kycRecord?.location]);

  if (!isMounted) return null;

  const kycCompanies = Array.isArray(kycRecord?.companies) ? kycRecord.companies : [];
  const primaryKycCompany = typeof kycRecord?.company === "string" && kycRecord.company.trim()
    ? kycRecord.company.trim()
    : (kycCompanies.find((item: any) => item?.company?.trim())?.company?.trim() || "Not set");
  const primaryKycPartnerId = typeof kycRecord?.partnerId === "string" && kycRecord.partnerId.trim()
    ? kycRecord.partnerId.trim()
    : (kycCompanies.find((item: any) => item?.partnerId?.trim())?.partnerId?.trim() || "Not set");
  const primaryKycCity = typeof kycRecord?.city === "string"
    ? kycRecord.city.trim().toUpperCase()
    : typeof kycRecord?.location === "string"
      ? kycRecord.location.trim().toUpperCase()
      : "Not set";
  const populationValue = Number(kycRecord?.population);
  const derivedZoneFromPopulation = Number.isFinite(populationValue) && populationValue > 0
    ? populationValue >= 4000000
      ? "Metropolitan"
      : populationValue >= 1000000
        ? "Urban"
        : populationValue >= 200000
          ? "Semi Urban"
          : "Rural"
    : "";
  const primaryKycZone = typeof kycRecord?.zone === "string"
    ? kycRecord.zone.trim()
    : typeof kycRecord?.serviceZone === "string"
      ? kycRecord.serviceZone.trim()
      : resolvedServiceZone || derivedZoneFromPopulation || "Not set";

  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto w-full relative min-h-full">
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div 
        className={`absolute top-[-5%] right-[-10%] ${kycStatus === "approved" ? "bg-emerald-400/5" : "bg-amber-400/5"} rounded-full blur-[140px] pointer-events-none z-0 transition-colors duration-1000`} 
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
      {kycStatus !== "approved" ? (
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
            <div className={`w-28 h-28 shrink-0 ${kycStatus === "approved" ? "bg-emerald-950 border-emerald-50" : "bg-slate-900 border-white"} rounded-full border-4 shadow-lg overflow-hidden flex flex-col items-center justify-center relative transition-colors duration-500 bg-emerald-50`}>
              {profile.avatarUrl ? (
                 <img src={profile.avatarUrl} alt="User avatar" className="w-full h-full object-cover z-30 relative" />
              ) : (
                 <>
                   <div className={`w-12 h-12 ${kycStatus === "approved" ? "bg-emerald-100" : "bg-amber-100"} rounded-t-full absolute bottom-3 z-10 transition-colors duration-500`}></div>
                   <div className="w-[4.5rem] h-8 bg-slate-800 rounded-t-[2rem] absolute bottom-0 z-20"></div>
                   <div className={`w-[4.5rem] h-6 ${kycStatus === "approved" ? "bg-emerald-950" : "bg-slate-900"} rounded-full absolute top-[14px] z-20 transition-colors duration-500`}></div>
                 </>
              )}
            </div>

            <div className="flex-1 space-y-5 w-full">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 mb-0.5 tracking-tight">{profile.fullName || "Driver"}</h2>
                   <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${kycStatus === "approved" ? "text-emerald-500" : "text-amber-500"}`}>
                     {kycStatus === "approved" ? "Verified Operative" : "Unverified Status"}
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

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em]">KYC Company</p>
                    <p className="text-[12px] font-bold text-slate-700 truncate">{primaryKycCompany}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em]">Partner ID</p>
                    <p className="text-[12px] font-bold text-slate-700 truncate">{primaryKycPartnerId}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em]">Service Zone</p>
                    <p className="text-[12px] font-bold text-slate-700 truncate">{primaryKycZone}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em]">City</p>
                    <p className="text-[12px] font-bold text-slate-700 truncate">{primaryKycCity}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em]">Linked Platforms</p>
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60">
                      {kycCompanies.length} Total
                    </span>
                  </div>

                  {kycCompanies.length > 0 ? (
                    <div className="space-y-2">
                      {kycCompanies.map((company: any, index: number) => (
                        <div key={company.id || `${company.company}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
                          <div className="min-w-0">
                            <p className="text-[12px] font-black text-slate-800 truncate">{company.company || "Not set"}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em] truncate">
                              {company.category || "Category pending"}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Partner ID</p>
                            <p className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">{company.partnerId || "Not set"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[12px] font-medium text-slate-500">No linked platforms found yet.</p>
                  )}
                </div>
            </div>
        </div>

        {/* Affiliations Block */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-shadow duration-500">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4 border-b border-slate-100/60 pb-6">
             <div>
               <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2 mb-1">
                 <Briefcase size={18} className="text-slate-400" /> Platform Affiliations
               </h3>
               <p className="text-[13px] text-slate-500 font-medium max-w-sm tracking-tight">Select your primary sectors and link up to 4 gig platforms.</p>
             </div>
             <div className="text-[11px] font-black tracking-widest uppercase bg-slate-100 text-slate-500 px-4 py-2 rounded-lg border border-slate-200/60 shadow-inner">
                {selectedPartners.length} / 1 Linked
             </div>
           </div>

           <div className="bg-slate-50 rounded-2xl p-1.5 border border-slate-100 flex overflow-x-auto no-scrollbar mb-6">
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

           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                        className={`p-5 rounded-2xl border flex flex-col items-center justify-center transition-all ${isSelected ? 'border-blue-500 bg-blue-50/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-slate-200/60 bg-white hover:border-slate-300/80 shadow-sm'}`}
                     >
                        <div className={`w-8 h-8 rounded-lg border ${isSelected ? 'bg-blue-500 border-blue-600 shadow-sm flex items-center justify-center' : 'bg-slate-50 border-slate-200 mb-0'} text-white transition-colors mb-3`}>
                           {isSelected && <BadgeCheck size={16} strokeWidth={3} className="text-white fill-blue-500" />}
                        </div>
                        <span className={`text-[13px] font-black tracking-tight ${isSelected ? 'text-blue-900' : 'text-slate-600'}`}>{partner}</span>
                     </motion.button>
                  )
                })}
             </AnimatePresence>
           </div>
        </div>
        
        {/* Registration Address */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-shadow duration-500">
           <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2 mb-1">
             <MapPin size={18} className="text-slate-400" /> Physical Registration
           </h3>
           <p className="text-[13px] text-slate-500 font-medium mb-6 tracking-tight">Enter complete residential details. Service Zone is auto-classified from city population.</p>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
             <input
               value={addressForm.houseNo}
               onChange={(e) => handleAddressFieldChange("houseNo", e.target.value)}
               placeholder="House / Flat No"
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-[14px] font-medium text-slate-800 outline-none"
             />
             <input
               value={addressForm.street}
               onChange={(e) => handleAddressFieldChange("street", e.target.value)}
               placeholder="Street / Road"
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-[14px] font-medium text-slate-800 outline-none"
             />
             <input
               value={addressForm.area}
               onChange={(e) => handleAddressFieldChange("area", e.target.value)}
               placeholder="Area / Landmark"
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-[14px] font-medium text-slate-800 outline-none"
             />
             <input
               value={addressForm.city}
               onChange={(e) => handleAddressFieldChange("city", e.target.value)}
               placeholder="City"
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-[14px] font-medium text-slate-800 outline-none"
             />
             <input
               value={addressForm.state}
               onChange={(e) => handleAddressFieldChange("state", e.target.value)}
               placeholder="State"
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-[14px] font-medium text-slate-800 outline-none"
             />
             <input
               value={addressForm.pincode}
               onChange={(e) => handleAddressFieldChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
               placeholder="Pincode"
               inputMode="numeric"
               className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-[14px] font-medium text-slate-800 outline-none"
             />
           </div>

           <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 mb-5">
             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
               <div>
                 <p className="text-[9px] uppercase font-black tracking-[0.16em] text-slate-400">Auto Service Zone</p>
                 <p className="text-[13px] font-black text-slate-800 mt-1">
                   {resolvedServiceZone || "Not detected yet"}
                 </p>
               </div>
               <div className="text-left sm:text-right">
                 <p className="text-[9px] uppercase font-black tracking-[0.16em] text-slate-400">Detected Population</p>
                 <p className="text-[13px] font-black text-slate-800 mt-1">
                   {resolvedPopulation !== null ? new Intl.NumberFormat("en-IN").format(resolvedPopulation) : "-"}
                 </p>
               </div>
             </div>

             {isResolvingPopulation && (
               <p className="mt-2 text-[11px] font-bold text-blue-600 uppercase tracking-[0.12em]">Resolving city population...</p>
             )}
             {!isResolvingPopulation && resolvedCityName && (
               <p className="mt-2 text-[11px] font-bold text-slate-500 uppercase tracking-[0.12em]">Matched city: {resolvedCityName}</p>
             )}
             {populationLookupError && (
               <p className="mt-2 text-[11px] font-black text-amber-600 uppercase tracking-[0.12em]">{populationLookupError}</p>
             )}
           </div>

           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
             <p className="text-[12px] font-bold text-slate-500 truncate">{profile.address || "No full address saved yet."}</p>
             <button
               type="button"
               onClick={handleSaveAddress}
               className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-[12px] font-black uppercase tracking-[0.12em] transition-colors"
             >
               Save Address
             </button>
           </div>

           {addressError && (
             <p className="mt-3 text-[11px] font-black text-red-500 uppercase tracking-[0.12em]">{addressError}</p>
           )}

           {addressSaved && (
             <p className="mt-3 text-[11px] font-black text-emerald-600 uppercase tracking-[0.14em]">Address saved</p>
           )}
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
