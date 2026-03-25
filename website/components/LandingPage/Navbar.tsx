"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  
  // Ref to prevent scroll spy from interfering with click navigation
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Skip scroll spy updates if we are animating a click jump
      if (isProgrammaticScroll.current) return;

      // Scroll Spy Logic
      const sections = ["home", "calculator", "features", "how-it-works", "reviews"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Check if element is in the middle of viewport
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "home", label: "Home", href: "#home" },
    { id: "calculator", label: "Estimator", href: "#calculator" },
    { id: "features", label: "Features", href: "#features" },
    { id: "how-it-works", label: "How it Works", href: "#how-it-works" },
    { id: "reviews", label: "Feedback", href: "#reviews" }
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const id = targetId.replace('#', '');
    const targetElement = document.getElementById(id);
    
    if (targetElement) {
      // 1. Immediately set the active section dot to where user clicked
      isProgrammaticScroll.current = true;
      setActiveSection(id);

      // 2. Perform the offset scroll (Math.max(0) fixes floating negative glitches on top)
      window.scrollTo({
        top: Math.max(0, targetElement.offsetTop - 80),
        behavior: 'smooth'
      });

      // 3. Clear any existing timeout and re-enable scroll spy after scroll animation finishes
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 1000); 
    }
    
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "py-4" : "py-6"}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`flex justify-between items-center transition-all duration-500 rounded-full px-6 py-3 border ${isScrolled
            ? "glass-card bg-white/70 border-slate-200/50 shadow-lg shadow-slate-200/20 backdrop-blur-xl"
            : "bg-transparent border-transparent"
          }`}>
          {/* Logo */}
          <a href="#home" onClick={(e) => handleSmoothScroll(e, "#home")} className="flex-shrink-0 flex items-center gap-1 cursor-pointer">
            <span className="font-bold text-2xl tracking-tight text-slate-900">Survival</span>
            <span className="font-light text-2xl tracking-tight text-slate-500">Lens</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="relative text-sm font-bold transition-colors hover:text-blue-600 py-2 cursor-pointer flex flex-col items-center"
                >
                  <span className={isActive ? "text-blue-600" : "text-slate-600"}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-dot"
                      className="absolute -bottom-1 w-1.5 h-1.5 bg-blue-600 rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/auth/login" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
              Login
            </Link>
            <button className="relative group overflow-hidden bg-slate-900 border border-slate-800 text-white text-sm font-bold py-2.5 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/30">
              <span className="relative z-10 transition-colors duration-300">Get Protected</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 hover:text-slate-900 focus:outline-none transition-colors">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 w-full px-4 pt-4 z-50"
          >
            <div className="glass-card flex flex-col p-6 gap-6 bg-white/95 backdrop-blur-2xl shadow-2xl border border-slate-200/60 rounded-3xl">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    className={`text-lg font-bold flex items-center gap-2 cursor-pointer ${
                      isActive ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
                    }`}
                  >
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                    {link.label}
                  </a>
                );
              })}

              <div className="h-px w-full bg-slate-200/60 my-2" />

              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-slate-500 hover:text-slate-900 transition-colors text-center py-2"
              >
                Login
              </Link>

              <button className="bg-slate-900 text-white text-lg font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-black/20 hover:bg-black active:scale-95">
                Get Protected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
