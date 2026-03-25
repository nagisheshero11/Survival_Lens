"use client";

import { ShieldCheck, Fingerprint, Activity, Server, Database, Code } from "lucide-react";
import { motion } from "framer-motion";

export default function TechnologySection() {
  return (
    <section id="technology" className="py-24 lg:py-32 relative overflow-hidden w-full flex items-center justify-center">
      
      {/* Immersive Background Structure */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[150px]" 
        />
        {/* Sleek radial hex/dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05)_0,transparent_50%)]" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to bottom, black, transparent)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="mb-20 flex flex-col items-start lg:items-center lg:text-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-100 bg-blue-50/50 mb-8 w-fit backdrop-blur-sm">
             <Code size={14} className="text-blue-600 animate-pulse" />
             <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Protocol Infrastructure</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            The Engine <br className="lg:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Under the Hood</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            A massively scalable, highly secure environment built explicitly to bridge realtime gig-economy data with decentralized financial buffers.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
          
          {/* Main Feature: Real-Time Monitoring */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="lg:col-span-2 glass-card bg-white/80 backdrop-blur-xl p-10 lg:p-12 border border-slate-100 group hover:border-blue-200 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-3 rounded-[2.5rem] overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/80 rounded-full blur-[60px] -mr-32 -mt-32 transition-opacity opacity-0 group-hover:opacity-100 duration-700" />
            
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10">
              <div className="flex-1">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 border border-blue-100 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-3">
                  <Activity size={28} />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Real-Time Risk Engine</h3>
                <p className="text-slate-600 leading-relaxed font-medium mb-8 text-[15px]">
                  Our intelligence engine continuously scrapes thousands of live data points across delivery, freelance, and ride-share platforms to instantly deliver an active "Weather Forecast" of catastrophic algorithmic shifts directly to your dashboard.
                </p>
              </div>
              
              {/* High-End Graphic Terminal Placeholder */}
              <div className="flex-shrink-0 w-full lg:w-64 h-48 bg-slate-900 p-6 rounded-3xl shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] border border-slate-800 relative overflow-hidden flex items-end gap-2 group-hover:shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all duration-500">
                <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  LIVE: UBER_NODE_EST
                </div>
                <motion.div animate={{ height: ["10%", "40%", "20%"] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} className="flex-1 bg-gradient-to-t from-blue-900 to-blue-500 rounded-t-md opacity-80" />
                <motion.div animate={{ height: ["30%", "60%", "40%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="flex-1 bg-gradient-to-t from-blue-900 to-blue-400 rounded-t-md opacity-80" />
                
                {/* Highlight/Anomaly Bar */}
                <div className="flex-1 h-[80%] bg-gradient-to-t from-red-900 to-red-500 rounded-t-md relative z-10 shadow-[0_0_20px_rgba(239,68,68,0.5)] group-hover:scale-y-110 origin-bottom transition-transform duration-500">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(239,68,68,1)] animate-ping mix-blend-screen" />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-red-600 text-[10px] py-1 px-2 rounded font-bold shadow-xl whitespace-nowrap">
                    Drop Detected
                  </div>
                </div>

                <motion.div animate={{ height: ["50%", "20%", "40%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="flex-1 bg-gradient-to-t from-blue-900 to-blue-600 rounded-t-md opacity-80" />
                <motion.div animate={{ height: ["70%", "50%", "60%"] }} transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="flex-1 bg-gradient-to-t from-blue-900 to-indigo-500 rounded-t-md opacity-80" />
              </div>
            </div>
          </motion.div>

          {/* Side Feature: Secure Dark Card (Replaces Emerald) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.2 }}
            className="glass-card bg-gradient-to-br from-slate-900 via-[#0f172a] to-indigo-950 overflow-hidden flex flex-col justify-center p-10 relative border border-slate-800 shadow-2xl transform hover:-translate-y-3 transition-all duration-500 rounded-[2.5rem] group"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15)_0,transparent_60%)] group-hover:scale-125 transition-transform duration-1000" />
            
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-10 p-8 opacity-10 text-indigo-400 mix-blend-overlay pointer-events-none"
            >
              <ShieldCheck size={200} />
            </motion.div>
            
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/30 backdrop-blur-md group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.2)] group-hover:-rotate-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Immutably Secured</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                Risk matrices and claim qualifications are rigorously validated through an automated, multi-signal cryptographic verification layer.
              </p>
            </div>
          </motion.div>

          {/* Bottom Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.3 }}
            className="glass-card bg-white/80 backdrop-blur-xl p-10 border border-slate-100 hover:border-blue-200 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-3 rounded-[2rem] group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-[40px] -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100" />
            <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 mb-6 border border-slate-100 relative z-10 group-hover:bg-blue-600 group-hover:text-white transition-colors group-hover:scale-110 group-hover:rotate-6">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-wide relative z-10">Multi-Platform Sync</h3>
            <p className="text-[15px] text-slate-600 leading-relaxed font-medium relative z-10">
              Connect Uber, DoorDash, Upwork, and more to generate a unified, sovereign risk landscape mapping your entire gig portfolio.
            </p>
          </motion.div>
          
          {/* Bottom Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.4 }}
            className="lg:col-span-2 glass-card bg-white/80 backdrop-blur-xl p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-100 hover:border-indigo-200 transition-all duration-500 group shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-3 rounded-[2.5rem] overflow-hidden relative"
          >
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-[60px] -ml-20 -mb-20 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none" />
            
            <div className="relative z-10 max-w-lg">
              <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 mb-6 border border-slate-100 relative z-10 group-hover:bg-indigo-600 group-hover:text-white transition-colors group-hover:scale-110 group-hover:-rotate-6">
                <Server size={24} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Zero-Knowledge Privacy</h3>
              <p className="text-[15px] text-slate-600 leading-relaxed font-medium">
                We mathematically verify your sustained income metrics without ever exposing or storing your personal identifying documents on centralized servers. Your sovereign data stays strictly yours.
              </p>
            </div>

            <div className="relative z-10 flex-shrink-0 text-slate-200 group-hover:text-indigo-500 transition-colors duration-700 drop-shadow-sm">
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Fingerprint size={120} strokeWidth={1} />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
