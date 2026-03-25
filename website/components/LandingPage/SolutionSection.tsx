"use client";

import { BarChart3, Users, Droplets } from "lucide-react";
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
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, type: "spring" } }
  };

  return (
    <section id="features" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            The Intelligence Layer
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Resilience through Intelligence</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-20 font-medium leading-relaxed">
            We provide a decentralized financial buffer. By analyzing real-time gig data, the protocol anticipates risks before they impact your livelihood.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 items-center"
        >
          {/* Card 1 */}
          <motion.div variants={item} className="glass-card bg-white p-10 text-left border border-slate-100 hover:border-blue-200 transition-all group shadow-sm hover:shadow-lg">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-8 border border-blue-100 group-hover:scale-110 transition-transform">
              <BarChart3 size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-wide">Predictive Modeling</h3>
            <p className="text-slate-600 leading-relaxed font-medium text-sm">
              Our AI tracks global gig trends to warn you of upcoming dry spells or platform shifts specifically tailored to your niche.
            </p>
          </motion.div>

          {/* Card 2 (Highlight) */}
          <motion.div variants={item} className="glass-card bg-gradient-to-br from-blue-600 to-indigo-600 p-10 text-left shadow-[0_20px_40px_rgba(59,130,246,0.3)] border border-blue-500 transform md:-translate-y-4 relative z-10 mt-8 md:mt-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2)_0,transparent_60%)] rounded-[1.5rem]" />
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-8 border border-white/30 backdrop-blur-md">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 tracking-wide">Decentralized Consensus</h3>
              <p className="text-blue-50 leading-relaxed font-medium text-sm">
                Risk events and claims are verified exclusively by the community network, ensuring absolute transparency and equitable distribution.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={item} className="glass-card bg-white p-10 text-left border border-slate-100 hover:border-indigo-200 transition-all group shadow-sm hover:shadow-lg">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-8 border border-indigo-100 group-hover:scale-110 transition-transform">
              <Droplets size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-wide">Smart Liquidity</h3>
            <p className="text-slate-600 leading-relaxed font-medium text-sm">
              Instantly access emergency capital during catastrophic income drops, backed transparently by the Survival Lens community pool.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
