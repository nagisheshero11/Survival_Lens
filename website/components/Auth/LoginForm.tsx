"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AtSign, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [method, setMethod] = useState<"standard" | "otp">("standard");

  return (
    <div className="bg-white rounded-[2rem] p-10 w-full max-w-[440px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 relative z-10 mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h2>
      <p className="text-sm text-slate-500 mb-8 font-medium">
        Please enter your details to access your dashboard.
      </p>

      {/* Toggle Standard / OTP */}
      <div className="flex p-1 bg-slate-100 rounded-xl mb-8 border border-slate-200/50">
        <button
          onClick={() => setMethod("standard")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
            method === "standard"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Standard
        </button>
        <button
          onClick={() => setMethod("otp")}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
            method === "otp"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          OTP / SMS
        </button>
      </div>

      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); router.push('/dashboard'); }}>
        {/* Username / Email */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Username or Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <AtSign size={18} strokeWidth={2.5} />
            </div>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full pl-11 pr-4 py-3.5 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 transition-all outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Password
            </label>
            <a href="#" className="flex text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} strokeWidth={2.5} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-11 pr-12 py-3.5 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-sm font-medium text-slate-900 tracking-widest placeholder-slate-400 transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-[#0055ff] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(0,85,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,85,255,0.23)] hover:-translate-y-0.5 transition-all text-sm mb-6"
          >
            Login to Dashboard
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-2 mb-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative bg-white px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Secure Gateway
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm font-medium text-slate-600 mt-6">
          New to Survival Lens?{" "}
          <a href="#" className="font-bold text-[#0055ff] hover:text-blue-700 hover:underline underline-offset-4 decoration-2">
            Create an account
          </a>
        </p>
      </form>
    </div>
  );
}
