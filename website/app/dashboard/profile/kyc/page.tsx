"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  Camera,
  X,
  CheckCircle2,
  ShieldAlert,
  Fingerprint,
  Lock,
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

import { getKycData, saveKycData, calculateKycCompletion, IKycCompany, uploadKycDocument, saveKycPhotoCapture } from "../../../../(services)/kyc";
import { withCacheBust } from "@/lib/avatar";
import { getScopedLocalStorageItem, setScopedLocalStorageItem } from "@/lib/clientStorage";

const INVALID_SCREENSHOT_PLACEHOLDERS = new Set([
  "uploaded_file.png",
  "screenshot_secured.png",
]);

function normalizeDashboardScreenshotRef(value: unknown): string {
  if (typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  const withoutQuery = trimmed.split("?")[0]?.trim() || "";
  if (INVALID_SCREENSHOT_PLACEHOLDERS.has(withoutQuery)) return "";

  if (
    trimmed.startsWith("/uploads/kyc/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:image/")
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("uploads/kyc/")) {
    return `/${trimmed}`;
  }

  return "";
}

function KycProcessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasHydratedRef = useRef(false);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isResolvingPopulation, setIsResolvingPopulation] = useState(false);
  const [populationLookupError, setPopulationLookupError] = useState("");
  const [resolvedPopulation, setResolvedPopulation] = useState<number | null>(null);
  const [resolvedServiceZone, setResolvedServiceZone] = useState("");
  const [resolvedCityName, setResolvedCityName] = useState("");

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
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [uploadingCompanyId, setUploadingCompanyId] = useState<string | null>(null);

  const validation = useMemo(() => {
    const aadhaarDigits = kycData.aadhaar.replace(/\D/g, "");
    const panValue = kycData.pan.toUpperCase().trim();
    const locationValue = kycData.location.trim();
    const ageValue = Number(kycData.age);
    const incomeValue = Number(kycData.avgWeeklyIncome);
    const hoursValue = Number(kycData.avgWorkingHours);

    return {
      aadhaarOk: /^\d{12}$/.test(aadhaarDigits),
      panOk: /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panValue),
      ageOk: Number.isInteger(ageValue) && ageValue >= 18 && ageValue <= 99,
      locationOk: /^[A-Za-z0-9][A-Za-z0-9,./\-\s]{1,63}$/.test(locationValue),
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
        const saved = getScopedLocalStorageItem("survivalLensKyc");
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
                 dashboardScreenshot: normalizeDashboardScreenshotRef(legacyScreenshot),
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
             dashboardScreenshot: normalizeDashboardScreenshotRef(c.dashboardScreenshot),
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

          const savedPopulation = Number(parsed.population);
          const savedZone = typeof parsed.serviceZone === "string"
            ? parsed.serviceZone.trim()
            : typeof parsed.zone === "string"
              ? parsed.zone.trim()
              : "";

          if (Number.isFinite(savedPopulation) && savedPopulation > 0) {
            setResolvedPopulation(savedPopulation);
          }
          if (savedZone) {
            setResolvedServiceZone(savedZone);
          }
        } catch (_e) {
           
          setCompanies([{ id: Date.now().toString(), category: "", company: "", partnerId: "", dashboardScreenshot: "", verified: false }]);
        }
      } else {
          
         setCompanies([{ id: Date.now().toString(), category: "", company: "", partnerId: "", dashboardScreenshot: "", verified: false }]);
      }
      
      setIsMounted(true);
      setIsLoading(false);
      hasHydratedRef.current = true;
    };

    fetchData();
  }, []);

  // Completion Percentage safely checks entire companies mappings naturally
  const completionProps = useMemo(() => calculateKycCompletion(kycData, companies), [kycData, companies]);
  const profileSource = searchParams.get("source") === "profile";
  const overviewSource = searchParams.get("source") === "overview";
  const incompleteFocus = searchParams.get("focus") === "incomplete";
  const isKycApproved = kycData.status === "approved";

  const missingRequirements = useMemo(() => {
    const items: string[] = [];

    if (!validation.aadhaarOk) items.push("Aadhaar");
    if (!validation.panOk) items.push("PAN");
    if (!validation.ageOk) items.push("Age");
    if (!validation.locationOk) items.push("Location");
    if (!validation.incomeOk) items.push("Weekly Income");
    if (!validation.hoursOk) items.push("Weekly Hours");
    if (!validation.categoryOk) items.push("Category");
    if (!validation.photoOk) items.push("Live Photo");
    if (!validation.companyOk) items.push("Company");
    if (!validation.partnerOk) items.push("Partner ID");
    if (!validation.screenshotOk) items.push("Dashboard Proof");

    return items;
  }, [validation]);

  const completedPlatforms = useMemo(
    () =>
      companies.filter(
        (company) =>
          Boolean(company.company.trim()) &&
          company.partnerId.trim().length >= 4 &&
          Boolean(company.dashboardScreenshot)
      ).length,
    [companies]
  );

  const buildKycPayload = () => {
    const formattedCompanies = companies
      .filter((c) => globalCategory && c.company)
      .map((c) => ({
        category: globalCategory,
        company: c.company,
        partnerId: c.partnerId,
        dashboardScreenshot: normalizeDashboardScreenshotRef(c.dashboardScreenshot),
      }));

    const currentStatus = isKycApproved ? "approved" : isBasicKycReady ? "approved" : "partial";
    const zoneValue = resolvedServiceZone || "";
    const populationValue = resolvedPopulation ?? undefined;

    return {
      payloadToSave: {
        ...kycData,
        city: kycData.location,
        location: kycData.location,
        serviceZone: zoneValue,
        zone: zoneValue,
        population: populationValue,
        status: currentStatus,
        companies: formattedCompanies,
      },
      savePayload: {
        aadhaar: kycData.aadhaar,
        pan: kycData.pan,
        city: kycData.location,
        location: kycData.location,
        serviceZone: zoneValue,
        zone: zoneValue,
        population: populationValue,
        age: parseInt(kycData.age) || undefined,
        avgWeeklyIncome: parseInt(kycData.avgWeeklyIncome) || undefined,
        avgWorkingHours: parseInt(kycData.avgWorkingHours) || undefined,
        companies: formattedCompanies as IKycCompany[],
      },
    };
  };

  const persistKycDraft = async () => {
    if (!hasHydratedRef.current) return;

    const { payloadToSave, savePayload } = buildKycPayload();
    setScopedLocalStorageItem("survivalLensKyc", JSON.stringify(payloadToSave));

    try {
      await saveKycData(savePayload);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isLoading && kycData.status === "approved" && !profileSource && !overviewSource) {
      router.replace("/dashboard/profile");
    }
  }, [isLoading, kycData.status, profileSource, overviewSource, router]);

  useEffect(() => {
    if (!incompleteFocus) return;

    const element = document.getElementById("kyc-incomplete-focus");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [incompleteFocus]);

  useEffect(() => {
    if (!hasHydratedRef.current || isLoading) return;

    if (persistTimerRef.current) {
      clearTimeout(persistTimerRef.current);
    }

    persistTimerRef.current = setTimeout(() => {
      void persistKycDraft();
    }, 350);

    return () => {
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
      }
    };
  }, [kycData, companies, globalCategory, resolvedServiceZone, resolvedPopulation, isLoading]);

  // Unified save handler parsing local vs. remote arrays seamlessly
  const handleSaveKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    const { payloadToSave, savePayload } = buildKycPayload();

    if (kycData.photo) {
      syncAvatarPhoto(kycData.photo);
    }
    
    setScopedLocalStorageItem("survivalLensKyc", JSON.stringify(payloadToSave));
    
    try {
      await saveKycData(savePayload);
    } catch (err) {
      console.error(err);
    }
    
    router.push("/dashboard/profile");
  };

  const handleChange = (field: string, value: string) => {
    if (isKycApproved && (field === "aadhaar" || field === "pan")) {
      return;
    }

    let nextValue = value;

    if (field === "aadhaar" || field === "age" || field === "avgWeeklyIncome" || field === "avgWorkingHours") {
      nextValue = value.replace(/\D/g, "");
    }

    if (field === "pan") {
      nextValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    }

    if (field === "location") {
      setPopulationLookupError("");
    }

    setKycData(prev => ({ ...prev, [field]: nextValue }));
  };

  useEffect(() => {
    const cityValue = kycData.location.trim();

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
        const params = new URLSearchParams({ city: cityValue, country: "IN" });
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
  }, [kycData.location]);

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
    setCompanies(prev => {
      const nextCompanies = prev.filter(c => c.id !== id);
      return nextCompanies.length > 0
        ? nextCompanies
        : [{ id: Date.now().toString(), category: globalCategory, company: "", partnerId: "", dashboardScreenshot: "", verified: false }];
    });
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const openCamera = async () => {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not supported on this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraOpen(true);

      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to access camera";
      setCameraError(message);
      stopCameraStream();
    }
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    stopCameraStream();
  };

  const handleProfilePhotoUpload = async (file: File) => {
    if (!file) return;

    setIsPhotoUploading(true);
    try {
      const result = await saveKycPhotoCapture(file);
      const nextPhoto = withCacheBust(result.kyc?.photo, result.kyc?.updatedAt);
      setKycData((prev) => ({ ...prev, photo: nextPhoto }));
      syncAvatarPhoto(nextPhoto);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload profile photo";
      alert(message);
    } finally {
      setIsPhotoUploading(false);
    }
  };

  const handleCaptureFromCamera = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setCameraError("Camera preview is not ready yet.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      setCameraError("Unable to capture photo. Please try again.");
      return;
    }

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError("Unable to process captured frame.");
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.92);
    });

    if (!blob) {
      setCameraError("Failed to capture image. Please retry.");
      return;
    }

    const capturedFile = new File([blob], `kyc_profile_${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    await handleProfilePhotoUpload(capturedFile);
    closeCamera();
  };

  const syncAvatarPhoto = (photoDataUrl: string) => {
    setScopedLocalStorageItem("survivalLensAvatar", photoDataUrl);

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    try {
      const parsed = JSON.parse(storedUser);
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...parsed,
          avatarUrl: photoDataUrl,
        })
      );
    } catch {
      // Ignore malformed cached user state.
    }
  };

  const handleCompanyScreenshotUpload = async (id: string, file: File | null) => {
    if (!file) return;

    setUploadingCompanyId(id);
    try {
      const result = await uploadKycDocument(file, "dashboardScreenshot");
      const normalizedUrl = normalizeDashboardScreenshotRef(result.url);
      updateCompany(id, "dashboardScreenshot", withCacheBust(normalizedUrl));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload screenshot";
      alert(message);
    } finally {
      setUploadingCompanyId(null);
    }
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
             Complete your KYC once and keep your work profile verified across all linked gig platforms.
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

      <div className="relative z-10 mb-8 rounded-[2rem] border border-slate-200 bg-white/90 p-5 lg:p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Verification Status</p>
            <div className="mt-2 flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] border ${
                  isKycApproved
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {isKycApproved ? <CheckCircle2 size={12} /> : <ShieldAlert size={12} />}
                {isKycApproved ? "Approved" : "Incomplete"}
              </span>
              {!isKycApproved && (
                <span className="text-xs font-bold text-slate-500">
                  {missingRequirements.length} requirement{missingRequirements.length === 1 ? "" : "s"} pending
                </span>
              )}
            </div>
          </div>

          {!isKycApproved && missingRequirements.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {missingRequirements.slice(0, 5).map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-600">
                  {item}
                </span>
              ))}
              {missingRequirements.length > 5 && (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-600">
                  +{missingRequirements.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Form Completion</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{completionProps.percentage}%</p>
          <p className="text-[11px] font-bold text-slate-500 mt-1">{completionProps.filledFields}/{completionProps.totalFields} fields done</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Linked Platforms</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{completedPlatforms}/{companies.length}</p>
          <p className="text-[11px] font-bold text-slate-500 mt-1">cards fully completed</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Pending Items</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{missingRequirements.length}</p>
          <p className="text-[11px] font-bold text-slate-500 mt-1">finish these to submit KYC</p>
        </div>
      </div>

      {incompleteFocus && !isKycApproved && (
        <div
          id="kyc-incomplete-focus"
          className="relative z-10 mb-8 rounded-[2rem] border border-amber-200 bg-amber-50/90 p-5 lg:p-6 shadow-[0_10px_30px_rgba(251,191,36,0.08)]"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700 border border-amber-200">
                <ShieldAlert size={12} /> Incomplete KYC
              </div>
              <h2 className="mt-3 text-xl font-black text-slate-900 tracking-tight">Finish the highlighted requirements below</h2>
              <p className="mt-1 text-sm font-medium text-amber-900/80 leading-relaxed">
                You opened this page from the overview warning. The missing items are highlighted here so you can complete them without hunting through the form.
              </p>
            </div>

            {missingRequirements.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-white/80 p-4 min-w-[260px]">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-700 mb-3">Missing items</p>
                <div className="flex flex-wrap gap-2">
                  {missingRequirements.map((item) => (
                    <span key={item} className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-black text-amber-800 border border-amber-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <motion.form 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative z-10 space-y-10"
        onSubmit={handleSaveKyc}
      >
        {/* ── BASIC KYC FIELDS ── */}
        <div className="bg-white/85 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-slate-100">
          <div className="mb-8 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Personal Identity</h2>
            <p className="mt-1 text-[12px] font-semibold text-slate-500">Match these fields exactly with your official documents and active work profile.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Aadhaar ID</label>
              <div className="relative">
                <input
                  type="text"
                  value={kycData.aadhaar}
                  onChange={e => handleChange('aadhaar', e.target.value)}
                  maxLength={12}
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  disabled={isKycApproved}
                  className={`w-full px-5 py-4 bg-slate-50/80 border focus:bg-white focus:ring-4 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none ${isKycApproved ? 'border-emerald-200 bg-emerald-50/60 text-slate-500 cursor-not-allowed pr-14' : validation.aadhaarOk || !kycData.aadhaar ? 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10' : 'border-red-200 focus:border-red-500 focus:ring-red-500/10'}`}
                />
                {isKycApproved && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-700 border border-emerald-200">
                    <Lock size={10} /> Locked
                  </span>
                )}
              </div>
              <p className={`mt-2 text-[11px] font-bold ${isKycApproved ? 'text-emerald-600' : validation.aadhaarOk || !kycData.aadhaar ? 'text-slate-400' : 'text-red-500'}`}>
                {isKycApproved ? 'Aadhaar is locked after KYC approval.' : 'Required: exactly 12 digits, numbers only.'}
              </p>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">PAN Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={kycData.pan}
                  onChange={e => handleChange('pan', e.target.value)}
                  maxLength={10}
                  placeholder="ABCDE1234F"
                  disabled={isKycApproved}
                  className={`w-full px-5 py-4 bg-slate-50/80 border focus:bg-white focus:ring-4 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none uppercase ${isKycApproved ? 'border-emerald-200 bg-emerald-50/60 text-slate-500 cursor-not-allowed pr-14' : validation.panOk || !kycData.pan ? 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10' : 'border-red-200 focus:border-red-500 focus:ring-red-500/10'}`}
                />
                {isKycApproved && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-700 border border-emerald-200">
                    <Lock size={10} /> Locked
                  </span>
                )}
              </div>
              <p className={`mt-2 text-[11px] font-bold ${isKycApproved ? 'text-emerald-600' : validation.panOk || !kycData.pan ? 'text-slate-400' : 'text-red-500'}`}>
                {isKycApproved ? 'PAN is locked after KYC approval.' : validation.panOk ? "PAN verified: format matched." : "Required: 10 characters in PAN format (AAAAA1234A)."}
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Age</label>
              <input type="number" min={18} max={99} value={kycData.age} onChange={e => handleChange('age', e.target.value)} placeholder="e.g. 28" className={`w-full px-5 py-4 bg-slate-50/80 border focus:bg-white focus:ring-4 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none ${validation.ageOk || !kycData.age ? 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10' : 'border-red-200 focus:border-red-500 focus:ring-red-500/10'}`} />
              <p className={`mt-2 text-[11px] font-bold ${validation.ageOk || !kycData.age ? 'text-slate-400' : 'text-red-500'}`}>Required: 18 years or older.</p>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">City / Location</label>
              <input
                type="text"
                value={kycData.location}
                onChange={e => handleChange('location', e.target.value)}
                maxLength={64}
                placeholder="e.g. Hyderabad, Telangana"
                className={`w-full px-5 py-4 bg-slate-50/80 border focus:bg-white focus:ring-4 rounded-2xl text-[14px] font-black text-slate-900 placeholder-slate-300 transition-all outline-none ${validation.locationOk || !kycData.location ? 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10' : 'border-red-200 focus:border-red-500 focus:ring-red-500/10'}`}
              />
              <p className={`mt-2 text-[11px] font-bold ${validation.locationOk || !kycData.location ? 'text-slate-400' : 'text-red-500'}`}>
                Required: enter a valid city/location using letters or numbers.
              </p>
              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Auto Service Zone</p>
                <p className="mt-1 text-[12px] font-black text-slate-800">{resolvedServiceZone || "Not detected yet"}</p>
                {resolvedPopulation !== null && (
                  <p className="mt-1 text-[11px] font-bold text-slate-600">
                    Population: {new Intl.NumberFormat("en-IN").format(resolvedPopulation)}
                  </p>
                )}
                {isResolvingPopulation && (
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-blue-600">Resolving location population...</p>
                )}
                {!isResolvingPopulation && resolvedCityName && (
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Matched city: {resolvedCityName}</p>
                )}
                {populationLookupError && (
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-amber-600">{populationLookupError}</p>
                )}
              </div>
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

            <div className="md:col-span-2 border-t border-slate-100 pt-8 mt-2 space-y-4">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Live Photo Evidence</label>
               <div className={`w-full rounded-2xl border-2 border-dashed transition-all px-4 py-5 ${kycData.photo ? "border-emerald-500 bg-emerald-50/50 text-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-slate-300 bg-slate-50/50 text-slate-400"}`}>
                 {kycData.photo ? (
                   <img src={kycData.photo} alt="Captured profile" className="w-28 h-28 rounded-2xl object-cover border border-emerald-200 mx-auto mb-4" />
                 ) : null}
                 <button
                   type="button"
                   onClick={() => void openCamera()}
                   className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black tracking-tight ${kycData.photo ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700"}`}
                 >
                 {isPhotoUploading ? (
                   <><Loader2 size={18} className="animate-spin" /> Uploading photo...</>
                 ) : kycData.photo ? (
                   <><Camera size={18} /> Retake Live Photo</>
                 ) : (
                   <><Camera size={18} /> Open Camera for Live Capture</>
                 )}
                 </button>
               </div>
              <p className={`mt-2 text-[11px] font-bold ${validation.photoOk ? 'text-slate-400' : 'text-red-500'}`}>Required: photo evidence must be attached.</p>
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Camera capture only. Gallery/file upload is disabled for profile photo.</p>
            </div>
          </div>
        </div>

        {/* ── COMPANIES SECTION ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pl-4 pr-2">
             <div>
               <h2 className="text-xl font-bold text-slate-900">Affiliated Platforms</h2>
               <p className="text-[12px] font-semibold text-slate-500 mt-1">Add each active gig account with partner ID and dashboard proof.</p>
             </div>
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
                {(() => {
                  const companyComplete =
                    Boolean(company.company.trim()) &&
                    company.partnerId.trim().length >= 4 &&
                    Boolean(company.dashboardScreenshot);

                  return (
                    <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">Platform Card Progress</p>
                        <p className="text-[12px] font-bold text-slate-700 mt-1">{companyComplete ? "Ready for submission" : "Missing one or more required fields"}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] border ${companyComplete ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                        {companyComplete ? <CheckCircle2 size={12} /> : <ShieldAlert size={12} />}
                        {companyComplete ? "Complete" : "Pending"}
                      </span>
                    </div>
                  );
                })()}

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
                     {company.dashboardScreenshot ? (
                       <img
                         src={company.dashboardScreenshot}
                         alt="Platform dashboard proof"
                         className="w-full max-h-48 object-cover rounded-2xl border border-emerald-200 mb-3"
                       />
                     ) : null}
                     <label className={`w-full flex items-center justify-center gap-2 py-6 rounded-2xl border-2 border-dashed transition-all font-black tracking-tight cursor-pointer ${company.dashboardScreenshot ? "border-emerald-500 bg-emerald-50/50 text-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-slate-300 bg-slate-50/50 text-slate-400 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"}`}>
                       <input
                         type="file"
                         accept="image/png,image/jpeg,image/webp"
                         className="hidden"
                         onChange={(e) => {
                           const file = e.target.files?.[0] || null;
                           void handleCompanyScreenshotUpload(company.id, file);
                           e.currentTarget.value = "";
                         }}
                       />
                       {uploadingCompanyId === company.id ? (
                         <><Loader2 size={18} className="animate-spin" /> Uploading screenshot...</>
                       ) : company.dashboardScreenshot ? (
                         <><CheckCircle2 size={18} /> Earnings Screenshot Secured</>
                       ) : (
                         <><UploadCloud size={18} /> Upload Authentic Gig History Proof</>
                       )}
                     </label>
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
             Your identity data is saved securely and used only for verification, eligibility checks, and payout protection features.
           </p>
           
           <button 
              disabled={isLoading || (!isBasicKycReady && !isKycApproved)}
              type="submit" 
              className={`w-full md:w-auto px-10 font-black py-4 rounded-2xl shadow-xl shadow-slate-900/10 transition-all text-sm group flex items-center justify-center gap-2 ${
                (isBasicKycReady || isKycApproved) && !isLoading
                  ? 'bg-slate-900 hover:bg-black text-white hover:-translate-y-0.5'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
            {isKycApproved
              ? "Save Profile Updates"
              : isBasicKycReady
                ? "Submit KYC"
                : "Complete All Required Fields"}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.form>

      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-950 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-200">Capture Live Photo</h3>
              <button
                type="button"
                onClick={closeCamera}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto" />
            </div>

            {cameraError && <p className="mt-3 text-[11px] font-bold text-red-400">{cameraError}</p>}

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeCamera}
                className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-[0.12em] border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleCaptureFromCamera()}
                disabled={isPhotoUploading}
                className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-[0.12em] bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPhotoUploading ? "Saving..." : "Capture & Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default function KycProcessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-slate-400">
         <Loader2 className="animate-spin mr-3" size={24} /> Loading...
      </div>
    }>
      <KycProcessContent />
    </Suspense>
  );
}
