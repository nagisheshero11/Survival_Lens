"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Activity,
  CloudRain,
  Flame,
  Construction,
  BadgeCheck,
  Loader2,
  ShieldAlert,
  Fingerprint,
  TrendingUp,
  History as HistoryIcon,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const toTrimmedString = (value: unknown) => {
    if (typeof value === "string") return value.trim();
    if (typeof value === "number") return String(value).trim();
    return "";
  };

  const defaultKycData = {
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
  };

  const [profileData, setProfileData] = useState<any>(null);
  const [localUserName, setLocalUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [liveLocationLabel, setLiveLocationLabel] = useState("");
  const [currentCity, setCurrentCity] = useState("India");
  const router = useRouter();
  const [gpsStatus, setGpsStatus] = useState("Trying GPS...");
  const [loading, setLoading] = useState(true);

  const [kycData, setKycData] = useState(defaultKycData);

  // ── RISK SCANNER STATE ──
  const [isScanningRisk, setIsScanningRisk] = useState(false);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showSafeToast, setShowSafeToast] = useState(false);

  const handleCheckRisk = async () => {
     if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
     }

     setIsScanningRisk(true);
     setScanResult(null);

     navigator.geolocation.getCurrentPosition(async (position) => {
        try {
           const { latitude, longitude } = position.coords;
           const response = await fetch("http://127.0.0.1:8000/v1/analyze/georisk", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ latitude, longitude })
           });

           if (response.ok) {
              const data = await response.json();
              setScanResult(data);
              
              if (data.ai_analysis?.risk_level === "CRITICAL" || data.ai_analysis?.risk_level === "WARNING") {
                 setShowVotingModal(true);
              } else {
                 setShowSafeToast(true);
                 setTimeout(() => setShowSafeToast(false), 4000);
              }
           } else {
              alert("AI Service evaluated error.");
           }
        } catch (error) {
           console.error("AI Service Offline:", error);
           alert("Unable to reach the Python AI Network. Ensure backend is running locally on port 8000.");
        } finally {
           setIsScanningRisk(false);
        }
     }, (error) => {
        console.error(error);
        alert("Failed to retrieve your coordinates.");
        setIsScanningRisk(false);
     });
  };

  const submitCrowdVote = (vote: boolean) => {
     setShowVotingModal(false);
     setShowSafeToast(true); 
     setTimeout(() => setShowSafeToast(false), 3000);
  };

  useEffect(() => {
    let isUnmounted = false;
    let gpsWatchId: number | null = null;
    let gpsTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const savedKyc = localStorage.getItem("survivalLensKyc");
    if (savedKyc) {
      try {
        const parsed = JSON.parse(savedKyc);
        setKycData({ ...defaultKycData, ...(parsed || {}) });
      } catch {}
    }

    const applyLivePosition = (position: GeolocationPosition) => {
      if (isUnmounted) return;

      const { latitude, longitude, accuracy } = position.coords;
      const accuracyMeters = Math.round(accuracy || 0);

      // Ignore extremely imprecise readings and keep profile fallback.
      if (accuracyMeters > 1200) {
        setGpsStatus("GPS weak, using profile location");
        setGpsCoords(null);
        setLiveLocationLabel("");
        return false;
      }

      setGpsCoords({ lat: latitude, lng: longitude });
      setLiveLocationLabel(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      setGpsStatus(accuracyMeters > 0 ? `Live GPS (±${accuracyMeters}m)` : "Live GPS");
      return true;
    };

    const setProfileFallback = (status: string) => {
      if (isUnmounted) return;
      setGpsCoords(null);
      setLiveLocationLabel("");
      setGpsStatus(status);
    };

    const fetchMockProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser) as { fullName?: string; avatarUrl?: string };
            if (parsed.fullName?.trim()) {
              setLocalUserName(parsed.fullName.trim());
            }
            if (parsed.avatarUrl?.trim()) {
              setAvatarUrl(parsed.avatarUrl);
            }
          } catch {
            // Ignore malformed local storage payloads.
          }
        }

        const savedAvatar = localStorage.getItem("survivalLensAvatar");
        if (savedAvatar) {
          setAvatarUrl(savedAvatar);
        }

        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const [res, meRes] = await Promise.all([
          fetch('/api/user/mock-profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
          })
        ]);

        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }

        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData?.user?.fullName?.trim()) {
            setLocalUserName(meData.user.fullName.trim());
          }
          if (meData?.user?.kyc?.photo?.trim()) {
            setAvatarUrl(meData.user.kyc.photo);
          }
        }

        if (navigator.geolocation) {
          let bestPosition: GeolocationPosition | null = null;

          gpsWatchId = navigator.geolocation.watchPosition(
            (position) => {
              const currentAccuracy = position.coords.accuracy || Number.POSITIVE_INFINITY;
              const bestAccuracy = bestPosition?.coords.accuracy || Number.POSITIVE_INFINITY;

              if (!bestPosition || currentAccuracy < bestAccuracy) {
                bestPosition = position;
              }

              // Accept quickly once we have strong GPS accuracy.
              if (currentAccuracy <= 80) {
                if (gpsWatchId !== null) {
                  navigator.geolocation.clearWatch(gpsWatchId);
                  gpsWatchId = null;
                }
                if (gpsTimeoutId) {
                  clearTimeout(gpsTimeoutId);
                  gpsTimeoutId = null;
                }
                applyLivePosition(position);
              }
            },
            (error) => {
              if (gpsWatchId !== null) {
                navigator.geolocation.clearWatch(gpsWatchId);
                gpsWatchId = null;
              }
              if (gpsTimeoutId) {
                clearTimeout(gpsTimeoutId);
                gpsTimeoutId = null;
              }

              if (error.code === error.PERMISSION_DENIED) {
                setProfileFallback("GPS denied, using profile location");
              } else if (error.code === error.TIMEOUT) {
                setProfileFallback("GPS timeout, using profile location");
              } else {
                setProfileFallback("Using profile location");
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0,
            }
          );

          // Give GPS a short calibration window, then use the best captured reading.
          gpsTimeoutId = setTimeout(() => {
            if (gpsWatchId !== null) {
              navigator.geolocation.clearWatch(gpsWatchId);
              gpsWatchId = null;
            }

            if (bestPosition) {
              const applied = applyLivePosition(bestPosition);
              if (!applied) {
                setProfileFallback("GPS weak, using profile location");
              }
            } else {
              setProfileFallback("GPS timeout, using profile location");
            }
          }, 8000);
        } else {
          setProfileFallback("Using profile location");
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isUnmounted) {
          setLoading(false);
        }
      }
    };
    fetchMockProfile();

    return () => {
      isUnmounted = true;
      if (gpsWatchId !== null) {
        navigator.geolocation.clearWatch(gpsWatchId);
      }
      if (gpsTimeoutId) {
        clearTimeout(gpsTimeoutId);
      }
    };
  }, []);

  useEffect(() => {
    const fallbackCity = profileData?.mockProfile?.city?.trim() || "India";

    if (!gpsCoords) {
      setCurrentCity(fallbackCity);
      return;
    }

    let isCancelled = false;

    const resolveCityFromCoords = async () => {
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${gpsCoords.lat}&longitude=${gpsCoords.lng}&localityLanguage=en`
        );

        if (!res.ok) {
          throw new Error("Reverse geocode failed");
        }

        const data = await res.json();
        if (isCancelled) return;

        const countryCode = String(data?.countryCode || "").toUpperCase();
        const resolvedCity = (data?.city || data?.locality || data?.principalSubdivision || "").trim();

        if (countryCode === "IN" && resolvedCity) {
          setCurrentCity(resolvedCity);
        } else {
          setCurrentCity(fallbackCity);
        }
      } catch {
        if (!isCancelled) {
          setCurrentCity(fallbackCity);
        }
      }
    };

    resolveCityFromCoords();

    return () => {
      isCancelled = true;
    };
  }, [gpsCoords, profileData?.mockProfile?.city]);

  const completionProps = useMemo(() => {
    const normalizeField = (value: unknown) => (typeof value === "string" ? value.trim() : "");
    const fields = [
      kycData.aadhaar, kycData.pan, kycData.photo, kycData.location,
      kycData.age, kycData.company, kycData.partnerId, kycData.dashboardScreenshot,
      kycData.avgWeeklyIncome, kycData.avgWorkingHours
    ];
    const filledFields = fields.filter((f) => normalizeField(f) !== "").length;
    const percentage = Math.round((filledFields / fields.length) * 100);
    return { percentage, filledFields };
  }, [kycData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
         <Loader2 className="animate-spin mb-4 text-blue-500" size={32} />
         <p className="font-bold tracking-tight">Syncing Live Metrics...</p>
      </div>
    );
  }

  const mockProfile = profileData?.mockProfile || null;
  const userDetails = profileData?.userDetails || null;

  const fullName = toTrimmedString(userDetails?.fullName) || localUserName || "User";
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  const accountLevel = userDetails?.accountLevel || "Pro";
  const companies = typeof mockProfile?.company === "string" ? mockProfile.company : "Uber, Swiggy";
  const linkedAppsCount = companies.split(",").map((item: string) => item.trim()).filter(Boolean).length;
  const primaryCompany = toTrimmedString(kycData.company) || companies.split(",")[0]?.trim() || "Not set";
  const partnerRef = toTrimmedString(kycData.partnerId) || "Not set";
  const serviceZone = mockProfile?.zone || "Not set";
  const serviceCity = mockProfile?.city || "Not set";
  const rawWeeklyIncome = toTrimmedString(kycData.avgWeeklyIncome);
  const weeklyIncomeLabel = rawWeeklyIncome
    ? (rawWeeklyIncome.startsWith("₹") ? rawWeeklyIncome : `₹${rawWeeklyIncome}`)
    : "Not set";
  const trimmedWorkingHours = toTrimmedString(kycData.avgWorkingHours);
  const workingHoursLabel = trimmedWorkingHours ? `${trimmedWorkingHours} hrs/wk` : "Not set";
  const locationQuery = [mockProfile?.zone, mockProfile?.city].filter(Boolean).join(", ") || "India";
  const kycStatus = (kycData as any)?.status;
  const isKycComplete = completionProps.percentage >= 100 || kycStatus === "approved";
  const kycStatusLabel = isKycComplete ? "KYC Verified" : `KYC ${completionProps.percentage}%`;
  const displayedLocation = currentCity.toLowerCase() === "india" ? "India" : `${currentCity}, India`;
  const mapSrc = gpsCoords
    ? `https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lng}&z=15&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}&z=13&output=embed`;
  const mapLink = gpsCoords
    ? `https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lng}`
    : `https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}`;

  
  // Format the mock API values or fallback to default
  const formattedIncome = mockProfile?.avgDailyIncome 
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(mockProfile.avgDailyIncome)
    : "₹12,450";
    
  return (
    <div className="p-6 sm:p-8 xl:p-12 max-w-7xl mx-auto w-full relative">
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div 
        className="absolute top-0 right-[-10%] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none z-0 transition-opacity duration-1000" 
        style={{ width: 'clamp(24rem, 45vw, 37.5rem)', height: 'clamp(24rem, 45vw, 37.5rem)' }} 
      />
      <div 
        className="absolute left-[-10%] top-[40%] bg-emerald-400/5 rounded-full blur-[120px] pointer-events-none z-0 transition-opacity duration-1000" 
        style={{ width: 'clamp(20rem, 35vw, 31rem)', height: 'clamp(20rem, 35vw, 31rem)' }} 
      />

      {/* ── PAGE HEADER ── */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100/50">
              Live Feed
            </span>
            <span className="text-slate-400 text-xs font-bold tracking-tight">Last synced: Just now</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2">
            Overview
          </h1>
          <p className="text-[13px] text-slate-500 font-medium">
            Welcome back, <span className="text-slate-900 font-bold">{fullName}</span>. Your geospatial risk profile is <span className="text-emerald-500 font-bold">Stable & Protected</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <button className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors relative">
             <Bell size={18} strokeWidth={2.5} />
             <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full translate-x-1 -translate-y-1"></div>
          </button>
          <Link
            href="/dashboard/profile"
            className="w-11 h-11 rounded-2xl bg-slate-100 overflow-hidden ring-1 ring-slate-200 shadow-sm flex items-center justify-center text-slate-400 font-black tracking-tight cursor-pointer hover:ring-blue-200 transition-colors"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="User avatar" className="w-full h-full object-cover bg-slate-100" />
            ) : (
              initials
            )}
          </Link>
        </div>
      </div>

      {/* ── CRITICAL KYC NOTIFICATION ── */}
      {!isKycComplete && (
        <div className="relative z-10 bg-amber-50 border border-amber-200/60 rounded-[2rem] p-5 lg:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 shadow-[0_10px_40px_rgba(251,191,36,0.1)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0 border border-amber-200/50">
               <ShieldAlert size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600 mb-1 inline-block">
                Action Required
              </span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight mb-0.5">
                KYC Authentication Pending ({completionProps.percentage}%)
              </h2>
              <p className="text-[12px] text-amber-800 font-medium leading-relaxed max-w-xl">
                Identity verification is required before buffer payouts can be settled to your banking ledger.
              </p>
            </div>
          </div>
          <button 
            onClick={() => router.push("/dashboard/profile/kyc")}
            className="w-full md:w-auto bg-slate-900 hover:bg-black text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 transition-all text-[12px] flex items-center justify-center gap-2 group shrink-0"
          >
            <Fingerprint size={16} />
            {completionProps.percentage > 0 ? "Resume KYC" : "Start KYC"}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* ── METRICS GRID ── */}
      <motion.div 
         initial={{ opacity: 0, y: 15 }} 
         animate={{ opacity: 1, y: 0 }} 
         transition={{ duration: 0.5, staggerChildren: 0.1 }} 
        className="relative z-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-stretch gap-5 lg:gap-6 mb-6"
      >
        
        {/* Profile Identity Card */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }} 
           animate={{ opacity: 1, y: 0 }} 
          className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-5 lg:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col text-center h-full min-h-[290px]"
        >
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative mb-5">
              <div className="w-20 h-20 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-full border-[3px] border-white shadow-md overflow-hidden flex items-center justify-center text-xl font-black text-slate-400 tracking-tight">
                 {avatarUrl ? (
                   <img src={avatarUrl} alt="User avatar" className="w-full h-full object-contain bg-slate-100" />
                 ) : (
                   initials
                 )}
              </div>
              <div className="absolute bottom-0 right-0 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm border border-slate-100">
                <BadgeCheck size={16} className="text-blue-500 fill-blue-50" />
              </div>
            </div>
            <h2 className="text-lg font-black text-slate-900 mb-1 tracking-tight">{fullName}</h2>
            <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Verified Gig Driver</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black tracking-wide">{accountLevel} Tier</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black tracking-wide">{kycStatusLabel}</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 font-bold tracking-tight">{locationQuery}</p>
            <div className="mt-3 w-full rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 grid grid-cols-2 gap-x-3 gap-y-2 text-left">
              <div>
                <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em]">Company</p>
                <p className="text-[11px] font-bold text-slate-700 truncate">{primaryCompany}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em]">Partner ID</p>
                <p className="text-[11px] font-bold text-slate-700 truncate">{partnerRef}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em]">Service Zone</p>
                <p className="text-[11px] font-bold text-slate-700 truncate">{serviceZone}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em]">City</p>
                <p className="text-[11px] font-bold text-slate-700 truncate">{serviceCity}</p>
              </div>
            </div>
          </div>
          
          <div className="w-full flex justify-between px-2 border-t border-slate-100/60 pt-4 mt-4">
            <div className="text-left">
               <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em] mb-1">KYC Progress</p>
               <p className="text-[13px] font-bold text-slate-900 tracking-tight">{completionProps.percentage}%</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em] mb-1">Apps Linked</p>
              <p className="text-[13px] font-bold text-slate-900 tracking-tight">{linkedAppsCount}</p>
            </div>
          </div>
        </motion.div>

        {/* Protected Income Floor */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }} 
           animate={{ opacity: 1, y: 0 }} 
           transition={{ delay: 0.1 }}
            className="bg-slate-900 rounded-[2rem] p-5 lg:p-6 shadow-[0_20px_50px_rgba(15,23,42,0.15)] text-white flex flex-col justify-between relative overflow-hidden group h-full min-h-[290px]"
        >
          {/* Subtle animated card reflection */}
          <div className="absolute inset-0 bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] uppercase font-black tracking-[0.2em] flex items-center gap-1.5">
                 <Wallet size={12} strokeWidth={2.5}/> Guaranteed Floor
              </span>
              <span className={`px-2.5 py-1 rounded-md border text-[9px] font-black uppercase tracking-[0.15em] ${
                isKycComplete
                  ? "bg-white/5 border-white/10 text-slate-300"
                  : "bg-amber-500/10 border-amber-400/30 text-amber-300"
              }`}>
                {isKycComplete ? "Auto-Claim On" : "Wallet Locked"}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Available Buffer</p>
            <div className="flex items-end gap-3 mb-3">
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight">{formattedIncome}</h2>
              <span className="text-[12px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md mb-2 flex items-center gap-1">
                <TrendingUp size={14} /> 12%
              </span>
            </div>

            {!isKycComplete && (
              <div className="mb-3 rounded-xl border border-amber-300/20 bg-amber-400/10 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">KYC Required</p>
                  <p className="text-[11px] font-black text-amber-100">{completionProps.percentage}%</p>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-300"
                    style={{ width: `${completionProps.percentage}%` }}
                  />
                </div>
                <button
                  onClick={() => router.push("/dashboard/profile/kyc")}
                  className="mt-3 w-full rounded-lg bg-amber-300 text-slate-900 text-[11px] font-black py-2 hover:bg-amber-200 transition-colors"
                >
                  {completionProps.percentage > 0 ? "Resume KYC to Unlock Wallet" : "Start KYC to Unlock Wallet"}
                </button>
              </div>
            )}
            {isKycComplete && (
              <button
                onClick={() => router.push("/dashboard/wallet")}
                className="mb-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-200 hover:bg-white/10 transition-colors"
              >
                Manage KYC in Wallet
              </button>
            )}

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-2">
                <p className="text-[8px] uppercase tracking-[0.15em] font-black text-slate-400">Daily Buffer</p>
                <p className="text-[11px] font-black text-white truncate">{formattedIncome}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-2">
                <p className="text-[8px] uppercase tracking-[0.15em] font-black text-slate-400">Weekly Avg</p>
                <p className="text-[11px] font-black text-white truncate">{weeklyIncomeLabel}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-2 py-2">
                <p className="text-[8px] uppercase tracking-[0.15em] font-black text-slate-400">Hours / Week</p>
                <p className="text-[11px] font-black text-white truncate">{workingHoursLabel}</p>
              </div>
            </div>
            
            {/* Visual Bar Chart Mockup */}
            <div className="flex items-end gap-2 h-12 w-full opacity-80 mt-auto mb-4">
               <div className="w-1/6 bg-white/10 hover:bg-white/20 transition-colors rounded-t-sm h-[30%]" />
               <div className="w-1/6 bg-white/10 hover:bg-white/20 transition-colors rounded-t-sm h-[45%]" />
               <div className="w-1/6 bg-white/10 hover:bg-white/20 transition-colors rounded-t-sm h-[20%]" />
               <div className="w-1/6 bg-emerald-500/80 hover:bg-emerald-400 transition-colors rounded-t-sm h-[80%] shadow-[0_0_15px_rgba(16,185,129,0.5)] relative">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-black text-emerald-300 tracking-widest">+₹850</div>
               </div>
               <div className="w-1/6 bg-white/10 hover:bg-white/20 transition-colors rounded-t-sm h-[60%]" />
               <div className="w-1/6 bg-white/10 hover:bg-white/20 transition-colors rounded-t-sm h-[50%]" />
            </div>
          </div>

          <div className="flex gap-3 relative z-10 w-full shrink-0">
            <button
              disabled={!isKycComplete}
              className={`flex-1 py-3.5 rounded-2xl font-black text-[13px] transition-colors border backdrop-blur-md ${
                isKycComplete
                  ? "bg-white/10 hover:bg-white/15 text-white border-white/5"
                  : "bg-white/5 text-slate-400 border-white/10 cursor-not-allowed"
              }`}
            >
              Withdraw
            </button>
            <button
              disabled={!isKycComplete}
              className={`flex-1 shrink-0 px-6 py-3.5 rounded-2xl font-black text-[13px] transition-colors ${
                isKycComplete
                  ? "bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  : "bg-emerald-900/40 text-emerald-200/40 cursor-not-allowed"
              }`}
            >
              Auto-Claim
            </button>
          </div>
        </motion.div>

        {/* Coverage Active Status */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }} 
           animate={{ opacity: 1, y: 0 }} 
           transition={{ delay: 0.2 }}
          className="lg:col-span-2 xl:col-span-1 bg-white/80 backdrop-blur-2xl rounded-[2rem] p-5 lg:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col h-full min-h-[290px]"
        >
          <div className="flex flex-col flex-1">
            <div className="flex justify-between items-start mb-5">
              <span className="bg-blue-50 text-blue-600 text-[9px] uppercase font-black tracking-[0.2em] px-3 py-1.5 rounded-lg border border-blue-100/50">
                 Active Status
              </span>
              <Activity size={20} className="text-blue-500" />
            </div>
            <p className="text-xs text-slate-500 font-bold tracking-wide leading-relaxed break-words">
              Current Location
            </p>
            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{displayedLocation}</h2>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-100 h-[180px] sm:h-[205px] xl:h-[220px]">
              <iframe
                title="User GPS Location"
                src={mapSrc}
                className="absolute inset-0 h-full w-full border-0"
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            
            <button 
               onClick={handleCheckRisk}
               disabled={isScanningRisk}
               className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-black tracking-tight px-6 py-4 rounded-xl transition-all shadow-[0_10px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 text-[14px] flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-70 disabled:pointer-events-none"
            >
               {isScanningRisk ? (
                  <><Loader2 size={18} className="animate-spin" /> Uplinking to AI...</>
               ) : (
                  <><MapPin size={18} /> Ping Local AI Radar</>
               )}
            </button>
            
          </div>
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center w-full pt-5 mt-5 border-t border-slate-100/60 text-[13px] font-black tracking-tight text-blue-600 hover:text-blue-700 transition-colors group"
          >
            Open In Google Maps
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

      </motion.div>



      {/* ── INTELLIGENCE FEED & HISTORY ── */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4 }}
        className="relative z-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-10"
      >
        
        {/* Recent Disruption Payouts */}
        <div className="lg:col-span-2 xl:col-span-2 bg-white/80 backdrop-blur-2xl rounded-[2rem] p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col h-full hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-shadow duration-500">
          <div className="flex justify-between items-end mb-8">
            <div>
               <div className="flex items-center gap-2 mb-1">
                 <HistoryIcon size={16} className="text-slate-400" />
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Buffer Payouts</h2>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-6">History of earnings protected automatically.</p>
            </div>
            <button className="text-xs font-black tracking-tight text-slate-500 hover:text-slate-900 transition-colors py-2.5 px-5 rounded-xl border border-slate-200/60 bg-slate-50 hover:bg-slate-100/50 shadow-sm">
              Download Log
            </button>
          </div>
          
          <div className="w-full">
            {/* Elegant List Headers */}
            <div className="grid grid-cols-4 px-4 py-3 bg-slate-50/50 rounded-xl text-[9px] uppercase tracking-[0.2em] font-black text-slate-400 mb-4 border border-slate-100/50">
              <div className="col-span-1">Disruption Event</div>
              <div className="col-span-1 text-center">Amount Secured</div>
              <div className="col-span-1 text-center">Timestamp</div>
              <div className="col-span-1 text-right">Status</div>
            </div>

            <div className="space-y-3">
              {/* Event 1 */}
              <div className="grid grid-cols-4 items-center px-4 py-4 border border-slate-100/60 bg-white rounded-2xl hover:border-slate-300/50 hover:shadow-sm transition-all cursor-default">
                <div className="col-span-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50 text-blue-500">
                     <CloudRain size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-slate-900 tracking-tight">Monsoon Downpour</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Velocity -40%</p>
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[15px] font-black text-slate-900 tracking-tight">+₹300.00</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Today</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">14:22 PM</p>
                </div>
                <div className="col-span-1 flex justify-end">
                  <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-lg border border-emerald-100/50 shadow-sm">
                    Credited
                  </span>
                </div>
              </div>

              {/* Event 2 */}
              <div className="grid grid-cols-4 items-center px-4 py-4 border border-slate-100/60 bg-white rounded-2xl hover:border-slate-300/50 hover:shadow-sm transition-all cursor-default">
                <div className="col-span-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100/50 text-orange-500">
                     <Construction size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-slate-900 tracking-tight">Route Obstruction</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Detour +45m</p>
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[15px] font-black text-slate-900 tracking-tight">+₹150.00</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Yesterday</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">09:15 AM</p>
                </div>
                <div className="col-span-1 flex justify-end">
                  <span className="flex items-center gap-1.5 bg-slate-50 text-slate-500 text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-lg border border-slate-200/50 shadow-sm">
                    Processing
                  </span>
                </div>
              </div>

              {/* Event 3 */}
              <div className="grid grid-cols-4 items-center px-4 py-4 border border-slate-100/60 bg-white rounded-2xl hover:border-slate-300/50 hover:shadow-sm transition-all cursor-default opacity-80">
                <div className="col-span-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100/50 text-red-500">
                     <Flame size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-slate-900 tracking-tight">Extreme Heatwave</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Safety AI Protocol</p>
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[15px] font-black text-slate-900 tracking-tight">+₹450.00</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Oct 12</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">16:45 PM</p>
                </div>
                <div className="col-span-1 flex justify-end">
                   <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-lg border border-emerald-100/50 shadow-sm">
                    Credited
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Brief */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col relative overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-shadow duration-500">
          
          <div className="mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">Intelligence Brief</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next 24 Hours</p>
          </div>
          
          <div className="space-y-6 flex-1">
            
            {/* Intel 1 */}
            <div className="flex gap-4 relative">
               <div className="absolute left-5 top-10 bottom-[-24px] w-px bg-slate-100" />
               <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50 relative z-10 text-indigo-500">
                <CloudRain size={16} strokeWidth={2.5} />
               </div>
               <div className="pt-1">
                <h3 className="text-[13px] font-black text-slate-900 mb-1 tracking-tight">Storm Cell Approaching</h3>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-2">
                  High probability of extreme weather between 4PM - 8PM. Base earning rates buffered automatically.
                </p>
               </div>
            </div>

            {/* Intel 2 */}
            <div className="flex gap-4 relative">
               <div className="absolute left-5 top-10 bottom-[-24px] w-px bg-slate-100" />
               <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100/50 relative z-10 text-orange-500">
                <Construction size={16} strokeWidth={2.5} />
               </div>
               <div className="pt-1">
                <h3 className="text-[13px] font-black text-slate-900 mb-1 tracking-tight">Main Arterial Blocked</h3>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-2">
                  Major congestion projected on I-95 south. Algorithmic detours active; delays buffered.
                </p>
               </div>
            </div>

            {/* Intel 3 */}
            <div className="flex gap-4 relative">
               <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100/50 relative z-10 text-emerald-600">
                <ShieldCheck size={16} strokeWidth={2.5} />
               </div>
               <div className="pt-1">
                <h3 className="text-[13px] font-black text-slate-900 mb-1 tracking-tight">Vault Secure</h3>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-2">
                  All weekly targets met and guaranteed. Liquidity withdrawal requested successfully.
                </p>
               </div>
            </div>

          </div>
          
          <button className="w-full mt-auto py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 rounded-xl text-sm font-black tracking-tight transition-colors shadow-sm focus:ring-4 focus:ring-slate-100">
            Configure Radars
          </button>
        </div>

      </motion.div>

      {/* ── SUCCESS TOAST ── */}
      <AnimatePresence>
         {showSafeToast && (
            <motion.div 
               initial={{ opacity: 0, y: 50, scale: 0.9 }} 
               animate={{ opacity: 1, y: 0, scale: 1 }} 
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 font-bold text-sm whitespace-nowrap"
            >
               <CheckCircle2 size={18} className="text-emerald-400" />
               Processed successfully. Conditions evaluated. 
            </motion.div>
         )}
      </AnimatePresence>

      {/* ── EMERGENCY VOTING MODAL ── */}
      <AnimatePresence>
         {showVotingModal && (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
            >
               <motion.div 
                  initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                  className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl border border-white relative overflow-hidden"
               >
                  <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-red-400/10 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                     <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 shrink-0">
                        <CloudRain size={24} strokeWidth={2.5} />
                     </div>
                     <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100/50 inline-block mb-1">Alert Triggered</div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Disruption Detected</h2>
                     </div>
                  </div>

                  <p className="text-[14px] text-slate-600 font-medium mb-8 leading-relaxed relative z-10">
                     Our AI systems have detected a <strong className="text-red-500 font-black">{scanResult?.ai_analysis?.safety_probability}% danger probability</strong> localized at your coordinates due to extreme weather metrics ("{scanResult?.ai_analysis?.risk_level}"). 
                     <br/><br/>
                     Are you currently experiencing hazardous conditions on your deliveries?
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                     <button 
                        onClick={() => submitCrowdVote(true)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black tracking-tight py-4 rounded-xl transition-colors shadow-lg shadow-red-500/20"
                     >
                        Confirm Hazard
                     </button>
                     <button 
                        onClick={() => submitCrowdVote(false)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black tracking-tight py-4 rounded-xl transition-colors border border-slate-200/50"
                     >
                        False Alarm
                     </button>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

    </div>
  );
}
