"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-16 mt-20 relative z-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1 cursor-pointer">
            <span className="font-bold text-xl tracking-tight text-slate-800">Survival</span>
            <span className="font-light text-xl tracking-tight text-slate-500">Lens</span>
          </Link>
          <span className="text-slate-300 mx-4">|</span>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            © {new Date().getFullYear()} Protocol
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-8 justify-center">
          <a href="#" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Privacy</a>
          <a href="#" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Terms</a>
          <a href="#" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Audits</a>
          <a href="#" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Developers</a>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors uppercase text-xs font-bold tracking-widest">𝕏</a>
          <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors uppercase text-xs font-bold tracking-widest">GitHub</a>
          <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors uppercase text-xs font-bold tracking-widest">Discord</a>
        </div>
      </div>
    </footer>
  );
}
