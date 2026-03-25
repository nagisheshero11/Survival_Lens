export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-1 cursor-pointer">
            <span className="font-bold text-xl tracking-tight text-blue-600">Survival</span>
            <span className="font-bold text-xl tracking-tight text-slate-900">Lens</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center space-x-12">
            <a href="#" className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-1">Home</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Features</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">About</a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Login
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-5 rounded-full transition-all shadow-sm hover:shadow-md">
              Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
