"use client";

import { TrendingDown, Lock, Activity, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function RealitySection() {
  return (
    <section id="reality" className="py-16 lg:py-24 relative w-full flex items-center">
      
      {/* Deep Flowing Ambient Background (No hard 'paper' borders) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
        {/* Soft immersive glow nodes instead of a hard background color */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-[5%] w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-[100px]" 
        />
        
        {/* Animated subtle grid background indicating complex volatile data */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_10%,transparent_100%)] opacity-30" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left side Cards & Advanced Interactive Popups */}
          <div className="relative space-y-8 h-full py-10">
            
            {/* Highly Visible Floating System Alerts (Foreground) */}
            <div className="absolute inset-0 z-30 pointer-events-none">
               <motion.div 
                 animate={{ y: [0, -15, 0] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -top-6 right-2 lg:-right-6 bg-white/80 backdrop-blur-2xl border border-blue-200/50 text-blue-800 text-[11px] sm:text-xs font-bold px-4 py-3 rounded-2xl shadow-xl shadow-blue-500/10 flex items-center gap-2"
               >
                 <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                 Backend Sync: Routing Altered
               </motion.div>

               <motion.div 
                 animate={{ y: [0, -15, 0] }}
                 transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                 className="absolute bottom-4 -left-2 lg:-left-6 bg-white/80 backdrop-blur-2xl border border-indigo-200/50 text-indigo-800 text-[11px] sm:text-xs font-bold px-4 py-3 rounded-2xl shadow-xl shadow-indigo-500/10 flex items-center gap-2"
               >
                 <AlertTriangle size={14} className="text-indigo-500" />
                 Market Saturated: Earnings Drop 38%
               </motion.div>
            </div>

            {/* Income Volatility Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="glass-card p-10 w-[95%] lg:w-[90%] relative z-10 bg-white/80 backdrop-blur-md border border-slate-100 hover:border-blue-200 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 group rounded-[2rem]"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/80 rounded-full blur-[50px] -mr-20 -mt-20 transition-opacity opacity-0 group-hover:opacity-100 duration-700" />
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-8 border border-blue-100 relative z-10 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 shadow-sm group-hover:scale-110 group-hover:rotate-3">
                <TrendingDown size={28} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight relative z-10">Algorithmic Volatility</h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium relative z-10">
                You carry 100% of the operational risk, while the platform carries zero. A sudden backend update or an unexpected influx of drivers in your zone can slash your daily earnings by 40% in an instant.
              </p>
            </motion.div>
            
            {/* Systemic Vulnerability Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="glass-card p-10 w-[95%] lg:w-[90%] ml-auto relative z-20 -mt-10 sm:-mt-12 bg-white/80 backdrop-blur-md border border-slate-100 hover:border-indigo-200 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 group rounded-[2rem]"
            >
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50/80 rounded-full blur-[50px] -ml-20 -mb-20 transition-opacity opacity-0 group-hover:opacity-100 duration-700" />
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-8 border border-indigo-100 relative z-10 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500 shadow-sm group-hover:scale-110 group-hover:-rotate-3">
                <Lock size={28} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight relative z-10">Systemic Vulnerability</h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium relative z-10">
                Traditional legacy insurance completely fails the modern independent professional. During chaotic market gap periods, your labor reflects a massive, systemic lack of modern financial safety nets.
              </p>
            </motion.div>
          </div>

          {/* Right side robust content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center h-full"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-100 bg-blue-50/50 mb-8 w-fit">
               <Activity size={14} className="text-blue-600 animate-pulse" />
               <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Active Market Reality</span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-8 leading-[1.1] tracking-tight">
              The algorithm is not your partner.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">It's a variable.</span>
            </h2>
            
            <p className="text-lg lg:text-xl text-slate-600 mb-12 leading-relaxed font-medium">
              Millions of independent professionals operate directly on the edge of financial volatility. You are subjected to a fragile ecosystem built on constant, uncontrolled risk.
            </p>
            
            <ul className="space-y-6">
              {[
                "Zero transparency on internal algorithmic routing",
                "Sudden arbitrary platform account deactivations",
                "Instant localized market supply oversaturation"
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + (i * 0.15) }}
                  className="flex items-start gap-5 group cursor-default"
                >
                  <div className="relative pt-1">
                    <div className="absolute inset-0 bg-blue-400 rounded-full blur-[10px] opacity-0 group-hover:opacity-40 group-hover:animate-pulse transition-opacity duration-500" />
                    <div className="relative flex-shrink-0 h-8 w-8 rounded-full bg-white flex items-center justify-center text-blue-600 border border-slate-200 group-hover:border-blue-300 group-hover:bg-blue-50 transition-all duration-300 shadow-sm group-hover:scale-110">
                      <div className="w-2 h-2 rounded-full bg-blue-500 scale-50 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                  </div>
                  <span className="text-slate-700 font-semibold tracking-wide text-lg group-hover:text-blue-700 transition-colors duration-300 leading-snug">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
