import { Bell, Wallet, ShieldCheck, ArrowRight, Activity, CloudRain, Flame, Construction, BadgeCheck } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full relative">
      
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute left-[-10%] top-[40%] w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ── PAGE HEADER ── */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100/50">
              Live Feed
            </span>
            <span className="text-slate-400 text-xs font-bold tracking-tight">Last synced: Just now</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-1">
            Overview
          </h1>
          <p className="text-slate-500 font-medium">
            Your geospatial risk profile is <span className="text-emerald-500 font-bold">Stable & Protected</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <button className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors relative">
             <Bell size={18} strokeWidth={2.5} />
             <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full translate-x-1 -translate-y-1"></div>
          </button>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 overflow-hidden ring-1 ring-slate-200 shadow-sm flex items-center justify-center text-slate-400 font-black tracking-tight cursor-pointer hover:ring-blue-200 transition-colors">
            MS
          </div>
        </div>
      </div>

      {/* ── METRICS GRID ── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8">
        
        {/* Profile Identity Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="w-20 h-20 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-full border-[3px] border-white shadow-md flex items-center justify-center text-xl font-black text-slate-400 tracking-tight">
               MS
            </div>
            <div className="absolute bottom-0 right-0 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm border border-slate-100">
              <BadgeCheck size={16} className="text-blue-500 fill-blue-50" />
            </div>
          </div>
          <h2 className="text-lg font-black text-slate-900 mb-1 tracking-tight">Marcus Sterling</h2>
          <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-6">Verified Gig Driver</p>
          
          <div className="w-full flex justify-between px-2 border-t border-slate-100/60 pt-5">
            <div className="text-left">
               <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em] mb-1">Account Level</p>
               <p className="text-[13px] font-bold text-slate-900 tracking-tight">Pro</p>
            </div>
            <div className="text-right">
               <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em] mb-1">Platforms Linked</p>
               <p className="text-[13px] font-bold text-slate-900 tracking-tight">Uber, Swiggy</p>
            </div>
          </div>
        </div>

        {/* Protected Income Floor */}
        <div className="bg-slate-900 rounded-[2rem] p-6 lg:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.15)] text-white flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle animated card reflection */}
          <div className="absolute inset-0 bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] uppercase font-black tracking-[0.2em]">
                 Guaranteed Floor
              </span>
              <Wallet size={20} className="text-emerald-400" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Available Buffer</p>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-2">₹12,450</h2>
            <p className="text-xs font-medium text-slate-500">+₹850 accrued from disruptions this week.</p>
          </div>

          <div className="flex gap-3 relative z-10 mt-8">
            <button className="flex-1 bg-white/10 hover:bg-white/15 text-white py-3.5 rounded-2xl font-bold text-sm transition-colors border border-white/5 backdrop-blur-md">
              Withdraw
            </button>
            <button className="flex-x bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3.5 rounded-2xl font-black text-sm transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              Auto-Claim
            </button>
          </div>
        </div>

        {/* Coverage Active Status */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="bg-blue-50 text-blue-600 text-[9px] uppercase font-black tracking-[0.2em] px-3 py-1.5 rounded-lg border border-blue-100/50">
                 Active Status
              </span>
              <Activity size={20} className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Geospatial Protection</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Monitoring hyper-local weather patterns, traffic congestion, and blockades to guarantee standard earning rates.
            </p>
          </div>
          <button className="flex justify-between items-center w-full pt-6 mt-6 border-t border-slate-100/60 text-[13px] font-black tracking-tight text-blue-600 hover:text-blue-700 transition-colors group">
            Configure Threat Thresholds
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── INTELLIGENCE FEED & HISTORY ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Recent Disruption Payouts */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-2xl rounded-[2rem] p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white">
          <div className="flex justify-between items-end mb-8">
            <div>
               <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">Recent Buffer Payouts</h2>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">History of earnings protected automatically.</p>
            </div>
            <button className="text-xs font-black tracking-tight text-slate-400 hover:text-slate-900 transition-colors py-2 px-4 rounded-xl border border-slate-200/60">
              Download Log
            </button>
          </div>
          
          <div className="w-full">
            {/* Elegant List Headers */}
            <div className="grid grid-cols-4 px-4 py-3 bg-slate-50/50 rounded-xl text-[9px] uppercase tracking-[0.2em] font-black text-slate-400 mb-4 border border-slate-100/50">
              <div className="col-span-1">Disruption Event</div>
              <div className="col-span-1 text-center">Amount Secured</div>
              <div className="col-span-1 text-center">Timestamp</div>
              <div className="col-span-1 text-right">Status</div>
            </div>

            <div className="space-y-3">
              {/* Event 1 */}
              <div className="grid grid-cols-4 items-center px-4 py-4 border border-slate-100/60 bg-white rounded-2xl hover:border-slate-300/50 hover:shadow-sm transition-all cursor-default">
                <div className="col-span-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50 text-blue-500">
                     <CloudRain size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-slate-900 tracking-tight">Monsoon Downpour</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Velocity -40%</p>
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[15px] font-black text-slate-900 tracking-tight">+₹300.00</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Today</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">14:22 PM</p>
                </div>
                <div className="col-span-1 flex justify-end">
                  <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-lg border border-emerald-100/50 shadow-sm">
                    Credited
                  </span>
                </div>
              </div>

              {/* Event 2 */}
              <div className="grid grid-cols-4 items-center px-4 py-4 border border-slate-100/60 bg-white rounded-2xl hover:border-slate-300/50 hover:shadow-sm transition-all cursor-default">
                <div className="col-span-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100/50 text-orange-500">
                     <Construction size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-slate-900 tracking-tight">Route Obstruction</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Detour +45m</p>
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[15px] font-black text-slate-900 tracking-tight">+₹150.00</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Yesterday</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">09:15 AM</p>
                </div>
                <div className="col-span-1 flex justify-end">
                  <span className="flex items-center gap-1.5 bg-slate-50 text-slate-500 text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-lg border border-slate-200/50 shadow-sm">
                    Processing
                  </span>
                </div>
              </div>

              {/* Event 3 */}
              <div className="grid grid-cols-4 items-center px-4 py-4 border border-slate-100/60 bg-white rounded-2xl hover:border-slate-300/50 hover:shadow-sm transition-all cursor-default opacity-80">
                <div className="col-span-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100/50 text-red-500">
                     <Flame size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[13px] font-black text-slate-900 tracking-tight">Extreme Heatwave</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Safety AI Protocol</p>
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[15px] font-black text-slate-900 tracking-tight">+₹450.00</p>
                </div>
                <div className="col-span-1 text-center">
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Oct 12</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">16:45 PM</p>
                </div>
                <div className="col-span-1 flex justify-end">
                   <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-lg border border-emerald-100/50 shadow-sm">
                    Credited
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Brief */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white flex flex-col relative overflow-hidden">
          
          <div className="mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">Intelligence Brief</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next 24 Hours</p>
          </div>
          
          <div className="space-y-6 flex-1">
            
            {/* Intel 1 */}
            <div className="flex gap-4 relative">
               <div className="absolute left-5 top-10 bottom-[-24px] w-px bg-slate-100" />
               <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50 relative z-10 text-indigo-500">
                <CloudRain size={16} strokeWidth={2.5} />
               </div>
               <div className="pt-1">
                <h3 className="text-[13px] font-black text-slate-900 mb-1 tracking-tight">Storm Cell Approaching</h3>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-2">
                  High probability of extreme weather between 4PM - 8PM. Base earning rates buffered automatically.
                </p>
               </div>
            </div>

            {/* Intel 2 */}
            <div className="flex gap-4 relative">
               <div className="absolute left-5 top-10 bottom-[-24px] w-px bg-slate-100" />
               <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100/50 relative z-10 text-orange-500">
                <Construction size={16} strokeWidth={2.5} />
               </div>
               <div className="pt-1">
                <h3 className="text-[13px] font-black text-slate-900 mb-1 tracking-tight">Main Arterial Blocked</h3>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-2">
                  Major congestion projected on I-95 south. Algorithmic detours active; delays buffered.
                </p>
               </div>
            </div>

            {/* Intel 3 */}
            <div className="flex gap-4 relative">
               <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100/50 relative z-10 text-emerald-600">
                <ShieldCheck size={16} strokeWidth={2.5} />
               </div>
               <div className="pt-1">
                <h3 className="text-[13px] font-black text-slate-900 mb-1 tracking-tight">Vault Secure</h3>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-2">
                  All weekly targets met and guaranteed. Liquidity withdrawal requested successfully.
                </p>
               </div>
            </div>

          </div>
          
          <button className="w-full mt-8 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 rounded-xl text-sm font-black tracking-tight transition-colors shadow-sm">
            Configure Radars
          </button>
        </div>

      </div>
    </div>
  );
}
