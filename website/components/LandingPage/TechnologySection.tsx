import { ShieldCheck, Fingerprint } from "lucide-react";

export default function TechnologySection() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Core Technology</p>
        <h2 className="text-4xl font-bold text-slate-900 mb-12">The Engine Under the Hood</h2>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Feature */}
          <div className="lg:col-span-2 bg-slate-50 rounded-3xl p-10 border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Real-Time Risk Monitoring</h3>
            <p className="text-slate-600 mb-10 max-w-lg">
              Our engine scrapes thousands of data points across delivery, freelance, and ride-share platforms to give you a "Weather Forecast" for your earnings.
            </p>
            {/* Graphic Placeholder (Bars) */}
            <div className="flex items-end gap-2 h-24 bg-white p-4 rounded-xl shadow-sm w-fit border border-slate-100">
              <div className="w-12 h-8 bg-blue-100 rounded-t-md"></div>
              <div className="w-12 h-12 bg-blue-200 rounded-t-md"></div>
              <div className="w-12 h-20 bg-blue-600 rounded-t-md relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="w-12 h-10 bg-blue-300 rounded-t-md"></div>
              <div className="w-12 h-14 bg-blue-400 rounded-t-md"></div>
            </div>
          </div>

          {/* Side Feature */}
          <div className="bg-emerald-600 rounded-3xl p-10 text-white relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck size={120} />
            </div>
            <div className="relative z-10">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center text-white mb-6 backdrop-blur-sm">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secured by Intelligence</h3>
              <p className="text-emerald-100">
                Every claim is validated through automated data verification and community consensus.
              </p>
            </div>
          </div>

          {/* Bottom Features */}
          <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Platform Sync</h3>
            <p className="text-sm text-slate-600">
              Connect Uber, DoorDash, Upwork, and more to get a unified risk landscape of your entire gig portfolio.
            </p>
          </div>
          
          <div className="lg:col-span-2 bg-slate-100 rounded-3xl p-10 flex flex-col sm:flex-row items-center justify-between gap-8 border border-slate-200">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Zero-Knowledge Privacy</h3>
              <p className="text-sm text-slate-600 max-w-sm">
                We verify your income without ever seeing your personal identifying documents. Your data stays yours.
              </p>
            </div>
            <div className="flex-shrink-0 text-slate-300">
              <Fingerprint size={80} strokeWidth={1} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
