"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Vote,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Bell,
  ChevronLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Overview",        href: "/admin",                  icon: LayoutDashboard, section: "overview" },
  { name: "Claims Queue",    href: "/admin#claims-queue",     icon: ClipboardList,   section: "claims-queue" },
  { name: "User Management", href: "/admin#user-management",  icon: Users,           section: "user-management" },
  { name: "Real-Time Voting",href: "/admin#voting",           icon: Vote,            section: "voting" },
  { name: "Risk Analytics",  href: "/admin#risk-analytics",  icon: BarChart3,       section: "risk-analytics" },
  { name: "System Settings", href: "/admin#system-settings", icon: Settings,        section: "system-settings" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("overview");

  const handleNavClick = (section: string, href: string) => {
    setActiveSection(section);
    if (href.includes("#")) {
      const id = href.split("#")[1];
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f5f7] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] bg-white border-r border-slate-100 flex flex-col h-full shrink-0">
        {/* Logo */}
        <div className="px-6 pt-7 pb-6 shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <span className="text-base font-bold text-slate-900 leading-none">Survival Lens</span>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-9">
            Intelligence Admin
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;
            return (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.section, item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Icon size={16} className={isActive ? "text-blue-600" : ""} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
                {isActive && (
                  <div className="ml-auto w-1 h-5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin user + logout */}
        <div className="px-3 pb-6 pt-3 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
              AC
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">Admin Console</p>
              <p className="text-[10px] text-slate-400 font-medium">System Master</p>
            </div>
          </div>
          <Link
            href="/auth/login"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
          >
            <LogOut size={16} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <div className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Platform</span>
            <span className="text-slate-300">/</span>
            <span className="text-blue-600 font-bold uppercase tracking-wider">Intelligence Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
              <Bell size={15} />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">3</span>
            </button>
            <button className="h-8 px-3 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
