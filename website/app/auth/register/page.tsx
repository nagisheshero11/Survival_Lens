import AnimatedMapIllustration from "../../../components/Auth/AnimatedMapIllustration";
import RegisterForm from "../../../components/Auth/RegisterForm";
import AuthHeader from "../../../components/Auth/AuthHeader";
import { ShieldCheck, Shield } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="h-screen bg-[#f8f9fa] flex flex-col lg:flex-row w-full font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      
      {/* LEFT SIDE: 60% Map Illustration (Hidden on smaller screens, 100% height) */}
      <div className="hidden lg:flex lg:w-[60%] h-full relative">
        <AnimatedMapIllustration />
      </div>

      {/* RIGHT SIDE: 40% Signup Form */}
      <div className="w-full lg:w-[40%] h-full flex flex-col items-center justify-center p-4 sm:px-8 relative">
        
        {/* Decorative Light Orbs specifically for the form background */}
        <div className="absolute top-[-10%] left-[-20%] w-[30rem] h-[30rem] bg-indigo-100/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-50 pointer-events-none"></div>
        <div className="absolute top-[40%] right-[-20%] w-[25rem] h-[25rem] bg-emerald-50/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-50 pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center justify-center h-full py-4">
          
          <div className="mb-2 shrink-0">
            <AuthHeader />
          </div>
          
          <div className="w-full">
            <RegisterForm />
          </div>

          {/* Security Badges */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-2 opacity-70">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Bank-Grade Encryption
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                ISO 27001 Certified
              </span>
            </div>
          </div>
          
          {/* Simple Footer Links for Layout Balance */}
          <div className="flex gap-4 justify-center mt-8 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          </div>
          
        </div>
      </div>

    </div>
  );
}
