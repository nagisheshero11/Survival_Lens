import { 
  Plus, 
  Landmark, 
  CreditCard, 
  LineChart, 
  CornerUpLeft, 
  Ban, 
  Clock 
} from "lucide-react";

export default function SupportPage() {
  return (
    <div className="p-10 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Support Requests
          </h1>
          <p className="text-slate-500 font-medium">
            Manage and track your risk intelligence support tickets
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#0055ff] hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(0,85,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,85,255,0.23)] hover:-translate-y-0.5 transition-all text-sm">
          <Plus size={18} strokeWidth={2.5} />
          Raise Ticket
        </button>
      </div>

      {/* Tickets List */}
      <div className="space-y-6">
        
        {/* Ticket 1: Resolved */}
        <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Landmark size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  ID: SL-9402
                </p>
                <h3 className="text-lg font-bold text-slate-900">
                  Financial Discrepancy in Q3 Projections
                </h3>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shrink-0">
              Resolved
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 mb-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              Issue Description
            </p>
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              The gig-economy risk multiplier for urban centers seems to be miscalculating the inflation hedge. Requesting a review of the underlying data source for metropolitan transit gig worker earnings.
            </p>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-r-xl border-l-4 border-l-blue-500 p-5">
            <div className="flex items-center gap-2 mb-3 text-blue-600">
              <CornerUpLeft size={16} strokeWidth={3} />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Admin Response
              </p>
            </div>
            <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
              &quot;We have updated the multiplier logic to reflect the latest Bureau of Labor Statistics data. The Q3 projections for urban centers have been recalibrated. Please refresh your dashboard to see the changes.&quot;
            </p>
          </div>
        </div>

        {/* Ticket 2: Pending */}
        <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  ID: SL-9421
                </p>
                <h3 className="text-lg font-bold text-slate-900">
                  Insurance Premium Risk API Downtime
                </h3>
              </div>
            </div>
            <span className="bg-slate-200 text-slate-600 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shrink-0">
              Pending
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 mb-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              Issue Description
            </p>
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              Attempting to fetch the premium risk score via the endpoint /v1/risk/premiums but receiving a 504 Gateway Timeout consistently for the last 20 minutes.
            </p>
          </div>

          <div className="flex items-center gap-6 px-2">
            <div className="flex items-center gap-2 text-slate-500">
              <Clock size={14} />
              <span className="text-[11px] font-bold">Opened 45 minutes ago</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="text-red-500 font-bold text-sm leading-none">!</span>
              <span className="text-[11px] font-bold">High Priority</span>
            </div>
          </div>
        </div>

        {/* Ticket 3: Rejected */}
        <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <LineChart size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  ID: SL-9388
                </p>
                <h3 className="text-lg font-bold text-slate-900">
                  Custom Dashboard Request: Crypto Risk
                </h3>
              </div>
            </div>
            <span className="bg-red-100 text-red-600 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shrink-0">
              Rejected
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 mb-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              Issue Description
            </p>
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              Requesting a specialized lens for cryptocurrency volatility as part of my risk portfolio analysis. This is critical for my crypto-based gig work.
            </p>
          </div>

          <div className="bg-red-50/50 border border-red-100 rounded-r-xl border-l-4 border-l-red-500 p-5">
            <div className="flex items-center gap-2 mb-3 text-red-600">
              <Ban size={16} strokeWidth={3} />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Admin Response
              </p>
            </div>
            <p className="text-sm font-medium text-red-600 leading-relaxed italic">
              &quot;Survival Lens currently only supports fiat-based financial risk intelligence for gig workers. We do not have roadmap plans for volatile digital asset monitoring at this stage. Request closed.&quot;
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
