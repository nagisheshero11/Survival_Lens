import {
  FilePlus,
  BarChart2,
  ShieldCheck,
  Wrench,
  Eye,
  ThumbsUp,
  BadgeCheck
} from "lucide-react";
import Image from "next/image";

export default function VotingPage() {
  return (
    <div className="p-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Voting Chamber
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Validate community risk claims to maintain the integrity of our financial
            intelligence ecosystem.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#0055ff] hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(0,85,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,85,255,0.23)] hover:-translate-y-0.5 transition-all text-sm">
          <FilePlus size={18} strokeWidth={2.5} />
          Raise Support for Proof
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200/60 mb-8">
        <button className="flex items-center gap-2 pb-4 px-2 border-b-2 border-blue-600 text-blue-600 font-bold mr-8 tracking-wide">
          Support
          <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
            12
          </span>
        </button>
        <button className="flex items-center gap-2 pb-4 px-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium mr-8 transition-colors">
          Supported
          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
            48
          </span>
        </button>
        <button className="flex items-center gap-2 pb-4 px-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium transition-colors">
          Raised
        </button>
      </div>

      {/* 3 Claim Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white rounded-[1.5rem] p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <BarChart2 size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Market Disruption
                    </span>
                    <span className="bg-red-100 text-red-600 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-lg flex items-center shrink-0">
                      High Risk
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    Gig Platform Payout Shift
                  </h3>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
              Systemic delay in payout cycles detected across major logistics
              platforms in the Tri-State area. Potential liquidity crisis for
              independent contractors.
            </p>
          </div>

          <div>
            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2 mt-1">
                <span>Consensus Required</span>
                <span className="text-blue-600">78% / 100%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "78%" }}></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors text-sm">
                <Eye size={16} />
                Details
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#0055ff] hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-[0_4px_14px_0_rgba(0,85,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,85,255,0.23)] hover:-translate-y-0.5 transition-all text-sm">
                <ThumbsUp size={16} />
                Support
              </button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-[1.5rem] p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={20} className="text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Regulatory Flux
                    </span>
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-lg flex items-center shrink-0">
                      Verified Lead
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    New Independent Tax Law
                  </h3>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
              Unverified reports of a 4% surtax on gig-economy earnings in
              Washington State starting Q3. Seeking secondary proof of policy
              documentation.
            </p>
          </div>

          <div>
            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2 mt-1">
                <span>Consensus Required</span>
                <span className="text-blue-600">42% / 100%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "42%" }}></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors text-sm">
                <Eye size={16} />
                Details
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#0055ff] hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-[0_4px_14px_0_rgba(0,85,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,85,255,0.23)] hover:-translate-y-0.5 transition-all text-sm">
                <ThumbsUp size={16} />
                Support
              </button>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-[1.5rem] p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Wrench size={20} className="text-slate-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Tooling Failure
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-lg flex items-center shrink-0">
                      Medium Risk
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    CRM API Blackout
                  </h3>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
              Widespread API failures for major CRM tools used by freelance
              consultants. Impacting billing and client management for over 200
              users.
            </p>
          </div>

          <div>
            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2 mt-1">
                <span>Consensus Required</span>
                <span className="text-blue-600">91% / 100%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "91%" }}></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors text-sm">
                <Eye size={16} />
                Details
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#0055ff] hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-[0_4px_14px_0_rgba(0,85,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,85,255,0.23)] hover:-translate-y-0.5 transition-all text-sm">
                <ThumbsUp size={16} />
                Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Layout - 2 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dark Card */}
        <div className="md:col-span-2 bg-[#1A2541] rounded-[1.5rem] p-8 text-white relative overflow-hidden shadow-lg border border-[#2A3755]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Why your vote matters?</h2>
            <p className="text-slate-300 font-medium leading-relaxed max-w-xl mb-8">
              Every supported claim strengthens the collective intelligence. Your
              validation triggers automated risk mitigation protocols for the
              entire gig community.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#1A2541] bg-slate-400 z-30"></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#1A2541] bg-slate-500 z-20"></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#1A2541] bg-slate-600 z-10"></div>
              </div>
              <span className="text-sm font-medium text-slate-300">
                +2.4k analysts active today
              </span>
            </div>
          </div>
        </div>

        {/* Light Gray Impact Card */}
        <div className="bg-slate-100 rounded-[1.5rem] p-8 flex flex-col justify-center border border-slate-200 shadow-inner overflow-hidden">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2">
            Your Impact
          </p>
          <div className="mb-4">
            <h2 className="text-5xl font-extrabold text-[#0055ff] tracking-tight mb-2">
              84%
            </h2>
            <p className="text-sm font-medium text-slate-700">
              Trust Reliability Score
            </p>
          </div>
          <div className="flex items-center gap-2 mt-auto text-emerald-600 bg-emerald-100 py-1.5 px-3 rounded-full w-max">
            <BadgeCheck size={16} className="fill-emerald-100" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Top Contributor Status
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
