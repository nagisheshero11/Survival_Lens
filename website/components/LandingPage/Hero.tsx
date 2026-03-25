"use client";

import { ArrowRight, ShieldCheck, Car, ShoppingBag, Bike, Box, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import DeliveryParallax from "../Animations/DeliveryParallax";

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 w-full flex items-center justify-center min-h-[90vh]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0,transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-200 mb-8 bg-blue-50/50 backdrop-blur-sm shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse mr-3 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest mr-3">Decentralized Intelligence</span>
              <span className="text-slate-300 mx-1">|</span>
              <span className="text-xs font-semibold text-slate-500 ml-2">v2.0 Live Network</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              The Protocol for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Income Resilience</span>
            </h1>

            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
              Survival Lens uses decentralized intelligence to protect your income against extreme weather, market volatility, and platform shifts. Autonomous stability designed for the modern independent professional.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 mb-14 relative z-20">
              <button className="group relative overflow-hidden bg-blue-600 text-white font-bold py-4 px-8 rounded-full transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-xl shadow-blue-600/20">
                <span className="relative z-10">Secure Your Income</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white hover:text-slate-900 text-slate-700 font-bold py-4 px-8 rounded-full transition-all flex items-center justify-center hover:bg-slate-50 border border-slate-200 shadow-sm shadow-blue-900/5">
                Explore The Protocol
              </button>
            </div>
          </motion.div>

          {/* Connected Platform Nodes - Beautiful Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative lg:ml-auto w-full max-w-lg flex items-center justify-center h-[500px]"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200/40 rounded-full blur-[80px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-100/30 rounded-full blur-[100px]" />

            {/* Central Core Delivery Image */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
            >
              <div className="w-48 h-48 bg-white/40 backdrop-blur-md border border-blue-200 shadow-[0_0_50px_rgba(59,130,246,0.2)] rounded-full flex flex-col items-center justify-center relative p-3 group">
                {/* Radar pulse effect behind */}
                <div className="absolute inset-0 border-2 border-blue-300 rounded-full animate-[ping_3s_ease-out_infinite] opacity-50" />
                <div className="absolute inset-2 border border-blue-100 rounded-full animate-[spin_10s_linear_infinite]" />

                {/* Delivery Rider Display */}
                <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-inner flex items-center justify-center relative z-10 border-4 border-white">
                  <img src="/images/gig-worker.png" alt="Gig Worker Protected" className="w-full h-full object-contain scale-125 translate-y-1 group-hover:scale-[1.35] transition-transform duration-700" />
                </div>

                <div className="absolute -bottom-3 bg-blue-600 text-white px-4 py-1.5 rounded-full shadow-lg border border-blue-400 flex items-center gap-2 z-20">
                  <ShieldCheck size={14} className="text-blue-200" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap">Fully Insured</span>
                </div>
              </div>
            </motion.div>

            {/* SVG Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full z-0 opacity-40 xl:-ml-4 drop-shadow-sm" viewBox="0 0 500 500">
              <path d="M250,250 L 150,120" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" className="animate-[pulse_3s_infinite]" />
              <path d="M250,250 L 380,140" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" className="animate-[pulse_3.5s_infinite]" />
              <path d="M250,250 L 110,380" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" className="animate-[pulse_2.5s_infinite]" />
              <path d="M250,250 L 390,360" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" className="animate-[pulse_4s_infinite]" />
              <path d="M250,250 L 80,250" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" className="animate-[pulse_3.2s_infinite]" />
            </svg>

            {/* Platform Node: Uber (Top Left) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, -12, 0] }}
              transition={{ delay: 0.4, y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute top-[12%] left-[10%] z-20"
            >
              <div className="bg-white border border-slate-100 p-2 rounded-2xl flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-transform hover:scale-105">
                <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-center p-0.5 w-12 h-12">
                  <img src="/logos/uber.png" alt="Uber" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="pr-4 py-1 flex flex-col">
                  <span className="font-extrabold text-sm text-slate-900 tracking-tight">Uber</span>
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">— Protected</span>
                </div>
              </div>
            </motion.div>

            {/* Platform Node: Zomato (Top Right) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, 15, 0] }}
              transition={{ delay: 0.6, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute top-[15%] -right-[5%] lg:-right-[10%] z-20"
            >
              <div className="bg-white border border-slate-100 p-2 rounded-2xl flex items-center gap-3 shadow-[0_10px_30px_rgba(226,55,68,0.15)] transition-transform hover:scale-105">
                <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-center w-12 h-12">
                  <img src="/logos/zomato.png" alt="Zomato" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="pr-4 py-1 flex flex-col">
                  <span className="font-extrabold text-sm text-red-600 tracking-tight">Zomato</span>
                  <span className="text-[10px] text-slate-500 font-medium">Route Secured</span>
                </div>
              </div>
            </motion.div>

            {/* Platform Node: Swiggy (Bottom Left) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
              transition={{ delay: 0.8, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute bottom-[10%] -left-[5%] z-20"
            >
              <div className="bg-white border border-slate-100 p-2 rounded-2xl flex items-center gap-3 shadow-[0_10px_30px_rgba(252,128,25,0.15)] transition-transform hover:scale-105">
                <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-center w-12 h-12 p-1">
                  <img src="/logos/swiggy.png" alt="Swiggy" className="w-full h-full object-contain" />
                </div>
                <div className="pr-4 py-1 flex flex-col">
                  <span className="font-extrabold text-sm text-orange-500 tracking-tight">Swiggy</span>
                  <span className="text-[10px] text-slate-500 font-medium">Sync Active</span>
                </div>
              </div>
            </motion.div>

            {/* Platform Node: Deliveroo (Bottom Right) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, 12, 0] }}
              transition={{ delay: 1, y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute bottom-[18%] lg:bottom-[15%] right-[2%] lg:-right-[5%] z-20"
            >
              <div className="bg-white border border-slate-100 p-2 rounded-2xl flex items-center gap-3 shadow-[0_10px_30px_rgba(0,204,188,0.15)] transition-transform hover:scale-105">
                <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-center w-12 h-12">
                  <img src="/logos/deliveroo.png" alt="Deliveroo" className="w-full h-full object-cover" />
                </div>
                <div className="pr-4 py-1 flex flex-col">
                  <span className="font-extrabold text-sm text-teal-500 tracking-tight">Deliveroo</span>
                  <span className="text-[10px] text-slate-500 font-medium">Live Feed</span>
                </div>
              </div>
            </motion.div>

            {/* Platform Node: Rapido (Middle Left - Scaled down) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 0.9, opacity: 1, y: [0, -8, 0] }}
              transition={{ delay: 1.2, y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute top-[45%] -left-[10%] lg:-left-[15%] z-10"
            >
              <div className="bg-white border border-slate-100 p-2 rounded-2xl flex items-center gap-3 shadow-[0_10px_30px_rgba(249,191,37,0.15)] transition-transform hover:scale-105">
                <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-center w-10 h-10 p-1">
                  <img src="/logos/rapido.png" alt="Rapido" className="w-full h-full object-contain" />
                </div>
                <div className="pr-3 py-1 flex flex-col">
                  <span className="font-extrabold text-sm text-yellow-600 tracking-tight">Rapido</span>
                  <span className="text-[10px] text-slate-500 font-medium">Monitored</span>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>

    </section>
  );
}
