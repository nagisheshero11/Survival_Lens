import { 
  CheckCircle2, 
  XCircle, 
  Info, 
  Star, 
  ShieldAlert, 
  Cloud, 
  Network, 
  Clock 
} from "lucide-react";

export default function PlansPage() {
  return (
    <div className="p-10 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="max-w-2xl mb-12">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
          Subscription Management
        </p>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Intelligent Protection Plans
        </h1>
        <p className="text-slate-500 font-medium leading-relaxed">
          Select a risk intelligence tier tailored to your gig-economy workflow. All plans include 256-bit encryption and real-time market volatility alerts.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 relative">
        
        {/* ESSENTIAL - Card */}
        <div className="bg-white rounded-[1.5rem] p-8 flex flex-col pt-10 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] h-full">
          <div className="mb-6">
            <span className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full inline-block mb-4">
              Essential
            </span>
            <div className="flex items-baseline gap-1 mb-2">
              <h2 className="text-4xl font-extrabold text-slate-900">$29</h2>
              <span className="text-sm font-medium text-slate-500">/month</span>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Fundamental risk monitoring for sole proprietors.
            </p>
          </div>
          
          <div className="flex-1">
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-600">Real-time earnings volatility alerts</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-600">Tax exposure forecasting</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-600">Basic expense tracking</span>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <XCircle size={18} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-400">Advanced legal protection</span>
              </li>
            </ul>
          </div>
          
          <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-colors text-sm">
            Downgrade to Essential
          </button>
        </div>

        {/* PROFESSIONAL - Active Card */}
        <div className="bg-white rounded-[1.5rem] p-8 flex flex-col relative border-2 border-blue-600 shadow-[0_12px_40px_-12px_rgba(0,85,255,0.2)] h-full z-10 transform lg:-translate-y-2">
          {/* Floating Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0055ff] text-white text-[10px] uppercase font-bold tracking-widest px-5 py-2 rounded-full shadow-md text-center whitespace-nowrap">
            Current<br/>Active Plan
          </div>

          <div className="mb-6 pt-6">
            <span className="bg-blue-50 text-blue-600 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full inline-block mb-4">
              Professional
            </span>
            <div className="flex items-baseline gap-1 mb-2">
              <h2 className="text-5xl font-extrabold text-slate-900">$79</h2>
              <span className="text-sm font-medium text-slate-500">/month</span>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              High-fidelity risk analytics for established freelancers.
            </p>
          </div>
          
          <div className="flex-1">
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5 fill-emerald-100" />
                <span className="text-sm font-bold text-slate-800">Predictive cashflow modeling (AI)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5 fill-emerald-100" />
                <span className="text-sm font-bold text-slate-800">Health & Disability insurance matching</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5 fill-emerald-100" />
                <span className="text-sm font-bold text-slate-800">Auditing support & compliance</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5 fill-emerald-100" />
                <span className="text-sm font-bold text-slate-800">Platform diversification scoring</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-center gap-2 mb-6 border border-blue-100/50">
            <span className="text-xs font-bold text-blue-800">Your next bill: Dec 12, 2024</span>
            <Info size={14} className="text-blue-500" />
          </div>

          <button className="w-full bg-slate-100 text-slate-400 font-bold py-3.5 rounded-xl cursor-default text-sm">
            Already Active
          </button>
        </div>

        {/* ENTERPRISE - Card */}
        <div className="bg-white rounded-[1.5rem] p-8 flex flex-col pt-10 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] h-full">
          <div className="mb-6">
            <span className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full inline-block mb-4">
              Enterprise
            </span>
            <div className="flex items-baseline gap-1 mb-2">
              <h2 className="text-4xl font-extrabold text-slate-900">$199</h2>
              <span className="text-sm font-medium text-slate-500">/month</span>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Total asset protection for multi-stream entities.
            </p>
          </div>
          
          <div className="flex-1">
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Star size={16} className="text-emerald-600 shrink-0 mt-0.5 fill-emerald-600" />
                <span className="text-sm font-medium text-slate-600">White-glove financial concierging</span>
              </li>
              <li className="flex items-start gap-3">
                <Star size={16} className="text-emerald-600 shrink-0 mt-0.5 fill-emerald-600" />
                <span className="text-sm font-medium text-slate-600">Automated LLC legal shielding</span>
              </li>
              <li className="flex items-start gap-3">
                <Star size={16} className="text-emerald-600 shrink-0 mt-0.5 fill-emerald-600" />
                <span className="text-sm font-medium text-slate-600">Global tax jurisdiction arbitrage</span>
              </li>
              <li className="flex items-start gap-3">
                <Star size={16} className="text-emerald-600 shrink-0 mt-0.5 fill-emerald-600" />
                <span className="text-sm font-medium text-slate-600">Unlimited wealth management seats</span>
              </li>
            </ul>
          </div>
          
          <button className="w-full bg-[#0055ff] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(0,85,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,85,255,0.23)] hover:-translate-y-0.5 transition-all text-sm">
            Upgrade to Enterprise
          </button>
        </div>

      </div>

      {/* The Survival Lens Guarantee */}
      <div className="bg-slate-100 rounded-[2rem] p-10 lg:p-12 flex flex-col lg:flex-row items-center gap-12 border border-slate-200">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            The Survival Lens Guarantee
          </h2>
          <p className="text-slate-600 font-medium leading-relaxed mb-8 max-w-lg">
            We don't just provide data; we provide peace of mind. Every subscription includes our proprietary <strong>Financial Survivability Index (FSI)</strong> scoring, updated every 15 minutes based on global market shifts and your specific industry niche.
          </p>
          
          <div className="flex gap-10">
            <div>
              <p className="text-2xl font-bold text-[#0055ff] mb-1">99.9%</p>
              <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">
                Uptime Reliability
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0055ff] mb-1">$2M+</p>
              <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">
                Managed Risk Coverage
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          {/* Guarantee Cards */}
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100">
            <ShieldAlert size={28} className="text-blue-600 mb-3" />
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-900">
              Military Grade
            </span>
          </div>
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100">
            <Cloud size={28} className="text-blue-600 mb-3" />
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-900">
              Daily Backups
            </span>
          </div>
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100">
            <Network size={28} className="text-blue-600 mb-3" />
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-900">
              Full API Access
            </span>
          </div>
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100">
            <Clock size={28} className="text-blue-600 mb-3" />
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-900">
              24/7 Priority
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
