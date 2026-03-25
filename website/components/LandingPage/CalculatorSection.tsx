"use client";

import { Calculator, ArrowRight, SunMoon, Coins } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CalculatorSection() {
  const [dailyEarnings, setDailyEarnings] = useState(800);
  const [daysLost, setDaysLost] = useState(3);
  const [animatedPayout, setAnimatedPayout] = useState(0);

  const targetPayout = dailyEarnings * daysLost;
  const weeklyPremium = Math.round(dailyEarnings * 0.08);

  // Smooth number animation effect
  useEffect(() => {
    const duration = 500; // ms
    const steps = 20;
    const stepTime = Math.abs(Math.floor(duration / steps));
    let current = animatedPayout;
    const diff = targetPayout - current;
    
    if (diff === 0) return;

    const timer = setInterval(() => {
      current += diff / steps;
      if ((diff > 0 && current >= targetPayout) || (diff < 0 && current <= targetPayout)) {
        clearInterval(timer);
        setAnimatedPayout(targetPayout);
      } else {
        setAnimatedPayout(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetPayout]);

  return (
    <section id="calculator" className="py-24 lg:py-32 w-full bg-white flex justify-center border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Context & Typography */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Know Exactly<br />
              <span className="text-blue-600">What You Get.</span>
            </h2>
            
            <p className="text-lg text-slate-600 mb-12 font-medium leading-relaxed">
              No hidden clauses or complex adjustments. See exactly how much you regain during a localized disruption.
            </p>
            
            {/* Minimalist Scenario Cards */}
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={() => { setDailyEarnings(800); setDaysLost(3); }}
                className="group p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-200 hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] transition-all cursor-pointer flex justify-between items-center"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-1">Mumbai Monsoons</h4>
                  <p className="text-slate-500 font-medium text-sm">Lost 3 days of work</p>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Payout</span>
                  <span className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">₹2,400</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onClick={() => { setDailyEarnings(900); setDaysLost(2); }}
                className="group p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-200 hover:shadow-[0_8px_30px_rgba(79,70,229,0.08)] transition-all cursor-pointer flex justify-between items-center"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-1">Delhi City Strike</h4>
                  <p className="text-slate-500 font-medium text-sm">Lost 2 days in unsafe zone</p>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Payout</span>
                  <span className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">₹1,800</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side: Simple Clean Calculator */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-[2rem] p-8 lg:p-12 border border-slate-200 shadow-[0_10px_60px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_80px_rgba(0,0,0,0.08)] transition-shadow duration-500">
               
               <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-100">
                 <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                   <Calculator size={24} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-900">Coverage Estimator</h3>
                   <span className="text-sm font-medium text-slate-500">Real-time sync</span>
                 </div>
               </div>

               <div className="space-y-10 mb-12">
                 {/* Slider 1: Earnings */}
                 <div>
                   <div className="flex justify-between items-center mb-4">
                     <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                       <Coins size={16} className="text-slate-400"/> Base Daily Earnings
                     </label>
                     <div className="text-2xl font-black text-slate-900 tracking-tight">
                       <span className="text-slate-400 font-medium mr-1 text-lg">₹</span>{dailyEarnings}
                     </div>
                   </div>
                   <input 
                     type="range" min="300" max="2500" step="100" 
                     value={dailyEarnings} onChange={(e) => setDailyEarnings(Number(e.target.value))}
                     className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 outline-none"
                   />
                 </div>

                 {/* Slider 2: Days Lost */}
                 <div>
                   <div className="flex justify-between items-center mb-4">
                     <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                       <SunMoon size={16} className="text-slate-400"/> Disruption Duration
                     </label>
                     <div className="text-2xl font-black text-slate-900 tracking-tight">
                       {daysLost} <span className="text-slate-400 font-medium ml-1 text-lg">Days</span>
                     </div>
                   </div>
                   <input 
                     type="range" min="1" max="7" step="1" 
                     value={daysLost} onChange={(e) => setDaysLost(Number(e.target.value))}
                     className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 outline-none"
                   />
                 </div>
               </div>

               {/* Output Panel - Clean and Minimal */}
               <div className="bg-slate-50 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center group overflow-hidden relative">
                  <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Guaranteed Payout</span>
                    <div className="text-5xl font-black text-slate-900 tracking-tighter">
                      <span className="text-3xl text-slate-400 font-medium tracking-normal mr-1">₹</span>
                      {animatedPayout.toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-6 md:mt-0 md:pl-8 md:border-l border-slate-200 w-full md:w-auto text-left md:text-right relative z-10">
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Est. Premium</span>
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{weeklyPremium}<span className="text-sm text-slate-400 font-normal">/wk</span>
                    </div>
                  </div>
               </div>
               
               <button className="w-full mt-6 bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group text-base">
                 Activate Coverage
                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </button>
               
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
