"use client";

import { motion } from "framer-motion";

export default function StepsSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-32 relative overflow-hidden bg-white border-y border-slate-100">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-40 bg-blue-100/50 blur-[80px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">Four Steps to Immutable Stability</h2>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative"
        >
          {/* Connecting Animated Line (hidden on mobile) */}
          <div className="hidden lg:block absolute top-[2.5rem] left-[12%] right-[12%] h-[2px] bg-slate-100 z-0 overflow-hidden rounded-full">
            <motion.div 
              initial={{ x: "-100%" }}
              whileInView={{ x: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            />
          </div>
          
          {[
            { num: 1, title: "Register Identity", desc: "Connect your platform profiles to establish verified gig activity across networks securely." },
            { num: 2, title: "Select Coverage", desc: "Choose an automated tier customized precisely to your regional risk and delivery volume." },
            { num: 3, title: "Trigger Event", desc: "When systemic disruptions occur (weather, algorithmic drops), the protocol alerts you." },
            { num: 4, title: "Network Disbursement", desc: "Nodes verify ground realities, instantly unlocking liquidity directly to your Claim Wallet." }
          ].map((step, i) => (
            <motion.div 
              variants={cardVariant}
              key={i} 
              className="glass-card bg-white p-8 pt-12 border border-slate-200 hover:border-blue-300 transition-all text-center relative z-10 flex flex-col items-center group shadow-sm hover:shadow-lg"
            >
              <div className="absolute -top-6 h-12 w-12 bg-white text-blue-600 rounded-full flex items-center justify-center font-extrabold font-mono text-xl border-4 border-slate-50 shadow-md group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-100 transition-colors">
                {step.num}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-wide">{step.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
