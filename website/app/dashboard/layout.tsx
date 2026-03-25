"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Vote,
  LayoutList,
  Settings,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Voting", href: "/dashboard/voting", icon: Vote },
  { name: "Plans", href: "/dashboard/plans", icon: LayoutList },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Support", href: "/dashboard/support", icon: HelpCircle },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Determine active index based on route. Exact match for Home, startsWith for others.
  const activeIndex = NAV_ITEMS.findIndex((item) => {
    if (item.href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(item.href);
  });

  // Calculate the top offset for the active background
  // Each link item is 48px height (py-3 = 12px padding * 2 + 24px line-height roughly, let's say 48px)
  // There is a 4px gap between items. So 52px total per slot.
  // Actually, space-y-1 applies margin-top: 0.25rem (4px) to non-first items.
  // It's easier to layout the absolute background accurately using index * 52px (48px item + 4px gap).
  const activeTopPosition = activeIndex >= 0 ? activeIndex * 52 : -100;

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col pt-8 h-full">
        <div className="px-8 mb-10 shrink-0">
          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            Survival Lens
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Financial Risk Intelligence
          </p>
        </div>

        <nav className="flex-1 px-4 relative space-y-1 overflow-y-auto">
          {/* Animated Active Background Indicator */}
          {activeIndex >= 0 && (
            <div
              className="absolute left-4 right-4 h-12 bg-blue-50 rounded-xl transition-all duration-300 ease-in-out z-0 flex items-center shadow-sm"
              style={{
                transform: `translateY(${activeTopPosition}px)`,
                top: 0,
              }}
            >
              {/* Right blue bar */}
              <div className="absolute right-[-1rem] w-1 h-8 bg-blue-600 rounded-l-full"></div>
            </div>
          )}

          {NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === activeIndex;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative z-10 flex items-center gap-3 px-4 py-3 h-12 rounded-xl font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-blue-600 font-bold"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
                }`}
              >
                <Icon size={18} className={isActive ? "text-blue-600" : ""} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto mb-8 border-t border-slate-100/50 shrink-0">
          <Link
            href="/auth/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-bold transition-colors duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden relative">
        <div className="flex-1">
          {children}
        </div>

        {/* Footer inside Dashboard */}
        <footer className="mt-auto shrink-0 py-8 px-10 border-t border-slate-200/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center bg-[#f8f9fa]">
          <p>© 2024 SURVIVAL LENS RISK INTELLIGENCE. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Cookie Policy</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Contact</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
