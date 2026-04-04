"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AlertCircle, FileText, Loader2, Send } from "lucide-react";

type ClaimStatus = "pending" | "approved" | "rejected";

type ClaimItem = {
  id: string;
  reason: string;
  amount: number;
  status: ClaimStatus;
  createdAt: string;
};

export default function ClaimsPage() {
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState("High Risk (Immediate payouts)");
  const [location, setLocation] = useState("");
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [images, setImages] = useState<{ id: string; name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchClaims = async () => {
    setError("");

    try {
      const res = await fetch("/api/claims", { credentials: "include" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch claims");
      }

      const claimList = Array.isArray(data) ? (data as ClaimItem[]) : [];
      setClaims(claimList);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to load claims";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const statusCounts = useMemo(() => {
    return {
      all: claims.length,
      pending: claims.filter((c) => c.status === "pending").length,
      approved: claims.filter((c) => c.status === "approved").length,
      rejected: claims.filter((c) => c.status === "rejected").length,
    };
  }, [claims]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");
    setError("");

    const parsedAmount = Number(amount);
    if (!title.trim()) {
      setError("Please enter an event title.");
      return;
    }

    if (!reason.trim()) {
      setError("Please enter evidence or a description.");
      return;
    }

    if (!location.trim()) {
      setError("Please enter the location.");
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setSubmitting(true);

    try {
      const formattedReason = [
        `Title: ${title.trim()}`,
        `Severity: ${severity}`,
        `Location: ${location.trim()}`,
        `Details: ${reason.trim()}`,
        images.length ? `Attachments: ${images.map((img) => img.name).join(", ")}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason: formattedReason, amount: parsedAmount }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit claim");
      }

      setTitle("");
      setSeverity("High Risk (Immediate payouts)");
      setLocation("");
      setReason("");
      setAmount("");
      setImages([]);
      setSuccess("Claim submitted successfully. Your claim is now pending review.");
      await fetchClaims();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to submit claim";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const appendImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) {
      return;
    }

    const nextImages = Array.from(files).map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...nextImages]);
    event.target.value = "";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="animate-spin mb-4 text-blue-500" size={32} />
        <p className="font-bold tracking-tight">Loading claims...</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full relative">
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute left-[-10%] top-[40%] w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Claims</h1>
        <p className="text-slate-500 font-medium">Submit a new claim and track its approval status.</p>
      </div>

      {(error || success) && (
        <div className="relative z-10 mb-6 space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="font-semibold text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl">
              <p className="font-semibold text-sm">{success}</p>
            </div>
          )}
        </div>
      )}

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 bg-white/80 backdrop-blur-2xl rounded-[2rem] p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-500">
              <Send size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Submit Claim</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Create a payout request</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Event Title</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                type="text"
                placeholder="e.g. Major Highway Blocked"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Severity / Impact</label>
              <select
                value={severity}
                onChange={(event) => setSeverity(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option>High Risk (Immediate payouts)</option>
                <option>Medium Risk (Algorithmic routing)</option>
                <option>Low Risk (Observation)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Evidence / Description</label>
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={4}
                placeholder="Briefly describe your disruption or loss"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Location</label>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                type="text"
                placeholder="e.g. Lower East Side, Manhattan"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Upload Images</label>
              <input
                id="claim-image-input"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={appendImages}
              />
              <label
                htmlFor="claim-image-input"
                onClick={() => fileInputRef.current?.click()}
                className="w-full block text-center cursor-pointer px-4 py-3.5 bg-slate-50 border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 rounded-2xl text-[14px] font-semibold text-slate-700 transition-all"
              >
                Add multiple image attachments
              </label>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {images.map((image) => (
                    <div key={image.id} className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                      <Image src={image.url} alt={image.name} width={300} height={200} unoptimized className="h-24 w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2">Amount (INR)</label>
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                type="number"
                min="1"
                step="1"
                placeholder="Ex: 1500"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <input id="claim-submit-input" type="submit" className="hidden" />
            <label
              htmlFor="claim-submit-input"
              className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-black text-sm tracking-tight transition-colors ${
                submitting
                  ? "bg-blue-300 text-white cursor-not-allowed pointer-events-none"
                  : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              }`}
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              {submitting ? "Submitting..." : "Submit Claim"}
            </label>
          </form>
        </div>

        <div className="xl:col-span-2 bg-white/80 backdrop-blur-2xl rounded-[2rem] p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-500">
                <FileText size={18} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Claim History</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your latest submissions</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] uppercase tracking-wider font-black">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">All: {statusCounts.all}</div>
              <div className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 text-orange-600">Pending: {statusCounts.pending}</div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-emerald-600">Approved: {statusCounts.approved}</div>
              <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-red-600">Rejected: {statusCounts.rejected}</div>
            </div>
          </div>

          {claims.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
              <p className="font-bold text-slate-500">No claims submitted yet.</p>
              <p className="text-sm text-slate-400 mt-1">Your submitted claims will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {claims.map((claim, idx) => {
                const statusClass =
                  claim.status === "approved"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                    : claim.status === "rejected"
                    ? "bg-red-50 text-red-600 border-red-100/50"
                    : "bg-orange-50 text-orange-600 border-orange-100/50";

                return (
                  <div
                    key={claim.id || `${claim.createdAt}-${idx}`}
                    className="grid grid-cols-1 md:grid-cols-4 items-center px-4 py-4 border border-slate-100/60 bg-white rounded-2xl hover:border-slate-300/50 hover:shadow-sm transition-all"
                  >
                    <div className="md:col-span-2 mb-3 md:mb-0">
                      <p className="text-[13px] font-black text-slate-900 tracking-tight">{claim.reason}</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">Requested on {formatDate(claim.createdAt)}</p>
                    </div>
                    <div className="text-left md:text-center mb-3 md:mb-0">
                      <p className="text-[15px] font-black tracking-tight text-slate-900">{formatCurrency(claim.amount)}</p>
                    </div>
                    <div className="flex justify-start md:justify-end">
                      <span className={`flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-lg border shadow-sm ${statusClass}`}>
                        {claim.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
