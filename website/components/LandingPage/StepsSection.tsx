"use client";

import { motion, Variants } from "framer-motion";
import { Link, ShieldCheck, Zap, Coins, Workflow } from "lucide-react";

export default function StepsSection() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, type: "spring", bounce: 0.4 } }
  };

  const steps = [
    { 
      num: "01", 
      icon: Link,
      title: "Register Identity", 
      desc: "Securely link your platform profiles via zero-knowledge proofs. We track activity without analyzing private data." 
    },
    { 
      num: "02", 
      icon: ShieldCheck,
      title: "Select Coverage", 
      desc: "Choose an automated tier customized precisely to your regional risk and daily average delivery volume." 
    },
    { 
      num: "03", 
      icon: Zap,
      title: "Trigger Event", 
      desc: "When verifiable systemic disruptions occur (algorithmic drops, weather events), the protocol alerts you immediately." 
    },
    { 
      num: "04", 
      icon: Coins,
      title: "Network Payout", 
      desc: "Nodes verify local ground realities, instantly unlocking protocol liquidity directly to your Claim Wallet." 
    }
  ];

  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative w-full flex items-center justify-center">
      
      {/* Immersive Deep Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
        {/* Subtle glowing orbs for depth */}
        <motion.div 
          animate={{ x: [-20, 20, -20], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [20, -20, 20], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[120px]" 
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_10%,transparent_100%)] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-100 bg-blue-50/50 mb-8 w-fit backdrop-blur-sm">
             <Workflow size={14} className="text-blue-600 animate-pulse" />
             <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Protocol Architecture</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Four Steps to <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Immutable Stability</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            The intelligent pipeline operates seamlessly in the background, bridging the gap between volatile gig algorithms and solid financial certainty.
          </p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10"
        >

          
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div 
                variants={cardVariant}
                key={i} 
                className="glass-card bg-white/80 backdrop-blur-xl p-8 pt-10 border border-slate-100 hover:border-blue-200 transition-all duration-500 text-center relative z-10 flex flex-col items-center group shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-3 overflow-hidden rounded-[2rem]"
              >
                {/* Dynamic Internal Glow on Hover */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Step Number Watermark */}
                <div className="absolute -right-4 -top-8 text-[120px] font-black pointer-events-none tracking-tighter text-slate-50/50 group-hover:text-blue-50/50 transition-colors duration-500 z-0">
                  {step.num}
                </div>

                {/* Primary Icon Container */}
                <div className="relative z-20 h-16 w-16 bg-white text-blue-600 rounded-2xl flex items-center justify-center border border-slate-100 shadow-md group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 mb-8">
                  <Icon size={28} />
                </div>
                
                <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-wide relative z-20 group-hover:text-blue-900 transition-colors duration-300">{step.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium relative z-20">{step.desc}</p>
                
                {/* Progress Indicators for Mobile */}
                <div className="lg:hidden mt-8 w-full h-[3px] bg-slate-100 rounded-full overflow-hidden relative z-20">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "0%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                    className="w-full h-full bg-blue-500 rounded-full"
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
