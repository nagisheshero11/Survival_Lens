"use client";

import { ShieldCheck, Crosshair, Users, BrainCircuit, Radar, Wallet, ChevronRight } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function FeaturesSection() {
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section id="features" className="py-24 lg:py-32 w-full bg-slate-50 flex flex-col items-center justify-center border-y border-slate-100">
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Simple Premium Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20 lg:mb-28"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-100 bg-blue-50 mb-6">
            <BrainCircuit size={14} className="text-blue-600" /> 
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Instant Payout Protocol</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Automatic Protection. <br />
            <span className="text-blue-600">Zero Claims.</span>
          </h2>
          <p className="text-lg lg:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            We monitor your local conditions to automatically detect severe weather or strikes. If you can&apos;t work, you get paid instantly.
          </p>
        </motion.div>

        {/* Clean 2x2 Grid Layout */}
        <motion.div 
          variants={containerVars}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 gap-8 lg:gap-10"
        >
          
          {/* Feature 1 */}
          <motion.div 
            variants={itemVars}
            className="group bg-white rounded-[2rem] p-10 lg:p-12 border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgba(59,130,246,0.08)] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <Radar size={28} className="text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Automatic Disruption Detection</h3>
            <p className="text-slate-600 leading-relaxed font-medium mb-8 text-[15px]">
              We constantly monitor external APIs for extreme weather, pollution levels, and strikes. Instead of triggering blind payouts, our system generates Event Proposals weighted with confidence scores.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-slate-50 rounded-lg text-slate-600 text-[11px] font-bold uppercase tracking-widest border border-slate-200">Weather API</span>
              <span className="px-3 py-1.5 bg-slate-50 rounded-lg text-slate-600 text-[11px] font-bold uppercase tracking-widest border border-slate-200">Pollution Data</span>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            variants={itemVars}
            className="group bg-white rounded-[2rem] p-10 lg:p-12 border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgba(79,70,229,0.08)] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-8 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <Users size={28} className="text-indigo-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Verified by Local Drivers</h3>
            <p className="text-slate-600 leading-relaxed font-medium mb-8 text-[15px]">
              When unexpected local disruptions happen—like a localized road closure—your funds are unlocked by direct verification from other drivers right next to you.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                <ShieldCheck size={18} className="text-indigo-500" /> Instant Peer Verification
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                <ShieldCheck size={18} className="text-indigo-500" /> Local Area Accuracy
              </li>
            </ul>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            variants={itemVars}
            className="group bg-white rounded-[2rem] p-10 lg:p-12 border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.08)] hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-8 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <Crosshair size={28} className="text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Fraud-Proof Payouts</h3>
            <p className="text-slate-600 leading-relaxed font-medium mb-8 text-[15px]">
              Because our system tracks real movement and automatically eliminates bad actors, your premium pool stays full. Honest gig workers get paid faster and more reliably.
            </p>
            
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 mt-auto">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">System Integrity</span>
                <span className="text-[11px] font-bold tracking-widest text-emerald-600 uppercase">100% Secure</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full rounded-full"></div>
              </div>
            </div>
          </motion.div>

          {/* Feature 4 */}
          <motion.div 
            variants={itemVars}
            className="group bg-white rounded-[2rem] p-10 lg:p-12 border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgba(59,130,246,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-8 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
              <Wallet size={28} className="text-slate-700 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Total Financial Control</h3>
            <p className="text-slate-600 text-[15px] leading-relaxed font-medium mb-8">
              Approved payouts go straight to your Claim Wallet. Withdraw your money instantly when you need it, or save it as a buffer for the next big disruption.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Method 1</span>
                <span className="flex items-center gap-1 text-slate-900 font-bold text-sm">
                  Instant <ChevronRight size={14} className="text-blue-500" />
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Method 2</span>
                <span className="flex items-center gap-1 text-slate-900 font-bold text-sm">
                  Deferred <ChevronRight size={14} className="text-slate-400" />
                </span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
