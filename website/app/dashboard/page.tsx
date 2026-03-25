import { Bell, Wallet, ShieldCheck, ArrowRight, BarChart2, ShieldAlert, BadgeCheck } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Intelligence Dashboard
          </h1>
          <p className="text-slate-500 font-medium">
            Welcome back, your risk profile is currently <span className="text-emerald-600 font-bold">Stable</span>.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
            <Bell size={18} />
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white shadow-sm">
            <div className="w-full h-full bg-slate-400">
               {/* Placeholder for user image if no specific URL is provided, but we can just use a colored div, or load a realistic avatar from a free source */}
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Profile Card */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-slate-300 rounded-full border-[3px] border-white shadow-md overflow-hidden">
               {/* User Avatar */}
            </div>
            <div className="absolute bottom-0 right-0 bg-white rounded-full text-emerald-500 w-6 h-6 flex items-center justify-center border border-white shadow-sm">
              <BadgeCheck size={16} className="text-emerald-500 fill-emerald-100" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Marcus Sterling</h2>
          <p className="text-sm text-slate-500 font-medium mb-6">Independent Logistics Consultant</p>
          
          <div className="w-full flex justify-between px-4 border-t border-slate-100 pt-4">
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Age</p>
              <p className="text-sm font-bold text-slate-900">34 Years</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Company</p>
              <p className="text-sm font-bold text-slate-900">Sterling Gig Ltd.</p>
            </div>
          </div>
        </div>

        {/* Liquidity Card */}
        <div className="bg-[#1155ff] rounded-[1.5rem] p-6 shadow-md text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <Wallet size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs uppercase font-bold tracking-widest text-blue-100">Available Liquidity</p>
              <Wallet size={20} className="text-blue-100" />
            </div>
            <h2 className="text-4xl font-bold mb-8">$12,450.80</h2>
          </div>
          <div className="flex gap-3 relative z-10">
            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-bold text-sm transition-colors border border-white/20">
              Withdraw
            </button>
            <button className="flex-1 bg-white hover:bg-slate-50 text-blue-600 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
              Add Funds
            </button>
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="bg-blue-50 text-blue-600 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-md">
                Active Plan
              </span>
              <ShieldCheck size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Enterprise Shield</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Comprehensive risk coverage with priority AI diagnostics and legal mediation.
            </p>
          </div>
          <button className="flex justify-between items-center w-full pt-4 mt-6 border-t border-slate-100 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group">
            View Upgrade Options
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bottom 2 Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Claims */}
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Claims</h2>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Download Report
            </button>
          </div>
          
          <div className="w-full">
            <div className="grid grid-cols-4 px-4 py-3 bg-slate-50 rounded-lg text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">
              <div className="col-span-1">Reason / ID</div>
              <div className="col-span-1 text-center">Amount</div>
              <div className="col-span-1 text-center">Date & Time</div>
              <div className="col-span-1 text-right">Status</div>
            </div>

            <div className="space-y-1">
              {/* Claim 1 */}
              <div className="grid grid-cols-4 items-center px-4 py-4 border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <div className="col-span-1">
                  <p className="text-sm font-bold text-slate-900">Contract Violation</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">#CLM-99021</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-sm font-bold text-slate-900">$2,400.00</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[12px] text-slate-500 font-medium">Oct 24, 2023 ·</p>
                  <p className="text-[12px] text-slate-500 font-medium">14:22</p>
                </div>
                <div className="col-span-1 flex justify-end">
                  <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Approved
                  </span>
                </div>
              </div>

              {/* Claim 2 */}
              <div className="grid grid-cols-4 items-center px-4 py-4 border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <div className="col-span-1">
                  <p className="text-sm font-bold text-slate-900">Equipment Damage</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">#CLM-88742</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-sm font-bold text-slate-900">$850.25</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[12px] text-slate-500 font-medium">Oct 18, 2023 ·</p>
                  <p className="text-[12px] text-slate-500 font-medium">09:15</p>
                </div>
                <div className="col-span-1 flex justify-end">
                  <span className="flex items-center gap-1.5 bg-blue-100 text-blue-700 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Processing
                  </span>
                </div>
              </div>

              {/* Claim 3 */}
              <div className="grid grid-cols-4 items-center px-4 py-4 hover:bg-slate-50/50 transition-colors">
                <div className="col-span-1">
                  <p className="text-sm font-bold text-slate-900">Identity Protection</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">#CLM-77103</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-sm font-bold text-slate-900">$120.00</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[12px] text-slate-500 font-medium">Oct 12, 2023 ·</p>
                  <p className="text-[12px] text-slate-500 font-medium">16:45</p>
                </div>
                <div className="col-span-1 flex justify-end">
                  <span className="flex items-center gap-1.5 bg-red-100 text-red-700 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Flagged
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Insights */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Risk Insights</h2>
          </div>
          
          <div className="space-y-6 flex-1">
            {/* Insight 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <BarChart2 size={18} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Market Shift Detected</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2">
                  Gig-index rates in your sector dropped by 4.2% this morning. Adjust liquidity accordingly.
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">2 hours ago</p>
              </div>
            </div>

            {/* Insight 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <ShieldCheck size={18} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Policy Renewed</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2">
                  Enterprise Shield successfully rolled over for the next billing cycle.
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yesterday</p>
              </div>
            </div>

            {/* Insight 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <ShieldAlert size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">High Exposure Alert</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2">
                  Pending mediation for CLM-77103 requires your digital signature.
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3 days ago</p>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
