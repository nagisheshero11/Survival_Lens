import AuthHeader from "../../../components/Auth/AuthHeader";
import RegisterForm from "../../../components/Auth/RegisterForm";
import AuthFooter from "../../../components/Auth/AuthFooter";
import { ShieldCheck, Shield } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-indigo-100/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none"></div>
      <div className="absolute top-[30%] right-[-10%] w-[35rem] h-[35rem] bg-emerald-50/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-12">
        <AuthHeader />
        
        <RegisterForm />

        {/* Security Badges */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mt-6 opacity-70">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-slate-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Bank-Grade Encryption
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-slate-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              ISO 27001 Certified
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <AuthFooter />
      </div>
    </div>
  );
}
