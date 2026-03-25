"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      // Offset added so that it activates when the section is near the top of the viewport
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      const sections = ["home", "about", "features", "pricing"];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section);
          }
        }
      }
      
      // If we're at the very top, always highlight home
      if (window.scrollY < 50) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "features", label: "Features" },
    { id: "pricing", label: "Pricing" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1 cursor-pointer">
            <span className="font-bold text-xl tracking-tight text-blue-600">Survival</span>
            <span className="font-bold text-xl tracking-tight text-slate-900">Lens</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center space-x-12">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`text-sm transition-all pb-1 border-b-2 ${
                  activeSection === link.id
                    ? "font-semibold text-blue-600 border-blue-600"
                    : "font-medium text-slate-500 border-transparent hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Login
            </Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-5 rounded-full transition-all shadow-sm hover:shadow-md">
              Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
