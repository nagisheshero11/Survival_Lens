import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, CreditCard, FileText, LayoutDashboard, Users, Wallet } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const navItems = [
  { href: "/v1/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/v1/admin/users", label: "Users", icon: Users },
  { href: "/v1/admin/claims", label: "Claims", icon: FileText },
  { href: "/v1/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/v1/admin/activity", label: "Activity", icon: Activity },
  { href: "/v1/admin/wallet", label: "Wallet", icon: Wallet },
];

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/v1/admin/auth/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Survival Lens</p>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Admin Console</h1>
          </div>
          <nav className="mt-4 flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
