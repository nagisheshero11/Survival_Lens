"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ShieldCheck, Box } from "lucide-react";

export default function DeliveryParallax() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 1 }}
      className="absolute bottom-0 left-0 w-full h-48 sm:h-56 pointer-events-none overflow-hidden z-0"
    >
      {/* Soft atmospheric gradient vanishing upward to blend into the main hero background */}
      <div className="absolute inset-0 bg-gradient-to-t from-sky-100/80 to-transparent" />

      {/* Abstract Clouds (Moving Slow) */}
      <motion.div
        className="absolute top-4 left-0 flex gap-24 sm:gap-40 opacity-50"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`bg-white rounded-full blur-[2px] ${i % 2 === 0 ? 'w-24 h-6 mt-4' : 'w-32 h-8'}`} />
        ))}
      </motion.div>

      {/* Abstract City Skyline (Moving Medium) */}
      <motion.div
        className="absolute bottom-8 left-0 flex gap-3 opacity-15"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
      >
        {/* Loop of duplicated background buildings */}
        {[...Array(30)].map((_, i) => (
          <div key={i} className={`bg-slate-500 rounded-t-sm ${i % 3 === 0 ? 'w-16 h-28' : i % 2 === 0 ? 'w-24 h-16' : 'w-12 h-36'}`} />
        ))}
      </motion.div>

      {/* Abstract Trees (Moving Fast) */}
      <motion.div
        className="absolute bottom-8 left-0 flex gap-12 sm:gap-[150px] opacity-90"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 12, ease: "linear", repeat: Infinity }}
      >
        {[...Array(20)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-400 rounded-full shadow-sm border border-emerald-300" />
            <div className="w-2 h-4 sm:h-6 bg-amber-700 rounded-t-sm" />
          </div>
        ))}
      </motion.div>

      {/* The Open Road */}
      <div className="absolute bottom-0 w-full h-10 sm:h-12 bg-slate-800 border-t-4 border-slate-600 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Dashed Line on Road (Moving Very Fast) */}
        <motion.div
          className="w-[200%] h-1 flex gap-8 items-center mt-4 sm:mt-5"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 1, ease: "linear", repeat: Infinity }}
        >
          {[...Array(30)].map((_, i) => (
            <div key={i} className="w-16 h-1 bg-yellow-400/80 rounded-full" />
          ))}
        </motion.div>
      </div>

      {/* Floating Story Locations (Restaurant -> House) */}
      <motion.div
        className="absolute bottom-8 left-[100%] flex items-end gap-[60vw] sm:gap-[800px]"
        animate={{ x: ["0px", "-2000px"] }}
        transition={{ duration: 9, ease: "linear", repeat: Infinity }}
      >
        {/* 1. Restaurant (Pick up order) */}
        <div className="flex flex-col items-center mb-1 drop-shadow-md">
          <div className="bg-red-500 text-white text-[9px] font-bold px-2.5 py-1 rounded shadow-lg mb-2 whitespace-nowrap flex items-center gap-1">
            <ShoppingBag size={10} /> Pick Up Point
          </div>
          <div className="w-20 h-20 bg-red-400 border-[3px] border-slate-800 rounded-t-xl relative flex justify-center items-end pb-0">
            <div className="w-8 h-10 bg-slate-800 rounded-t-md" />
            <div className="absolute top-2 left-2 w-4 h-4 bg-white/40 rounded-sm" />
            <div className="absolute top-2 right-2 w-4 h-4 bg-white/40 rounded-sm" />
          </div>
        </div>

        {/* 2. Customer Home (Drop off order) */}
        <div className="flex flex-col items-center mb-1 drop-shadow-md">
          <div className="bg-blue-600 text-white text-[9px] font-bold px-2.5 py-1 rounded shadow-lg mb-3 whitespace-nowrap flex items-center gap-1">
            <Box size={10} /> Delivery Address
          </div>
          <div className="w-16 h-16 bg-blue-300 border-[3px] border-slate-800 relative">
            <div className="absolute -top-[1.6rem] -left-[0.35rem] w-20 h-0 border-l-[40px] border-r-[40px] border-b-[24px] border-l-transparent border-r-transparent border-b-slate-800 drop-shadow-sm" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-8 bg-slate-800" />
            <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-300/80 rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* THE GIG-WORKER (Flipped to face right, driving continuously) */}
      <div className="absolute bottom-0 sm:bottom-[10px] left-[15%] sm:left-[25%] z-20 flex flex-col items-center">

        {/* Dynamic Interactive Tracking Popups synced perfectly with the 9s world loop */}
        <div className="absolute -top-[70px] sm:-top-[80px] w-full flex justify-center pointer-events-none z-30 drop-shadow-md">
          <motion.div
            animate={{
              opacity: [0, 1, 0, 0, 0, 0, 0],
              y: [15, 0, -15, -15, -15, -15, -15],
              scale: [0.8, 1, 0.8, 0.8, 0.8, 0.8, 0.8]
            }}
            transition={{ duration: 9, times: [0, 0.1, 0.25, 0.3, 0.8, 0.9, 1], repeat: Infinity }}
            className="absolute bg-slate-900 border border-slate-700 text-white text-[11px] sm:text-xs font-bold px-3.5 py-2 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-1.5"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Package Picked Up
          </motion.div>

          <motion.div
            animate={{
              opacity: [0, 0, 0, 1, 0, 0, 0],
              y: [15, 15, 15, 0, -15, -15, -15],
              scale: [0.8, 0.8, 0.8, 1, 0.8, 0.8, 0.8]
            }}
            transition={{ duration: 9, times: [0, 0.35, 0.4, 0.55, 0.65, 0.9, 1], repeat: Infinity }}
            className="absolute bg-blue-600 border border-blue-400 text-white text-[11px] sm:text-xs font-bold px-3.5 py-2 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-1.5"
          >
            <ShieldCheck size={14} className="text-blue-200" />
            Premium automated seamlessly!
          </motion.div>

          <motion.div
            animate={{
              opacity: [0, 0, 0, 0, 0, 1, 0],
              y: [15, 15, 15, 15, 15, 0, -15],
              scale: [0.8, 0.8, 0.8, 0.8, 0.8, 1, 0.8]
            }}
            transition={{ duration: 9, times: [0, 0.65, 0.7, 0.75, 0.8, 0.95, 1], repeat: Infinity }}
            className="absolute bg-emerald-500 border border-emerald-400 text-white text-[11px] sm:text-xs font-bold px-3.5 py-2 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-1.5"
          >
            <Box size={14} />
            Delivered successfully! + ₹65
          </motion.div>
        </div>

        {/* Actual Driver Graphic (scaled horizontally by -1 to face RIGHT, bouncing) */}
        <motion.div
          animate={{ y: [-1, 2, -1], rotate: [-1, 1, -1] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "linear" }}
          className="w-28 h-28 sm:w-36 sm:h-36 relative origin-bottom scale-x-[-1]"
        >
          <img src="/images/gig-worker.png" alt="Rider Driving" className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.15)]" />
        </motion.div>
      </div>
    </motion.div>
  );
}
