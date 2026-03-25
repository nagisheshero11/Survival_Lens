"use client";

import { Star, ShieldCheck } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function TestimonialSection() {
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section id="reviews" className="py-20 lg:py-32 relative w-full flex justify-center bg-white border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
        
        {/* Core Stats Banner */}
        <motion.div 
          variants={containerVars}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mb-20 lg:mb-32 text-center divide-x divide-slate-100"
        >
          <motion.div variants={itemVars} className="flex flex-col items-center">
            <span className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">₹2L+</span>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Paid Out</span>
          </motion.div>
          <motion.div variants={itemVars} className="flex flex-col items-center">
            <span className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">1.5k+</span>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Protected Riders</span>
          </motion.div>
          <motion.div variants={itemVars} className="flex flex-col items-center">
            <span className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">&lt;2h</span>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Avg. Payout Time</span>
          </motion.div>
          <motion.div variants={itemVars} className="flex flex-col items-center">
            <span className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">0</span>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Claim Denials</span>
          </motion.div>
        </motion.div>

        {/* Testimonials Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Trusted by the people <br /> who run the city.
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVars}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Review 1 */}
          <motion.div variants={itemVars} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300">
            <div className="flex gap-1 text-yellow-500 mb-6">
              {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
            </div>
            <p className="text-lg text-slate-700 font-medium mb-8 leading-relaxed">
              &quot;I used to lose ₹4,000 in heavy rain weeks. When the massive flood hit last month, I got ₹2,500 back right into my wallet instantly. I&apos;m incredibly relieved.&quot;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600 text-lg">R</div>
              <div>
                <h4 className="font-bold text-slate-900">Riya S.</h4>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Swiggy Partner</p>
              </div>
            </div>
          </motion.div>

          {/* Review 2 */}
          <motion.div variants={itemVars} className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-[0_20px_50px_rgba(37,99,235,0.15)] hover:shadow-[0_30px_60px_rgba(37,99,235,0.25)] hover:-translate-y-2 transition-all duration-300 text-white relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[40px] rounded-full" />
            <div className="flex gap-1 text-yellow-500 mb-6 relative z-10">
              {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
            </div>
            <p className="text-lg text-slate-300 font-medium mb-8 leading-relaxed relative z-10">
              &quot;No paperwork, no forms. The app detected the local strike, saw that I couldn&apos;t work, and authorized the payout the very next morning. Pure magic.&quot;
            </p>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-white text-lg">M</div>
              <div>
                <h4 className="font-bold text-white">Manish K.</h4>
                <p className="text-xs font-bold text-blue-300 uppercase tracking-wider">Uber Driver</p>
              </div>
            </div>
          </motion.div>

          {/* Review 3 */}
          <motion.div variants={itemVars} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300">
            <div className="flex gap-1 text-yellow-500 mb-6">
              {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
            </div>
            <p className="text-lg text-slate-700 font-medium mb-8 leading-relaxed">
              &quot;Legacy insurance told me gig work wasn&apos;t fully covered. This protocol understands exactly what we do. The 0% fraud claim means everyone gets paid fairly.&quot;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center font-bold text-teal-600 text-lg">A</div>
              <div>
                <h4 className="font-bold text-slate-900">Arjun P.</h4>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deliveroo Courier</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 flex flex-wrap justify-center gap-8 lg:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 cursor-default"
        >
           <div className="flex items-center gap-2 font-black text-slate-800 text-xl tracking-tighter"><ShieldCheck className="text-green-600"/> SECURE PAYOUTS</div>
           <div className="flex items-center gap-2 font-black text-slate-800 text-xl tracking-tighter"><ShieldCheck className="text-blue-600"/> ISO AI CERTIFIED</div>
           <div className="flex items-center gap-2 font-black text-slate-800 text-xl tracking-tighter"><ShieldCheck className="text-purple-600"/> NO HIDDEN FEES</div>
        </motion.div>
      </div>
    </section>
  );
}
