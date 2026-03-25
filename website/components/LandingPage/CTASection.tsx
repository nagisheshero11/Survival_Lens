export default function CTASection() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-blue-600 rounded-[2.5rem] p-12 lg:p-20 text-center text-white shadow-2xl relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to stabilize your future?</h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join 15,000+ gig workers who have stopped worrying about the next algorithm update and started building real financial resilience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-full transition-all hover:bg-slate-50 hover:scale-105 shadow-xl">
              Join the Community
            </button>
            <button className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full transition-all hover:bg-white/10 hover:border-white">
              View Pricing Plans
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
