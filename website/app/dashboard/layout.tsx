import { ReactNode } from "react";
import Link from "next/link";
import {
  Home,
  Vote,
  LayoutList,
  Settings,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col pt-8">
        <div className="px-8 mb-10">
          <h1 className="text-xl font-bold text-slate-900 leading-tight">
            Survival Lens
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Financial Risk Intelligence
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-bold relative"
          >
            <Home size={18} className="text-blue-600" />
            <span>Home</span>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-l-full"></div>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
          >
            <Vote size={18} />
            <span>Voting</span>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
          >
            <LayoutList size={18} />
            <span>Plans</span>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
          >
            <User size={18} />
            <span>Profile</span>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
          >
            <HelpCircle size={18} />
            <span>Support</span>
          </Link>
        </nav>

        <div className="p-4 mt-auto mb-8 border-t border-slate-100/50">
          <Link
            href="/auth/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-bold transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {children}

        {/* Footer inside Dashboard */}
        <footer className="mt-auto py-8 px-10 border-t border-slate-200/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center bg-[#f8f9fa]">
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
