import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Hero Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 border border-slate-200 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mr-2">Intelligence First</span>
              <span className="text-slate-300 mx-1">/</span>
              <span className="text-xs font-medium text-slate-500 ml-1">Your Financial Safety Net</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              The Financial <br />
              <span className="text-blue-600">Safety Net</span> for <br />
              Gig Workers
            </h1>
            
            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
              Survival Lens uses decentralized intelligence to protect your income against market volatility and platform shifts. Stability designed for the modern independent professional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                Protect My Income
                <ArrowRight size={18} />
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-4 px-8 rounded-full transition-all flex items-center justify-center">
                See How It Works
              </button>
            </div>

            <div className="flex items-center gap-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trusted by professionals at</p>
              <div className="flex gap-4 grayscale opacity-40">
                <span className="font-bold text-xl tracking-tighter">UBER</span>
                <span className="font-bold text-xl tracking-tighter text-green-600">fiverr</span>
                <span className="font-bold text-xl tracking-tighter">Upwork</span>
              </div>
            </div>
          </div>

          {/* Hero Image / Graphic */}
          <div className="relative mx-auto lg:ml-auto w-full max-w-lg">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 bg-black aspect-square flex items-center justify-center">
              <Image 
                src="/hero-gauge.png" 
                alt="Financial Safety Gauge" 
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Income Protected</p>
                <p className="text-sm font-bold text-slate-900">$14,500 THIS QTR</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
