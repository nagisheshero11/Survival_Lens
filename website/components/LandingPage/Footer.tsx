export default function Footer() {
  return (
    <footer className="border-t border-slate-100 py-12 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          © 2024 Survival Lens Risk Intelligence. All rights reserved.
        </p>
        
        <div className="flex flex-wrap items-center gap-8 justify-center">
          <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase">Privacy Policy</a>
          <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase">Terms of Service</a>
          <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase">Cookie Policy</a>
          <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase">Contact</a>
        </div>
        
        <div className="flex items-center gap-4 text-slate-400">
          {/* Social links placeholder */}
          <a href="#" className="hover:text-slate-900 transition-colors uppercase text-xs font-bold">Twitter</a>
          <a href="#" className="hover:text-slate-900 transition-colors uppercase text-xs font-bold">LinkedIn</a>
          <a href="#" className="hover:text-slate-900 transition-colors uppercase text-xs font-bold">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
