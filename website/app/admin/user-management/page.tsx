"use client";

import { useState } from "react";
import {
  Search, Filter, ArrowUpDown, MoreHorizontal, UserPlus,
  ShieldCheck, ShieldAlert, Eye, Edit2, Trash2, ChevronDown,
  MapPin, Briefcase, Calendar, Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type RiskLevel = "ALL" | "LOW" | "MED" | "HIGH";

const USERS = [
  { id: "992-LX", name: "Sarah Mitchell",   email: "sarah.m@ubereats.com",   platform: "Uber Eats",  sector: "New York, US",   risk: "LOW",  status: "active",    joined: "Jan 12, 2023", claims: 4,  covered: "$480",   initials: "SM", bg: "bg-emerald-200 text-emerald-800" },
  { id: "441-PT", name: "Marcus Thorne",    email: "marcus.t@instacart.com", platform: "Instacart",  sector: "London, UK",     risk: "HIGH", status: "flagged",   joined: "Mar 3, 2023",  claims: 12, covered: "$3,200", initials: "MT", bg: "bg-red-200 text-red-800" },
  { id: "215-VK", name: "Elena Rodriguez", email: "elena.r@doordash.com",   platform: "DoorDash",   sector: "Miami, US",      risk: "MED",  status: "active",    joined: "May 22, 2023", claims: 7,  covered: "$1,100", initials: "ER", bg: "bg-amber-200 text-amber-800" },
  { id: "887-JK", name: "Priya Nair",      email: "priya.n@swiggy.com",     platform: "Swiggy",     sector: "Mumbai, IN",     risk: "LOW",  status: "active",    joined: "Feb 9, 2023",  claims: 2,  covered: "$240",   initials: "PN", bg: "bg-blue-200 text-blue-800" },
  { id: "119-RQ", name: "Raj Sharma",      email: "raj.s@rapido.bike",      platform: "Rapido",     sector: "Hyderabad, IN",  risk: "MED",  status: "inactive",  joined: "Jun 14, 2023", claims: 5,  covered: "$620",   initials: "RS", bg: "bg-slate-200 text-slate-800" },
  { id: "534-BN", name: "Carlos Vega",     email: "carlos.v@lyft.com",      platform: "Lyft",       sector: "Chicago, US",    risk: "HIGH", status: "flagged",   joined: "Apr 1, 2023",  claims: 9,  covered: "$5,200", initials: "CV", bg: "bg-rose-200 text-rose-800" },
  { id: "762-ZM", name: "Leila Hassan",    email: "leila.h@bolt.eu",        platform: "Bolt",       sector: "Paris, FR",      risk: "LOW",  status: "active",    joined: "Jul 7, 2023",  claims: 1,  covered: "$90",    initials: "LH", bg: "bg-violet-200 text-violet-800" },
  { id: "308-PA", name: "Tom Whitfield",   email: "tom.w@lyft.com",         platform: "Lyft",       sector: "Seattle, US",    risk: "MED",  status: "active",    joined: "Aug 20, 2023", claims: 6,  covered: "$830",   initials: "TW", bg: "bg-cyan-200 text-cyan-800" },
];

const RISK_STYLES: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700",
  MED:  "bg-amber-100 text-amber-700",
  LOW:  "bg-emerald-100 text-emerald-700",
};

const STATUS_STYLES: Record<string, { bg: string; dot: string; text: string; label: string }> = {
  active:   { bg: "bg-emerald-50", dot: "bg-emerald-500", text: "text-emerald-700", label: "Active" },
  inactive: { bg: "bg-slate-100",  dot: "bg-slate-400",   text: "text-slate-600",   label: "Inactive" },
  flagged:  { bg: "bg-rose-50",    dot: "bg-rose-500",    text: "text-rose-700",    label: "Flagged" },
};

export default function UserManagementPage() {
  const [riskFilter, setRiskFilter] = useState<RiskLevel>("ALL");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const filtered = USERS.filter((u) => {
    const matchRisk = riskFilter === "ALL" || u.risk === riskFilter;
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.platform.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    return matchRisk && matchSearch;
  });

  const counts = { ALL: USERS.length, LOW: USERS.filter(u => u.risk === "LOW").length, MED: USERS.filter(u => u.risk === "MED").length, HIGH: USERS.filter(u => u.risk === "HIGH").length };

  return (
    <div className="p-8 max-w-[1100px] mx-auto w-full">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">User Management</h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage gig worker accounts, risk levels, and coverage activity.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button className="h-9 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5">
            <Filter size={13} /> Filter
          </button>
          <button className="h-9 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5">
            <ArrowUpDown size={13} /> Sort
          </button>
          <button className="h-9 px-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <UserPlus size={13} /> Add User
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users",    value: USERS.length,                                    icon: ShieldCheck,  color: "text-blue-600",    bg: "bg-blue-50" },
          { label: "Active",         value: USERS.filter(u => u.status === "active").length,  icon: Activity,     color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Flagged",        value: USERS.filter(u => u.status === "flagged").length, icon: ShieldAlert,  color: "text-rose-600",    bg: "bg-rose-50" },
          { label: "High Risk",      value: USERS.filter(u => u.risk === "HIGH").length,      icon: ShieldAlert,  color: "text-red-600",     bg: "bg-red-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon size={16} className={s.color} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 leading-none">{s.value}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(["ALL", "LOW", "MED", "HIGH"] as RiskLevel[]).map((r) => (
          <button
            key={r}
            onClick={() => setRiskFilter(r)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
              riskFilter === r
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {r === "ALL" ? "All Users" : `${r} Risk`}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${riskFilter === r ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
              {counts[r]}
            </span>
          </button>
        ))}
        <div className="relative ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-full focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none font-medium text-slate-700 w-44"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 px-5 py-3 bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest font-bold text-slate-400">
          <div className="col-span-4">User</div>
          <div className="col-span-2">Platform</div>
          <div className="col-span-2">Sector</div>
          <div className="col-span-1 text-center">Risk</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">Claims</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-50">
          <AnimatePresence initial={false}>
            {filtered.map((user) => {
              const st = STATUS_STYLES[user.status];
              const isOpen = expanded === user.id;
              return (
                <motion.div key={user.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  {/* Row */}
                  <div
                    className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-slate-50/60 transition-colors cursor-pointer"
                    onClick={() => setExpanded(isOpen ? null : user.id)}
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${user.bg}`}>
                        {user.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{user.email}</p>
                      </div>
                      <ChevronDown size={13} className={`text-slate-300 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                    <div className="col-span-2 text-sm font-medium text-slate-600">{user.platform}</div>
                    <div className="col-span-2 text-xs font-medium text-slate-500">{user.sector}</div>
                    <div className="col-span-1 flex justify-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${RISK_STYLES[user.risk]}`}>{user.risk}</span>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${st.bg} ${st.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </div>
                    <div className="col-span-1 text-center text-sm font-bold text-slate-700">{user.claims}</div>
                    <div className="col-span-1 flex justify-end" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          onClick={() => setActionMenu(actionMenu === user.id ? null : user.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                        <AnimatePresence>
                          {actionMenu === user.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 top-8 z-20 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 w-36"
                            >
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                                <Eye size={12} /> View Ledger
                              </button>
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                                <Edit2 size={12} /> Edit Profile
                              </button>
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                <Trash2 size={12} /> Remove User
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        key="detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-16 py-4 bg-slate-50/80 border-t border-slate-100 grid grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin size={10} /> Location</p>
                            <p className="font-bold text-slate-800">{user.sector}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Briefcase size={10} /> Platform</p>
                            <p className="font-bold text-slate-800">{user.platform}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar size={10} /> Joined</p>
                            <p className="font-bold text-slate-800">{user.joined}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Covered</p>
                            <p className="font-bold text-emerald-700">{user.covered}</p>
                          </div>
                          <div className="flex items-end gap-2">
                            <button className="flex-1 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
                              View Ledger
                            </button>
                            <button className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors">
                              Edit Profile
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Search size={28} className="text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-400">No users match your filter</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium">Showing <span className="font-bold text-slate-600">{filtered.length}</span> of <span className="font-bold text-slate-600">{USERS.length}</span> users</p>
          <div className="flex items-center gap-1.5">
            {["1", "2", "3"].map((p) => (
              <button key={p} className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${p === "1" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
