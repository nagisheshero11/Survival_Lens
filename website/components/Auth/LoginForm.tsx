"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AtSign, Lock, Eye, EyeOff, Phone, MessageSquare, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const inputClass = "w-full pl-[2.75rem] pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-medium text-slate-900 placeholder-slate-400 transition-all outline-none";
const labelClass = "block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1";
const iconClass = "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [method, setMethod] = useState<"standard" | "otp">("standard");
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 w-full max-w-[480px] h-[700px] flex flex-col justify-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 relative z-10 mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Welcome back</h2>
        <p className="text-base text-slate-500 font-medium">
          Enter your details to access the protocol.
        </p>
      </div>

      {/* Toggle Standard / OTP */}
      <div className="flex p-1.5 bg-slate-50 rounded-2xl mb-10 border border-slate-100">
        <button
          onClick={() => { setMethod("standard"); setOtpSent(false); }}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
            method === "standard" ? "bg-white text-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.04)]" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Email & Password
        </button>
        <button
          onClick={() => { setMethod("otp"); setOtpSent(false); }}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
            method === "otp" ? "bg-white text-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.04)]" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          SMS OTP
        </button>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); router.push('/dashboard'); }}>

        <AnimatePresence mode="wait">
          {/* ── STANDARD fields ── */}
          {method === "standard" && (
            <motion.div key="standard" className="space-y-4"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
            >
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative group">
                  <div className={iconClass}>
                    <AtSign size={16} strokeWidth={2.5} />
                  </div>
                  <input type="email" placeholder="name@example.com" className={inputClass} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2.5 ml-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                  <a href="#" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative group">
                  <div className={iconClass}>
                    <Lock size={16} strokeWidth={2.5} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-[2.75rem] pr-14 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-medium text-slate-900 tracking-widest placeholder-slate-400 transition-all outline-none"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                    {showPassword ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── OTP fields ── */}
          {method === "otp" && (
            <motion.div key="otp" className="space-y-4"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <div>
                <label className={labelClass}>Registered Phone</label>
                <div className="relative group">
                  <div className={iconClass}>
                    <Phone size={16} strokeWidth={2.5} />
                  </div>
                  <input type="tel" placeholder="+91 98765 43210" className={inputClass} />
                </div>
              </div>

              {!otpSent && (
                <button type="button"
                  onClick={() => setOtpSent(true)}
                  className="w-full border-2 border-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600 transition-all text-[14px] flex items-center justify-center gap-2 group"
                >
                  <MessageSquare size={16} className="group-hover:text-blue-500 transition-colors" strokeWidth={2.5} />
                  Request OTP Code
                </button>
              )}

              <AnimatePresence>
                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pt-2"
                  >
                    <label className={labelClass}>Enter Secure Code</label>
                    <div className="flex gap-3 justify-center">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onInput={(e) => {
                            const target = e.currentTarget;
                            if (target.value.length === 1) {
                              const next = target.nextElementSibling as HTMLInputElement | null;
                              next?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !e.currentTarget.value) {
                              const prev = e.currentTarget.previousElementSibling as HTMLInputElement | null;
                              prev?.focus();
                            }
                          }}
                          className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-black bg-slate-50 focus:bg-white border text-blue-600 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl transition-all outline-none caret-blue-500 shadow-sm"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4 px-1">
                      <p className="text-xs text-slate-400 font-medium">Valid for 09:59</p>
                      <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-blue-600 font-bold hover:text-blue-700">Resend Code</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-2">
          <button type="submit"
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all text-sm mb-6 flex justify-center items-center gap-2 shadow-xl shadow-slate-900/10 group group-active:scale-[0.98]"
          >
            {method === "otp" ? (otpSent ? "Verify & Enter Dashboard" : "Continue Securely") : "Enter Dashboard"}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1 mb-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative bg-white px-4 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
            Identity Protocol
          </div>
        </div>

        <p className="text-center text-[15px] font-medium text-slate-500 mt-6">
          New to Survival Lens?{" "}
          <a href="/auth/register" className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
            Create an account
          </a>
        </p>
      </form>
    </div>
  );
}
