"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError } from "@/services/api";
import { requestAdminAccess, signupAdmin } from "@/admin-services/admin.service";

export default function AdminSignupPage() {
  const router = useRouter();
  const [accessUsername, setAccessUsername] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await requestAdminAccess({ username: accessUsername, password: accessPassword });
      await signupAdmin({ fullName, email, mobile, password });
      router.replace("/v1/admin/dashboard");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Signup failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Admin Portal</p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Admin Signup</h1>
        </div>

        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}

        <div className="grid grid-cols-2 gap-3">
          <input
            value={accessUsername}
            onChange={(e) => setAccessUsername(e.target.value)}
            placeholder="Access username"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            value={accessPassword}
            onChange={(e) => setAccessPassword(e.target.value)}
            type="password"
            placeholder="Access password"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Admin email" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required />
        <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading ? "Creating account..." : "Create admin"}
        </button>

        <p className="text-sm text-slate-500">
          Already registered? <Link href="/v1/admin/auth/login" className="font-bold text-blue-600">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
