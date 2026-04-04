"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Info, Star, Cloud, Network, 
  ArrowRight, ShieldCheck, Zap, Activity,
  Lock, Wallet, Calendar, CheckCircle
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getKycData } from "@/(services)/kyc";
import { getSubscription, paySubscription } from "@/(services)/subscription";
import { getPricing, selectPricingPlan } from "@/(services)/pricing";

type SubscriptionData = {
  planAmount: number;
  planName: string;
  totalPayments: number;
  duePayments: number;
  status: string;
  lastPaymentDate: string | null;
  startDate: string;
};

type PricingPlan = {
  planType: "basic" | "standard" | "premium";
  price: number;
};

export default function PlansPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [kycStatus, setKycStatus] = useState<string>("not_started");
  
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [selectedPlanType, setSelectedPlanType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const initKyc = async () => {
      // Fallback first (visual speed)
      const savedKyc = localStorage.getItem("survivalLensKyc");
      if (savedKyc) {
        try {
          const kycData = JSON.parse(savedKyc);
          if (kycData.status) setKycStatus(kycData.status);
        } catch (e) {}
      }
      
      // Async proper validation
      try {
        const kycData = await getKycData();
        setKycStatus(kycData.status);
        localStorage.setItem("survivalLensKyc", JSON.stringify(kycData));
      } catch (err) {}
    };

    initKyc();
    void Promise.all([fetchSubscription(), fetchPricing()]);
    setIsMounted(true);
  }, []);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const data = await getSubscription();
      setSubscription(data);
    } catch (err) {
      console.error(err);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPricing = async () => {
    try {
      const data = await getPricing();
      setPricingPlans(Array.isArray(data?.plans) ? data.plans : []);
      setSelectedPlanType(data?.selectedPlan?.planType || null);
    } catch (err) {
      console.error(err);
      setPricingPlans([]);
      setSelectedPlanType(null);
    }
  };

  const getPlanPrice = (planType: "basic" | "standard" | "premium", fallback: number) => {
    const matched = pricingPlans.find((plan) => plan.planType === planType);
    return typeof matched?.price === "number" ? matched.price : fallback;
  };

  const handleSelectPlan = async (planType: "basic" | "standard" | "premium") => {
    if (kycStatus !== 'approved') {
      toast.error('You must have an approved KYC to select a plan.');
      return;
    }
    
    setIsProcessing(true);
    try {
      const data = await selectPricingPlan(planType);
      toast.success(`Successfully activated ${data.subscription.planName} plan!`);
      await Promise.all([fetchSubscription(), fetchPricing()]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to select plan';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayWeekly = async () => {
    setIsProcessing(true);
    try {
      const data = await paySubscription();
      toast.success(`Payment successful! Ref: ${data.paymentRef}`);
      await Promise.all([fetchSubscription(), fetchPricing()]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const isKycApproved = kycStatus === 'approved';

  if (!isMounted) return null;

  const paymentInfo = { allowed: true, daysRemaining: 0, nextDate: null as Date | null };
  if (subscription && subscription.lastPaymentDate) {
    const lastDate = new Date(subscription.lastPaymentDate);
    const currentDate = new Date();
    const diffTime = currentDate.getTime() - lastDate.getTime();
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 7);
    
    paymentInfo.nextDate = nextDate;
    if (daysPassed < 7) {
      paymentInfo.allowed = false;
      paymentInfo.daysRemaining = 7 - daysPassed;
    }
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full relative min-h-full">
      <Toaster position="top-right" />

      {/* ── BACKGROUND AMBIENCE ── */}
      <div 
         className="absolute top-[-10%] left-[20%] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none z-0 transition-opacity duration-1000" 
         style={{ width: "clamp(24rem, 45vw, 37.5rem)", height: "clamp(24rem, 45vw, 37.5rem)" }}
      />

      {/* ── HEADER TITLE ── */}
      <div className="relative z-10 max-w-2xl mb-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100/50 flex items-center gap-1.5">
              <ShieldCheck size={12} strokeWidth={3} />
              {subscription ? "Active Coverage" : "Coverage Plans"}
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
             {subscription ? "Your Subscription" : "Select Your Protocol"}
          </h1>
          <p className="text-[15px] text-slate-500 font-medium leading-relaxed max-w-xl">
             {subscription 
              ? "Manage your weekly premiums, check active dues, and ensure algorithmic protection remains seamless." 
              : "Choose the automated environment protection buffer that matches your risk baseline and weekly earnings."}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 relative z-10">
          <div className="animate-spin text-blue-500 w-10 h-10 border-4 border-current border-t-transparent rounded-full" />
        </div>
      ) : subscription ? (
        
        /* ── COVERAGE OVERVIEW UI (STEP 2) ── */
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative z-10 flex flex-col lg:flex-row gap-8 mb-16"
        >
           {/* Primary Status Card */}
           <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 border border-white shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
              <div className="flex justify-between items-start mb-10">
                 <div>
                    <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg inline-block mb-4 
                      ${subscription.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                      {subscription.status}
                    </span>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-1">{subscription.planName} Plan</h2>
                    <p className="text-sm font-bold text-slate-400">Joined {new Date(subscription.startDate).toLocaleDateString()}</p>
                 </div>
                 <div className="text-right">
                    <h3 className="text-3xl font-black text-blue-600 tracking-tight">₹{subscription.planAmount}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Per Week</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                 <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/60">
                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                       <Calendar size={18} strokeWidth={2.5} />
                       <span className="text-[11px] font-bold uppercase tracking-widest">Last Payment</span>
                    </div>
                    <p className="text-lg font-black text-slate-900 tracking-tight">
                       {subscription.lastPaymentDate ? new Date(subscription.lastPaymentDate).toLocaleDateString() : "Never"}
                    </p>
                 </div>
                 <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/60">
                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                       <Calendar size={18} strokeWidth={2.5} />
                       <span className="text-[11px] font-bold uppercase tracking-widest">Next Payment</span>
                    </div>
                    <p className="text-lg font-black text-slate-900 tracking-tight">
                       {paymentInfo.nextDate ? paymentInfo.nextDate.toLocaleDateString() : "Now"}
                    </p>
                 </div>
                 <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/60">
                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                       <Wallet size={18} strokeWidth={2.5} />
                       <span className="text-[11px] font-bold uppercase tracking-widest">Total Made</span>
                    </div>
                    <p className="text-lg font-black text-slate-900 tracking-tight">
                       {subscription.totalPayments} <span className="text-slate-400 text-sm font-bold">payments</span>
                    </p>
                 </div>
              </div>

              {/* DUES ALERT & PAY BUTTON */}
              <div className={`rounded-2xl p-6 border flex flex-col sm:flex-row items-center justify-between gap-6
                 ${subscription.duePayments > 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
                 <div>
                    <h4 className={`text-xl font-black mb-1 tracking-tight ${subscription.duePayments > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                       {subscription.duePayments > 0 ? `${subscription.duePayments} Payment(s) Due` : "All Caught Up!"}
                    </h4>
                    <p className={`text-sm font-medium ${subscription.duePayments > 0 ? 'text-red-500/80' : 'text-emerald-600/80'}`}>
                       {subscription.duePayments > 0 
                         ? "You must clear your dues to ensure algorithmic protection continues." 
                         : (!paymentInfo.allowed ? `Next payment available in ${paymentInfo.daysRemaining} days.` : "Your coverage is fully active for the week.")}
                    </p>
                 </div>
                 
                 <button 
                    onClick={handlePayWeekly}
                    disabled={isProcessing || !paymentInfo.allowed}
                    className={`shrink-0 font-black tracking-tight py-3.5 px-8 rounded-xl transition-all shadow-sm flex items-center gap-2 outline-none
                       ${subscription.duePayments > 0 
                         ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/20' 
                         : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'}
                       ${(isProcessing || !paymentInfo.allowed) ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}
                    `}
                 >
                    {isProcessing ? 'Processing...' : `Pay ₹${subscription.planAmount}`}
                 </button>
              </div>
           </div>

        </motion.div>

      ) : (

        /* ── PLAN SELECTION UI (STEP 1) ── */
        <AnimatePresence mode="wait">
          <motion.div 
            key="plans"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16"
          >
            
            {/* KYC Warning Banner */}
             {kycStatus !== 'approved' && (
               <div className="lg:col-span-3 bg-amber-50 border border-amber-200/60 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm mb-2">
                 <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Lock size={20} />
                   </div>
                   <div>
                      <h3 className="text-amber-800 font-black text-sm tracking-tight mb-1">Your KYC is not approved</h3>
                      <p className="text-amber-700/80 text-xs font-medium max-w-3xl">
                         You cannot select or activate a premium protection buffer until your identity and company affiliation have been verified by the Risk team. Please wait for approval or contact support.
                      </p>
                   </div>
                 </div>
                 <button
                   onClick={() => router.push('/dashboard/profile/kyc')}
                   className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black tracking-tight transition-colors"
                 >
                   Complete KYC
                 </button>
               </div>
             )}

            {/* BASIC TIER (₹90) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white h-full relative group">
              <div className="mb-6">
                <span className="bg-slate-50 border border-slate-100/60 text-slate-500 text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg inline-block mb-4 shadow-sm">
                  Basic
                </span>
                <div className="flex flex-col gap-1 mb-2">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">₹{getPlanPrice('basic', 90)}</h2>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">/ per week</span>
                </div>
                <p className="text-xs text-slate-500 font-bold leading-relaxed mb-6 h-10 mt-3">
                  Essential shielding for baseline security matrix guarantees.
                </p>
              </div>
              
              <div className="flex-1">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                    <span className="text-[13px] font-black tracking-tight text-slate-700">Earnings Floor Protection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                    <span className="text-[13px] font-black tracking-tight text-slate-700">Weather Exception Standard</span>
                  </li>
                </ul>
              </div>
              
              <button 
                  onClick={() => (isKycApproved ? handleSelectPlan('basic') : router.push('/dashboard/profile/kyc'))}
                  disabled={isProcessing}
                  className={`w-full border font-black tracking-tight py-4 rounded-2xl transition-all shadow-sm flex justify-center items-center gap-2 ${
                   isKycApproved
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/60'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200/70'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                  {isProcessing
                    ? 'Processing'
                    : isKycApproved
                      ? selectedPlanType === 'basic'
                        ? 'Selected'
                        : 'Select Basic'
                      : 'Complete KYC to Unlock'}
              </button>
            </motion.div>

            {/* STANDARD TIER (₹110) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-blue-600 rounded-[2.5rem] p-8 lg:p-10 flex flex-col relative shadow-[0_20px_50px_rgba(37,99,235,0.2)] h-full z-10 transform lg:-translate-y-4 overflow-hidden outline-none">
              <div className="absolute inset-0 bg-linear-to-b from-blue-500/30 to-transparent opacity-50 pointer-events-none" />
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] uppercase font-black tracking-[0.2em] px-5 py-2 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.3)] whitespace-nowrap z-20">
                Recommended
              </div>

              <div className="mb-6 pt-4 relative z-10">
                <span className="bg-white/10 border border-white/20 text-blue-100 text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg inline-block mb-4">
                  Standard
                </span>
                <div className="flex flex-col gap-1 mb-2">
                  <h2 className="text-5xl font-black text-white tracking-tight">₹{getPlanPrice('standard', 110)}</h2>
                  <span className="text-[11px] font-bold text-blue-200 uppercase tracking-widest leading-none">/ per week</span>
                </div>
                <p className="text-xs text-blue-100 font-bold leading-relaxed mb-6 h-10 mt-3">
                  Optimal balance between cost capability and environment limits.
                </p>
              </div>
              
              <div className="flex-1 relative z-10">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-blue-300 shrink-0 mt-0.5 fill-blue-900/40" strokeWidth={3} />
                    <span className="text-[14px] font-black tracking-tight text-white">Full Earnings Floor</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-blue-300 shrink-0 mt-0.5 fill-blue-900/40" strokeWidth={3} />
                    <span className="text-[14px] font-black tracking-tight text-white">Gridlock & ETA overrides</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-blue-300 shrink-0 mt-0.5 fill-blue-900/40" strokeWidth={3} />
                    <span className="text-[14px] font-black tracking-tight text-white">Voting Privileges</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={() => (isKycApproved ? handleSelectPlan('standard') : router.push('/dashboard/profile/kyc'))}
                disabled={isProcessing}
                className={`w-full font-black tracking-tight py-4 rounded-2xl shadow-xl transition-colors text-[14px] relative z-10 flex justify-center items-center gap-2 group ${
                  isKycApproved
                    ? 'bg-white hover:bg-slate-50 text-blue-600'
                    : 'bg-amber-100 hover:bg-amber-50 text-amber-800 border border-amber-200/70'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing
                  ? 'Processing'
                  : isKycApproved
                    ? selectedPlanType === 'standard'
                      ? 'Selected'
                      : 'Select Standard'
                    : 'Complete KYC to Unlock'}
              </button>
            </motion.div>

            {/* PREMIUM TIER (₹150) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-800 h-full relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Star size={100} strokeWidth={1} className="text-amber-400" />
              </div>

              <div className="mb-6 relative z-10">
                <span className="bg-slate-800 border border-slate-700 text-amber-500 text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg inline-block mb-4 shadow-sm">
                  Premium
                </span>
                <div className="flex flex-col gap-1 mb-2">
                  <h2 className="text-5xl font-black text-white tracking-tight">₹{getPlanPrice('premium', 150)}</h2>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none">/ per week</span>
                </div>
                <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6 h-10 mt-3">
                  Unrestricted legal shielding and maximum algorithmic guarantees.
                </p>
              </div>
              
              <div className="flex-1 relative z-10">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Star size={16} className="text-amber-500 shrink-0 mt-0.5 fill-amber-500" strokeWidth={2.5} />
                    <span className="text-[13px] font-black tracking-tight text-white">Absolute Priority Processing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star size={16} className="text-amber-500 shrink-0 mt-0.5 fill-amber-500" strokeWidth={2.5} />
                    <span className="text-[13px] font-black tracking-tight text-white">Unjust Deactivation Legal Fund</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star size={16} className="text-amber-500 shrink-0 mt-0.5 fill-amber-500" strokeWidth={2.5} />
                    <span className="text-[13px] font-black tracking-tight text-white">Human Support Access</span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={() => (isKycApproved ? handleSelectPlan('premium') : router.push('/dashboard/profile/kyc'))}
                disabled={isProcessing}
                className={`w-full mt-auto border font-black tracking-tight py-4 rounded-2xl shadow-lg transition-all relative z-10 text-[14px] flex justify-center items-center gap-2 ${
                  isKycApproved
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700/50 text-white'
                    : 'bg-amber-50 hover:bg-amber-100 border-amber-200/70 text-amber-800'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing
                  ? 'Processing'
                  : isKycApproved
                    ? selectedPlanType === 'premium'
                      ? 'Selected'
                      : 'Select Premium'
                    : 'Complete KYC to Unlock'}
              </button>
            </motion.div>

          </motion.div>
        </AnimatePresence>
      )}
      
    </div>
  );
}
