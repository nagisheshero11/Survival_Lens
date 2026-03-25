"use client";

import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section id="pricing" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 relative z-20 bg-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto glass-card bg-white border border-slate-200 rounded-[3rem] p-12 lg:p-24 text-center text-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative overflow-hidden"
      >
        {/* Decorative ambient glowing circles */}
        <motion.div 
           animate={{ y: [-20, 20, -20], x: [-10, 10, -10], scale: [1, 1.05, 1] }} 
           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100/60 rounded-full mix-blend-multiply filter blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
        <motion.div 
           animate={{ y: [20, -20, 20], x: [10, -10, 10], scale: [1, 1.05, 1] }} 
           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-100/60 rounded-full mix-blend-multiply filter blur-[80px] translate-x-1/2 translate-y-1/2 pointer-events-none"
        />
        
        <div className="relative z-10 w-full flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight leading-tight">
            Ready to stabilize <br className="hidden md:block"/> your financial future?
          </h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Join 15,000+ gig workers who have stopped worrying about the next algorithm update and started building immutable financial resilience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-md mx-auto">
            <button className="group relative overflow-hidden bg-blue-600 text-white font-semibold py-4 px-8 rounded-full transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 text-lg flex-1 shadow-md shadow-blue-500/20">
              <span className="relative z-10">Join the Protocol</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button className="glass-card text-slate-700 bg-slate-50 border-slate-200 hover:text-slate-900 font-semibold py-4 px-8 rounded-full transition-all flex items-center justify-center hover:bg-slate-100 border text-lg flex-1 shadow-sm hover:shadow-md">
              View Plans
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
