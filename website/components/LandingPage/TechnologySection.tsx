"use client";

import { ShieldCheck, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";

export default function TechnologySection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-slate-50">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05)_0,transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-blue-600" />
            Core Technology
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-16 tracking-tight">The Engine Under the Hood</h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 glass-card bg-white p-10 border border-slate-200 group hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
          >
            <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-wide group-hover:text-blue-600 transition-colors">Real-Time Risk Monitoring</h3>
            <p className="text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
              Our intelligence engine scrapes thousands of live data points across delivery, freelance, and ride-share platforms to deliver an active "Weather Forecast" for your specific earnings.
            </p>
            {/* Graphic Placeholder (Bars) */}
            <div className="flex items-end gap-3 h-32 bg-slate-50 p-6 rounded-2xl shadow-inner border border-slate-100 w-fit relative overflow-hidden">
              <div className="w-10 h-10 bg-blue-100 rounded-t-lg border-t border-blue-200"></div>
              <div className="w-10 h-14 bg-blue-200 rounded-t-lg border-t border-blue-300"></div>
              <div className="w-10 h-24 bg-blue-600 rounded-t-lg relative shadow-[0_4px_10px_rgba(59,130,246,0.3)] group-hover:bg-blue-500 transition-colors">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-400 rounded-full shadow-[0_0_10px_rgba(248,113,113,0.8)] animate-pulse"></div>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs py-1 px-2 rounded font-bold shadow-lg">Risk Event</div>
              </div>
              <div className="w-10 h-12 bg-blue-300 rounded-t-lg border-t border-blue-400"></div>
              <div className="w-10 h-16 bg-blue-400 rounded-t-lg border-t border-blue-500"></div>
            </div>
          </motion.div>

          {/* Side Feature */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card bg-emerald-600 overflow-hidden flex flex-col justify-center p-10 relative border border-emerald-500 shadow-md transform"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-100 mix-blend-overlay">
              <ShieldCheck size={160} />
            </div>
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-6 border border-white/30 backdrop-blur-md">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">Secured by Intelligence</h3>
              <p className="text-emerald-50 font-medium leading-relaxed">
                Every claim is rigorously validated through automated multi-signal verification.
              </p>
            </div>
          </motion.div>

          {/* Bottom Features */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass-card bg-white p-10 border border-slate-200 hover:border-slate-300 transition-all shadow-sm group"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-wide">Multi-Platform Sync</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Connect Uber, DoorDash, Upwork, and more to generate a unified risk landscape mapping your entire gig portfolio.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 glass-card bg-white p-10 flex flex-col sm:flex-row items-center justify-between gap-8 border border-slate-200 hover:border-slate-300 transition-all group shadow-sm"
          >
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-wide">Zero-Knowledge Privacy</h3>
              <p className="text-sm text-slate-600 max-w-md leading-relaxed font-medium">
                We mathematically verify your sustained income metrics without ever exposing or storing your personal identifying documents. Your sovereign data stays strictly yours.
              </p>
            </div>
            <div className="flex-shrink-0 text-slate-200 group-hover:text-blue-500/20 transition-colors drop-shadow-sm">
              <Fingerprint size={100} strokeWidth={1} />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
