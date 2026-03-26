"use client";

import { useState } from "react";
import {
  ShieldCheck, Bell, Users, Lock, Globe, Database,
  ToggleLeft, ToggleRight, Save, AlertTriangle, Key,
  Mail, Smartphone, RefreshCw, Trash2, ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${enabled ? "bg-blue-600" : "bg-slate-200"}`}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
        style={{ left: enabled ? "calc(100% - 20px)" : "4px" }}
      />
    </button>
  );
}

function SectionCard({ title, sub, icon: Icon, children }: {
  title: string; sub: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon size={15} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
        </div>
      </div>
      <div className="px-6 py-4 space-y-1">{children}</div>
    </div>
  );
}

function SettingRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {sub && <p className="text-[11px] text-slate-400 font-medium mt-0.5">{sub}</p>}
      </div>
      <div className="shrink-0 ml-4">{children}</div>
    </div>
  );
}

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    autoApprove:    true,
    smsAlerts:      true,
    twoFactor:      true,
    publicVoting:   false,
    maintenanceMode:false,
    fraudDetection: true,
    emailDigest:    true,
    apiRateLimit:   true,
    dataRetention:  false,
    betaFeatures:   false,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-[900px] mx-auto w-full space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">System Settings</h1>
          <p className="text-sm text-slate-500 font-medium">
            Configure platform behaviour, security policies, and notification preferences.
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`h-9 px-5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {saved ? <><ShieldCheck size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>

      {/* Claims & Automation */}
      <SectionCard title="Claims & Automation" sub="Control auto-processing rules for incoming claims" icon={ShieldCheck}>
        <SettingRow label="Auto-approve low-risk claims (< $200)" sub="Claims under $200 from LOW risk users bypass manual review">
          <Toggle enabled={settings.autoApprove} onToggle={() => toggle("autoApprove")} />
        </SettingRow>
        <SettingRow label="AI Fraud Detection" sub="Automatically flag suspicious patterns using ML signals">
          <Toggle enabled={settings.fraudDetection} onToggle={() => toggle("fraudDetection")} />
        </SettingRow>
        <SettingRow label="Data Retention Mode" sub="Archive closed claims after 90 days instead of deleting">
          <Toggle enabled={settings.dataRetention} onToggle={() => toggle("dataRetention")} />
        </SettingRow>
      </SectionCard>

      {/* Security */}
      <SectionCard title="Security & Access" sub="Manage authentication and admin access controls" icon={Lock}>
        <SettingRow label="Require 2FA for admin actions" sub="OTP verification needed for approvals, exports, and user edits">
          <Toggle enabled={settings.twoFactor} onToggle={() => toggle("twoFactor")} />
        </SettingRow>
        <SettingRow label="API Rate Limiting" sub="Restrict API calls to 1000/min per client to prevent abuse">
          <Toggle enabled={settings.apiRateLimit} onToggle={() => toggle("apiRateLimit")} />
        </SettingRow>
        <SettingRow label="Change Admin Password">
          <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
            <Key size={12} /> Update Password <ChevronRight size={12} />
          </button>
        </SettingRow>
        <SettingRow label="Regenerate API Secret">
          <button className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors">
            <RefreshCw size={12} /> Regenerate <ChevronRight size={12} />
          </button>
        </SettingRow>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notifications" sub="Choose how and when alerts are delivered" icon={Bell}>
        <SettingRow label="Send SMS alerts on High-risk events" sub="Real-time texts for fraud, payout failures, and HIGH risk claims">
          <Toggle enabled={settings.smsAlerts} onToggle={() => toggle("smsAlerts")} />
        </SettingRow>
        <SettingRow label="Daily Email Digest" sub="Summary of claims, alerts, and voting activity sent each morning">
          <Toggle enabled={settings.emailDigest} onToggle={() => toggle("emailDigest")} />
        </SettingRow>
        <SettingRow label="Notification Email">
          <input
            type="email"
            defaultValue="admin@survivallens.in"
            className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border-transparent focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none w-52"
          />
        </SettingRow>
        <SettingRow label="SMS Number">
          <input
            type="tel"
            defaultValue="+91 98765 43210"
            className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border-transparent focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none w-44"
          />
        </SettingRow>
      </SectionCard>

      {/* Platform / Governance */}
      <SectionCard title="Platform & Governance" sub="Control public-facing features and voting permissions" icon={Globe}>
        <SettingRow label="Enable Public Voting on Proposals" sub="Community members can vote on active governance proposals">
          <Toggle enabled={settings.publicVoting} onToggle={() => toggle("publicVoting")} />
        </SettingRow>
        <SettingRow label="Beta Features" sub="Enable experimental features visible only to admin accounts">
          <Toggle enabled={settings.betaFeatures} onToggle={() => toggle("betaFeatures")} />
        </SettingRow>
        <SettingRow label="Platform Region">
          <select className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border-transparent focus:outline-none w-40">
            <option>Global</option>
            <option>India</option>
            <option>Europe</option>
            <option>North America</option>
          </select>
        </SettingRow>
      </SectionCard>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-rose-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-rose-100 bg-rose-50/60">
          <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
            <AlertTriangle size={15} className="text-rose-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-rose-700">Danger Zone</h2>
            <p className="text-[10px] text-rose-400 font-medium">These actions are irreversible. Proceed with caution.</p>
          </div>
        </div>
        <div className="px-6 py-4 space-y-1">
          <SettingRow label="Maintenance Mode" sub="Takes the platform offline for all users except admins">
            <Toggle enabled={settings.maintenanceMode} onToggle={() => toggle("maintenanceMode")} />
          </SettingRow>
          <SettingRow label="Purge All Cached Data" sub="Clears Redis cache — may cause a brief performance dip">
            <button className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors">
              <Database size={12} /> Purge Cache
            </button>
          </SettingRow>
          <SettingRow label="Delete All Test Data" sub="Removes sandbox claims and test users — cannot be undone">
            <button className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors">
              <Trash2 size={12} /> Delete Data
            </button>
          </SettingRow>
        </div>
      </div>

    </div>
  );
}
