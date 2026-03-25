import { BarChart3, Users, Droplets } from "lucide-react";

export default function SolutionSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">The Survival Lens Solution</p>
        <h2 className="text-4xl font-bold text-slate-900 mb-6">Resilience through Intelligence</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">
          We provide a collective financial layer that acts as a buffer. By analyzing real-time gig data, we anticipate risks before they impact your bank account.
        </p>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Card 1 */}
          <div className="bg-slate-50 rounded-3xl p-10 text-left border border-slate-100">
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Predictive Risk Modeling</h3>
            <p className="text-slate-600 leading-relaxed">
              Our AI tracks global gig trends to warn you of upcoming dry spells or platform shifts in your specific niche.
            </p>
          </div>

          {/* Card 2 (Highlight) */}
          <div className="bg-blue-600 rounded-3xl p-10 text-left shadow-2xl shadow-blue-600/20 transform md:-translate-y-4 relative z-10 mt-8 md:mt-0">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center text-white mb-6 backdrop-blur-sm">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Collective Voting</h3>
            <p className="text-blue-100 leading-relaxed">
              Risk events and claims are verified by the community, ensuring transparency and fair distribution of protection funds.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-50 rounded-3xl p-10 text-left border border-slate-100">
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
              <Droplets size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Smart Liquidity</h3>
            <p className="text-slate-600 leading-relaxed">
              Access emergency funds during catastrophic income drops, backed by the Survival Lens community pool.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
