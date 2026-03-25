"use client";

import Link from "next/link";
import { ShieldCheck, Code, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-300 py-16 lg:py-24 border-t border-slate-900 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
          
          {/* Brand & Socials Column (Takes up 2 cols on lg screens) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 cursor-pointer mb-6">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck size={18} />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl tracking-tight text-white">Survival</span>
                <span className="font-light text-xl tracking-tight text-slate-400">Lens</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              The decentralized protocol for gig-economy income resilience. Mathematical certainty against unpredictable algorithmic volatility.
            </p>
            
            <div className="flex items-center gap-4">
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-800 hover:border-slate-700 transition-all">
                <span className="font-extrabold text-sm tracking-tighter">𝕏</span>
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all">
                <Code size={18} />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 hover:border-slate-700 transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="col-span-1">
            <h4 className="text-white font-bold tracking-wide mb-6">Product</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Integrations</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Pricing</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Changelog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Documentation</a></li>
            </ul>
          </div>

          {/* Network Links */}
          <div className="col-span-1">
            <h4 className="text-white font-bold tracking-wide mb-6">Network</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Smart Contracts</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Liquidity Pool</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Run a Node</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Governance</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Tokenomics</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="col-span-1">
            <h4 className="text-white font-bold tracking-wide mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Whitepaper</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Developers API</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Security Audits</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Community</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-span-1">
            <h4 className="text-white font-bold tracking-wide mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Contact Sales</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Press Kit</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} Survival Lens Protocol. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
