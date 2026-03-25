"use client";

import { CheckCircle2, ShieldAlert, BarChart3, Clock, Lock } from "lucide-react";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 lg:py-32 relative w-full flex flex-col items-center justify-center">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[150px]" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <BarChart3 size={14} className="animate-pulse" /> Dynamic Pricing Model
          </div>
          <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Fair Pricing Based on <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Real Activity.</span>
          </h2>
          <p className="text-lg lg:text-xl text-slate-600 font-medium leading-relaxed">
            Unlike legacy insurance, we don&apos;t charge flat rates. Your weekly premium is calculated dynamically using AI-driven predictive models based on your exact zone-level risk and active hours.
          </p>
        </div>

        {/* Activity Segments Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          
          {/* S1: Low Activity */}
          <div className="glass-card bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-10 border border-slate-200 shadow-xl flex flex-col group hover:-translate-y-2 hover:shadow-blue-500/20 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-300" />
            <div className="mb-6 flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Segment S1</span>
              <Clock className="text-blue-500" size={24} />
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-2">Low Activity</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-slate-900">0–4</span>
              <span className="text-slate-500 font-bold">hours / day</span>
            </div>
            <p className="text-[15px] text-slate-600 font-medium leading-relaxed mb-8 flex-1">
              Part-time professionals doing minimal deliveries. You pay a drastically reduced fraction of the premium pool aligned with your low exposure.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-slate-700 font-bold"><CheckCircle2 size={16} className="text-blue-500" /> Fractional premium cost</li>
              <li className="flex items-center gap-3 text-sm text-slate-700 font-bold"><CheckCircle2 size={16} className="text-blue-500" /> Minimum claim threshold met</li>
            </ul>
            <button className="w-full py-4 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-colors">Select Tier S1</button>
          </div>

          {/* S2: Medium Activity (Highlight) */}
          <div className="glass-card bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2.5rem] p-10 lg:scale-105 border border-blue-500/50 shadow-2xl shadow-blue-500/30 flex flex-col relative overflow-hidden z-10 group hover:-translate-y-2 transition-all duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2)_0,transparent_60%)]" />
            <div className="relative z-10 mb-6 flex justify-between items-start">
              <span className="text-xs font-bold text-blue-100 uppercase tracking-widest border border-blue-400 px-3 py-1 rounded-full bg-blue-500/50">Segment S2</span>
              <Clock className="text-white" size={24} />
            </div>
            <h3 className="relative z-10 text-3xl font-extrabold text-white mb-2">Medium Activity</h3>
            <div className="relative z-10 flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-white">4–8</span>
              <span className="text-blue-200 font-bold">hours / day</span>
            </div>
            <p className="relative z-10 text-[15px] text-blue-100 font-medium leading-relaxed mb-8 flex-1">
              The standard coverage for active gig workers. Your premium scales with historical zone disruptions and your average delivery frequency.
            </p>
            <ul className="relative z-10 space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-white font-bold"><CheckCircle2 size={16} className="text-blue-300" /> Balanced risk-to-premium ratio</li>
              <li className="flex items-center gap-3 text-sm text-white font-bold"><CheckCircle2 size={16} className="text-blue-300" /> Immediate wallet crediting</li>
              <li className="flex items-center gap-3 text-sm text-white font-bold"><CheckCircle2 size={16} className="text-blue-300" /> Historical disruption tracking</li>
            </ul>
            <button className="relative z-10 w-full py-4 rounded-xl bg-white text-blue-700 font-extrabold hover:bg-blue-50 transition-colors shadow-lg shadow-black/10">Calculate S2 Premium</button>
          </div>

          {/* S3: High Activity */}
          <div className="glass-card bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-10 border border-slate-200 shadow-xl flex flex-col group hover:-translate-y-2 hover:shadow-indigo-500/20 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
            <div className="mb-6 flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Segment S3</span>
              <Clock className="text-indigo-500" size={24} />
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-2">High Activity</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-slate-900">8–12</span>
              <span className="text-slate-500 font-bold">hours / day</span>
            </div>
            <p className="text-[15px] text-slate-600 font-medium leading-relaxed mb-8 flex-1">
              Full-time heavy hitters. Avoid the under-compensation traps of uniform legacy payouts. The protocol accurately compensates extreme loss.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-slate-700 font-bold"><CheckCircle2 size={16} className="text-indigo-500" /> Maximum coverage multipliers</li>
              <li className="flex items-center gap-3 text-sm text-slate-700 font-bold"><CheckCircle2 size={16} className="text-indigo-500" /> Priority consensus validation</li>
            </ul>
            <button className="w-full py-4 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition-colors">Select Tier S3</button>
          </div>
        </div>

        {/* Dynamic Risk Box */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 lg:p-14 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1)_0,transparent_60%)]" />
          <div className="flex-1 relative z-10">
            <h2 className="text-3xl font-extrabold text-white mb-6">How Your Premium is Calculated</h2>
            <p className="text-slate-400 leading-relaxed font-medium mb-8 text-[15px]">
              Unlike flat-rate insurance models, Survival Lens utilizes a continuous feedback loop. Your premium drops when you work in safe zones and naturally correctly scales if you operate in high-volatility disaster metrics. 
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-slate-800/50 p-5 rounded-xl border border-slate-700 backdrop-blur-sm">
                <ShieldAlert className="text-yellow-500" />
                <span className="text-slate-300 font-bold">Hyper-Local Zone Risk Analysis</span>
              </div>
              <div className="flex items-center gap-4 bg-slate-800/50 p-5 rounded-xl border border-slate-700 backdrop-blur-sm">
                <BarChart3 className="text-emerald-500" />
                <span className="text-slate-300 font-bold">Historical Disruption Frequency</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-center relative z-10">
             <div className="w-48 h-48 bg-slate-800 border-[8px] border-slate-700 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.2)] relative">
               <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">Weekly</span>
               <span className="text-4xl font-black text-white relative z-10">$Dynamic</span>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}
