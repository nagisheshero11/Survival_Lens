"use client";

import { TrendingDown, Lock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RealitySection() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 border-y border-slate-100">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-100/50 rounded-full blur-[100px] -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left side Cards */}
          <div className="relative space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-card p-8 w-[90%] lg:w-[85%] relative z-10 bg-white border-red-100 hover:border-red-200 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 mb-6 border border-red-100">
                <TrendingDown size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-wide">Income Volatility</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">Gig economy earnings are unpredictable. One bad algorithm shift can cut income by 40% overnight without warning.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card p-8 w-[90%] lg:w-[85%] ml-auto relative z-20 -mt-8 bg-white border-orange-100 hover:border-orange-200 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 mb-6 border border-orange-100">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-wide">Systemic Vulnerability</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">Traditional insurance models fail independent workers. Your gap periods reflect a systemic lack of safety nets.</p>
            </motion.div>
          </div>

          {/* Right side content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-blue-600" />
              The Reality
            </p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              The platform is not your partner. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">It's a variable.</span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
              Millions of independent workers are one algorithmic update away from financial distress. Market saturation, unexpected fee adjustments, and seasonal drops create an ecosystem of constant risk.
            </p>
            
            <ul className="space-y-5">
              {[
                "Zero algorithmic transparency",
                "Arbitrary account deactivations",
                "Instant market oversaturation"
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-100 group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-slate-700 font-semibold tracking-wide">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
