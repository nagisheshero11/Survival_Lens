"use client";

import { BarChart3, Users, Droplets, Shield, Activity, Network } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function SolutionSection() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, type: "spring", bounce: 0.4 } }
  };

  return (
    <section id="solution" className="py-24 lg:py-32 relative w-full flex items-center justify-center">
      
      {/* Immersive Deep Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
        {/* Central Intelligence Core Glow */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[150px]" 
        />
        
        {/* Connecting Data Network Background */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-24 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-indigo-100 bg-indigo-50/50 mb-8 w-fit backdrop-blur-sm">
             <Shield size={14} className="text-indigo-600 animate-pulse" />
             <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">The Protocol Solution</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Resilience through <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Decentralized Intelligence</span>
          </h2>
          <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Survival Lens acts as an automated financial buffer. By actively tracking real-time gig data, the protocol anticipates risks and distributes liquidity precisely when algorithms fail you.
          </p>
        </motion.div>

        <div className="relative">
          {/* Animated Connecting Backbone (Desktop Only) */}
          <div className="hidden lg:block absolute top-[40%] left-[10%] right-[10%] h-1 bg-slate-200/50 z-0 rounded-full overflow-hidden">
            <motion.div 
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            />
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-3 gap-8 items-center relative z-10"
          >
            {/* Card 1: Predictive Modeling */}
            <motion.div variants={item} className="glass-card bg-white/90 backdrop-blur-xl p-10 text-left border border-slate-100 hover:border-blue-200 transition-all duration-500 group shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-3 relative overflow-hidden rounded-[2rem]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-[40px] -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100 duration-700" />
              <div className="relative z-10 h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 mb-8 border border-slate-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-3 transition-all duration-500 shadow-sm">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight relative z-10">Predictive Defense</h3>
              <p className="text-slate-600 leading-relaxed font-medium relative z-10 text-[15px]">
                Our AI continuously tracks global gig trends to actively warn you of impending dry spells, enabling proactive scheduling before the market crashes.
              </p>
            </motion.div>

            {/* Card 2 (Core Highlight): Decentralized Consensus */}
            <motion.div variants={item} className="bg-gradient-to-br from-blue-600 to-indigo-600 p-12 text-center lg:text-left shadow-[0_20px_50px_rgba(59,130,246,0.4)] hover:shadow-[0_40px_80px_rgba(59,130,246,0.6)] border border-blue-400/50 transform lg:-translate-y-8 hover:lg:-translate-y-12 transition-all duration-500 relative z-20 mt-8 lg:mt-0 group overflow-hidden rounded-[2.5rem]">
              {/* Dynamic Internal Glows */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25)_0,transparent_60%)] rounded-[2.5rem] group-hover:scale-125 transition-transform duration-1000" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute -top-32 -right-32 text-white/5 pointer-events-none"
              >
                <Network size={400} />
              </motion.div>
              
              <div className="relative z-10 flex flex-col items-center lg:items-start">
                <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center text-white mb-8 border border-white/30 backdrop-blur-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-white/20 rounded-3xl blur-md"
                  />
                  <Users size={36} className="relative z-10" />
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Decentralized Trust</h3>
                <p className="text-blue-50/90 leading-relaxed font-medium text-[15px]">
                  Zero central authority. Risk events, such as arbitrary bans, are verified exclusively by an immutable community node network to guarantee 100% transparent payouts.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Smart Liquidity */}
            <motion.div variants={item} className="glass-card bg-white/90 backdrop-blur-xl p-10 text-left border border-slate-100 hover:border-indigo-200 transition-all duration-500 group shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-3 relative overflow-hidden rounded-[2rem] mt-8 lg:mt-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-[40px] -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100 duration-700" />
              <div className="relative z-10 h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-600 mb-8 border border-slate-100 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:-rotate-3 transition-all duration-500 shadow-sm">
                <Droplets size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight relative z-10">Smart Liquidity</h3>
              <p className="text-slate-600 leading-relaxed font-medium relative z-10 text-[15px]">
                Upon network consensus of your catastrophic income drop, emergency capital is instantly routed to your wallet, bypassing traditional legacy approval friction.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
