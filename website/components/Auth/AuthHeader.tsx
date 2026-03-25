import { ShieldCheck } from "lucide-react";

export default function AuthHeader() {
  return (
    <div className="flex flex-col items-center mb-10 mt-12">
      <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-md border border-blue-500/50">
        <ShieldCheck size={24} strokeWidth={2.5} />
      </div>
      <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-2">
        Survival Lens
      </h1>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
        Financial Risk Intelligence
      </p>
    </div>
  );
}
