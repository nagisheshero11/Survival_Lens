"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Vote,
  ShieldCheck,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Voting", href: "/dashboard/voting", icon: Vote },
  { name: "Coverage Plans", href: "/dashboard/plans", icon: ShieldCheck },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Raise Ticket", href: "/dashboard/support", icon: HelpCircle },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Determine active index based on route. Exact match for Overview, startsWith for others.
  const activeIndex = NAV_ITEMS.findIndex((item) => {
    if (item.href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(item.href);
  });

  return (
    <div className="flex bg-[#f8fafc] h-screen font-sans text-slate-900 overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* ── PREMIUM SIDEBAR ── */}
      <aside className="w-[280px] bg-[#fcfdfd] border-r border-slate-200/60 flex flex-col pt-8 h-full shadow-[4px_0_24px_rgba(0,0,0,0.01)] relative z-20">
        
        {/* Brand Logo Header */}
        <div className="px-8 mb-10 shrink-0 select-none">
          <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tight">
            Survival <span className="text-slate-400 font-medium">Lens</span>
          </h1>
          <div className="flex items-center gap-2 mt-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">
              System Active
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 mt-2 select-none">
            Intelligence
          </p>
          
          <AnimatePresence>
            {NAV_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeIndex;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[14px] font-bold transition-colors duration-200 outline-none group ${
                    isActive
                      ? "text-blue-700"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {/* Framer Motion Active Indicator (Stripe Method) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarPill"
                      className="absolute inset-0 bg-blue-50 border border-blue-100/50 rounded-2xl shadow-sm z-0"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    >
                      {/* Left accent bar */}
                      <div className="absolute left-[-1px] top-[20%] bottom-[20%] w-1 bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                    </motion.div>
                  )}

                  <div className="relative z-10 flex items-center justify-center">
                     <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600 transition-colors"} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="relative z-10 tracking-tight">{item.name}</span>
                </Link>
              );
            })}
          </AnimatePresence>
        </nav>

        {/* Bottom User Area */}
        <div className="p-4 mt-auto border-t border-slate-200/60 shrink-0 bg-slate-50/50">
          <Link
            href="/auth/login"
            className="group flex items-center justify-between px-4 py-3.5 rounded-2xl text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-sm font-bold transition-all duration-200"
          >
            <div className="flex items-center gap-3.5">
               <LogOut size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" strokeWidth={2} />
               <span className="text-[14px] tracking-tight group-hover:text-red-600 transition-colors">Terminate Session</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* ── MAIN SCROLLABLE CONTENT ── */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden relative scroll-smooth">
        <div className="flex-1 w-full relative z-10">
          {children}
        </div>

        {/* Premium Corporate Footer */}
        <footer className="mt-auto shrink-0 py-8 px-10 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-center bg-[#fcfdfd] relative z-20">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-slate-400" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              © 2026 SURVIVAL LENS PROTOCOL
            </p>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">System Status</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
