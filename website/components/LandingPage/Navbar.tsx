"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      const offset = window.innerHeight / 3;
      const sections = ["home", "about", "features", "pricing"];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollY + offset >= offsetTop && scrollY + offset < offsetTop + height) {
            setActiveSection(section);
          }
        }
      }
      if (scrollY < 50) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "features", label: "Features" },
    { id: "pricing", label: "Pricing" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-500 rounded-full px-6 py-3 ${
          isScrolled ? "glass-card bg-white/70" : "bg-transparent"
        }`}>
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1 cursor-pointer">
            <span className="font-bold text-2xl tracking-tight text-slate-900">Survival</span>
            <span className="font-light text-2xl tracking-tight text-slate-500">Lens</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="relative text-sm font-medium transition-colors hover:text-slate-900"
              >
                <span className={activeSection === link.id ? "text-blue-600 font-bold" : "text-slate-600"}>
                  {link.label}
                </span>
                {activeSection === link.id && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-[2px] bg-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Login
            </Link>
            <button className="relative group overflow-hidden bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 text-sm font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-sm">
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Get Protected</span>
              <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 hover:text-slate-900 focus:outline-none">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full px-4 pt-2"
          >
            <div className="glass-card flex flex-col p-4 gap-4 bg-white/90 shadow-xl border border-slate-200">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium ${
                    activeSection === link.id ? "text-blue-600 font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px w-full bg-slate-100 my-2" />
              <Link href="/auth/login" className="text-base font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Login
              </Link>
              <button className="bg-blue-600 text-white text-base font-bold py-3 rounded-xl transition-all shadow-md">
                Get Protected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
