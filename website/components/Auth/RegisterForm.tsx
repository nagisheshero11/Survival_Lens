"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, AtSign, Phone, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-8 w-full max-w-[440px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 relative z-10 mx-auto mt-2 mb-2">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Create an account</h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-6 font-medium">
        Please enter your details to sign up for Survival Lens.
      </p>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); router.push('/dashboard'); }}>
        {/* Name */}
        <div>
          <label className="block text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <User size={16} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 transition-all outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <AtSign size={16} strokeWidth={2.5} />
            </div>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 transition-all outline-none"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Phone size={16} strokeWidth={2.5} />
            </div>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 transition-all outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Lock size={16} strokeWidth={2.5} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-2.5 sm:py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-sm font-medium text-slate-900 tracking-widest placeholder-slate-400 transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-1">
          <button
            type="submit"
            className="w-full bg-[#0055ff] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(0,85,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,85,255,0.23)] hover:-translate-y-0.5 transition-all text-sm mb-4"
          >
            Create Account
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1 mb-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative bg-white px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Secure Gateway
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center text-xs sm:text-sm font-medium text-slate-600 mt-4">
          Already have an account?{" "}
          <a href="/auth/login" className="font-bold text-[#0055ff] hover:text-blue-700 hover:underline underline-offset-4 decoration-2">
            Log in instead
          </a>
        </p>
      </form>
    </div>
  );
}
