export default function StepsSection() {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">Four Steps to Peace of Mind</h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting Line (hidden on mobile) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-200 z-0"></div>
          
          {[
            { num: 1, title: "Register", desc: "Connect your platform profiles and verify your income streams securely." },
            { num: 2, title: "Subscribe", desc: "Select a tier tailored to your risk profile and contribution level." },
            { num: 3, title: "Raise Claim", desc: "If a system-wide or personal risk event occurs, submit your evidence." },
            { num: 4, title: "Community Vote", desc: "Decentralized verification triggers immediate payouts to your wallet." }
          ].map((step, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center relative z-10 flex flex-col items-center">
              <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-6 ring-4 ring-white">
                {step.num}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h4>
              <p className="text-sm text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
