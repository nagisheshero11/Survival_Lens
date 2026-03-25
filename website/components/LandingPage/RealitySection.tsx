import { TrendingDown, Lock, CheckCircle2 } from "lucide-react";

export default function RealitySection() {
  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left side Cards */}
          <div className="relative space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-[90%] lg:w-[85%] relative z-10">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                <TrendingDown size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Income Volatility</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Gig economy earnings are unpredictable. One bad algorithm shift can cut income by 40% overnight.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-[90%] lg:w-[85%] ml-auto relative z-20 -mt-4">
              <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
                <Lock size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Safety Net</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Traditional insurance doesn't understand gig work. You're left unprotected during gaps.</p>
            </div>
          </div>

          {/* Right side content */}
          <div>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">The Reality of Gig Work</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
              The platform is not your partner. <br />
              <span className="text-blue-600">It's a variable.</span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Millions of independent workers are one algorithm update away from financial distress. Market saturation, platform fee changes, and seasonal drops create a constant state of risk.
            </p>
            
            <ul className="space-y-4">
              {[
                "No algorithmic transparency",
                "Unfair account deactivations",
                "Sudden market oversaturation"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
