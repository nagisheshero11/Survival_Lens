"use client";
import { useState, useEffect } from "react";
import { Wallet, Loader2, AlertCircle, ArrowUpRight, ArrowDownLeft, Receipt } from "lucide-react";
import { getWallet } from "@/(services)/wallet";
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kycProgress, setKycProgress] = useState(0);
  const [walletLocked, setWalletLocked] = useState(false);
  const isKycComplete = kycProgress >= 100;

  useEffect(() => {
    const fetchWalletData = async () => {
      // Use local KYC data to determine whether wallet should be gated.
      const savedKyc = localStorage.getItem("survivalLensKyc");
      if (savedKyc) {
        try {
          const parsed = JSON.parse(savedKyc) || {};
          const fields = [
            parsed.aadhaar,
            parsed.pan,
            parsed.photo,
            parsed.location,
            parsed.age,
            parsed.company,
            parsed.partnerId,
            parsed.dashboardScreenshot,
            parsed.avgWeeklyIncome,
            parsed.avgWorkingHours,
          ];
          const filled = fields.filter((f) => String(f ?? "").trim() !== "").length;
          const progress = Math.round((filled / fields.length) * 100);
          setKycProgress(progress);
        } catch {
          setKycProgress(0);
        }
      }

      try {
        const data = await getWallet();
        setBalance(data.balance);
        setTransactions(data.transactions || []);
      } catch (err: any) {
        const message = err?.message || "An error occurred while fetching wallet data";
        if (/wallet not found/i.test(message)) {
          setWalletLocked(true);
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
         <Loader2 className="animate-spin mb-4 text-blue-500" size={32} />
         <p className="font-bold tracking-tight">Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full relative">
      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute left-[-10%] top-[40%] w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ── PAGE HEADER ── */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-1">
            Wallet
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your earnings and transaction history.
          </p>
        </div>
      </div>

      {error ? (
        <div className="relative z-10 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="font-semibold text-sm">{error}</p>
        </div>
      ) : walletLocked ? (
        <div className="relative z-10 max-w-2xl rounded-[2rem] border border-amber-200 bg-amber-50/80 p-6 lg:p-8 shadow-[0_10px_30px_rgba(251,191,36,0.12)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200/70 text-amber-700 flex items-center justify-center">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-amber-600">Wallet Locked</p>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Complete KYC To Enable Wallet</h2>
            </div>
          </div>

          <p className="text-sm text-amber-900/80 font-medium leading-relaxed mb-4">
            Your wallet is provisioned only after identity verification is complete.
          </p>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-amber-700">KYC Progress</p>
              <p className="text-[12px] font-black text-amber-800">{kycProgress}%</p>
            </div>
            <div className="h-2 w-full rounded-full bg-amber-200/70 overflow-hidden">
              <div className="h-full rounded-full bg-amber-500" style={{ width: `${kycProgress}%` }} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-black transition-colors"
            >
              Open Profile
            </button>
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="px-5 py-3 rounded-xl bg-white border border-amber-200 text-amber-700 hover:bg-amber-100/40 text-sm font-black transition-colors"
            >
              Open Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 gap-8">
          {/* ── BALANCE CARD ── */}
          <div className="bg-slate-900 rounded-[2rem] p-8 lg:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.15)] text-white relative overflow-hidden group max-w-xl">
            <div className="absolute inset-0 bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-[9px] uppercase font-black tracking-[0.2em]">
                   Available Balance
                </span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-black tracking-tight mb-2">
                {balance !== null ? formatCurrency(balance) : "₹0"}
              </h2>
            </div>
          </div>

          {/* ── TRANSACTIONS SECTION ── */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-500">
                 <Receipt size={20} strokeWidth={2.5} />
              </div>
              <div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">Transaction History</h2>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent activity in your wallet</p>
              </div>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-400 font-bold tracking-tight">No transactions yet.</p>
              </div>
            ) : (
              <div className="w-full">
                {/* Headers */}
                <div className="grid grid-cols-5 px-4 py-3 bg-slate-50/50 rounded-xl text-[9px] uppercase tracking-[0.2em] font-black text-slate-400 mb-4 border border-slate-100/50 hidden md:grid">
                  <div className="col-span-2">Transaction Details</div>
                  <div className="col-span-1 text-center">Amount</div>
                  <div className="col-span-1 text-center">Date</div>
                  <div className="col-span-1 text-right">Status</div>
                </div>

                <div className="space-y-3">
                  {transactions.map((txn, index) => {
                    const isCredit = txn.type === 'credit';
                    
                    return (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 items-center px-4 py-4 border border-slate-100/60 bg-white rounded-2xl hover:border-slate-300/50 hover:shadow-sm transition-all focus:outline-none">
                        <div className="col-span-1 md:col-span-2 flex items-center gap-3 mb-3 md:mb-0">
                          <div className={`w-10 h-10 rounded-xl ${isCredit ? 'bg-emerald-50 text-emerald-500 border-emerald-100/50' : 'bg-red-50 text-red-500 border-red-100/50'} flex items-center justify-center shrink-0 border`}>
                             {isCredit ? <ArrowDownLeft size={16} strokeWidth={2.5} /> : <ArrowUpRight size={16} strokeWidth={2.5} />}
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-slate-900 tracking-tight capitalize">{txn.reason}</p>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Ref: {txn.paymentRef || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="col-span-1 text-left md:text-center mb-3 md:mb-0">
                          <p className={`text-[15px] font-black tracking-tight ${isCredit ? 'text-emerald-500' : 'text-red-500'}`}>
                            {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                          </p>
                        </div>
                        <div className="col-span-1 text-left md:text-center mb-3 md:mb-0">
                          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{formatDate(txn.createdAt)}</p>
                        </div>
                        <div className="col-span-1 flex justify-start md:justify-end">
                           <span className={`flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-lg border shadow-sm ${
                             txn.status === 'completed' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                              : txn.status === 'pending'
                              ? 'bg-orange-50 text-orange-600 border-orange-100/50'
                              : 'bg-slate-50 text-slate-500 border-slate-200/50'
                           }`}>
                            {txn.status || 'completed'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
