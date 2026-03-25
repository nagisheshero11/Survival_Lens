import { 
  Pencil, 
  CheckCircle2, 
  IdCard, 
  Lock, 
  AlertTriangle 
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-10 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
          Account Configuration
        </p>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 inline-block relative">
          Settings & Profile
          <div className="absolute -bottom-2 left-0 w-24 h-1 bg-blue-600"></div>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="space-y-8 flex flex-col">
          
          {/* Profile Card */}
          <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-28 h-28 bg-slate-900 rounded-full border-4 border-white shadow-lg overflow-hidden flex flex-col items-center justify-end relative">
                {/* Simplified avatar using pure CSS shapes, mimicking the user's uploaded avatar shape */}
                <div className="w-12 h-12 bg-amber-100 rounded-t-full absolute bottom-4 z-10"></div>
                <div className="w-16 h-10 bg-slate-800 rounded-t-[2.5rem] absolute bottom-0 z-20"></div>
                <div className="w-16 h-8 bg-slate-900 rounded-full absolute top-2 z-20"></div>
              </div>
              <button className="absolute bottom-1 right-1 bg-blue-600 rounded-full p-2 text-white border-2 border-white shadow-sm hover:bg-blue-700 transition-colors">
                <Pencil size={12} strokeWidth={3} />
              </button>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              @johndoe_risk
            </h2>
            <p className="text-sm font-medium text-slate-500 mb-8">
              Elite Gig Consultant
            </p>
            
            <div className="w-full flex justify-between px-6 border-t border-slate-100 pt-6">
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-blue-600 tracking-widest mb-1.5">
                  Status
                </p>
                <p className="text-sm font-bold text-slate-900">
                  Verified
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-blue-600 tracking-widest mb-1.5">
                  Joined
                </p>
                <p className="text-sm font-bold text-slate-900">
                  Oct 2023
                </p>
              </div>
            </div>
          </div>

          {/* Identity Verification */}
          <div className="bg-slate-50/50 rounded-[1.5rem] p-8 border border-slate-100 mt-8">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-5">
              Identity Verification
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-100" />
                  <span className="text-sm font-bold text-slate-800">PAN Card</span>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md">
                  Submitted
                </span>
              </div>
              
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-100" />
                  <span className="text-sm font-bold text-slate-800">Aadhaar Card</span>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md">
                  Submitted
                </span>
              </div>
            </div>
            
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Verification ensures high-tier financial risk reports and lower premium quotes.
            </p>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information */}
          <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <IdCard size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <div className="w-full bg-slate-100 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-800 border border-transparent">
                  Johnathon Doe
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Professional Title
                </label>
                <div className="w-full bg-slate-100 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-800 border border-transparent">
                  Risk Intelligence Consultant
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="w-full bg-slate-100 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-800 border border-transparent">
                  j.doe@riskintelligence.com
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Phone Number
                </label>
                <div className="w-full bg-slate-100 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-800 border border-transparent">
                  +91 98765 43210
                </div>
              </div>
            </div>
            
            <button className="bg-[#0055ff] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-[0_4px_14px_0_rgba(0,85,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,85,255,0.23)] hover:-translate-y-0.5 transition-all text-sm inline-flex">
              Update Information
            </button>
          </div>

          {/* Security & Privacy */}
          <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <Lock size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Security & Privacy</h2>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-5 mb-8 flex justify-between items-center border border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Two-Factor Authentication</h3>
                <p className="text-xs font-medium text-slate-500">Recommended for high-risk profiles.</p>
              </div>
              <button className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 px-5 rounded-lg transition-colors text-xs">
                Enable 2FA
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Current Password
                </label>
                <div className="w-full bg-slate-100 px-4 py-3.5 rounded-xl text-sm text-slate-500 tracking-widest border border-transparent">
                  ••••••••
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  New Password
                </label>
                <div className="w-full bg-slate-100 px-4 py-3.5 rounded-xl text-sm text-slate-500 tracking-widest border border-transparent">
                  ••••••••
                </div>
              </div>
              <div>
                <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3.5 rounded-xl transition-colors text-xs">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-red-100">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle size={20} className="text-red-600" />
              <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="max-w-md">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Delete Account</h3>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  Permanently remove your account and all financial intelligence data. This action is non-reversible.
                </p>
              </div>
              <button className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3.5 px-8 rounded-xl transition-colors text-sm whitespace-nowrap">
                Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
