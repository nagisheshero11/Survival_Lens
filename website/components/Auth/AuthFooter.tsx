export default function AuthFooter() {
  return (
    <footer className="w-full py-8 text-center mt-auto md:pb-8 flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 gap-4">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        © 2024 Survival Lens Risk Intelligence. All rights reserved.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-6">
        <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
          Privacy Policy
        </a>
        <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
          Terms of Service
        </a>
        <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
          Support
        </a>
      </div>
    </footer>
  );
}
