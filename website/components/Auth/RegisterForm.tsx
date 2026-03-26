"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/(services)/auth";
import { User, AtSign, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

// Reduced padding from py-4 to py-3.5 for a sleeker profile
const inputClass = "w-full pl-[2.75rem] pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-medium text-slate-900 placeholder-slate-400 transition-all outline-none";
const labelClass = "block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1";
const iconClass = "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await registerUser({ fullName, mobile, email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 w-full max-w-[480px] h-[700px] flex flex-col justify-center shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 relative z-10 mx-auto">
      
      {/* Reduced bottom margin */}
      <div className="text-center mb-6">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Create Identity</h2>
        <p className="text-sm text-slate-500 font-medium">
          Secure your earning safety net today.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50/50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold text-center">
          {error}
        </div>
      )}

      {/* Reduced vertical space between rows */}
      <form className="space-y-4" onSubmit={handleRegister}>
        
        {/* Full Name */}
        <div>
          <label className={labelClass}>Legal Name</label>
          <div className="relative group">
            <div className={iconClass}>
              <User size={16} strokeWidth={2.5} />
            </div>
            <input 
              type="text" 
              placeholder="John Doe" 
              className={inputClass} 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div>
          <label className={labelClass}>Mobile Number</label>
          <div className="relative group">
            <div className={iconClass}>
              <Phone size={16} strokeWidth={2.5} />
            </div>
            <input 
              type="tel" 
              placeholder="+91 98765 43210" 
              className={inputClass} 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email Address</label>
          <div className="relative group">
            <div className={iconClass}>
              <AtSign size={16} strokeWidth={2.5} />
            </div>
            <input 
              type="text" 
              placeholder="name@example.com" 
              className={inputClass} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className={labelClass}>Secure Password</label>
          <div className="relative group">
            <div className={iconClass}>
              <Lock size={16} strokeWidth={2.5} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-[2.75rem] pr-12 py-3.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-[14px] font-medium text-slate-900 tracking-widest placeholder-slate-400 transition-all outline-none"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              {showPassword ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-2xl transition-all text-sm mb-6 flex justify-center items-center gap-2 shadow-xl shadow-slate-900/10 group group-active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? "Creating Account..." : "Create Secure Account"}
            {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1 mb-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative bg-white px-3 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
            Identity Protocol
          </div>
        </div>

        <p className="text-center text-sm font-medium text-slate-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
            Log in securely
          </a>
        </p>
      </form>
    </div>
  );
}
