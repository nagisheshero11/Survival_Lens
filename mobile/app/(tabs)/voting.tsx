"use client";

import { useState } from "react";
import {
  ScrollView, View, Text, TouchableOpacity,
  TextInput, Modal, Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

// ─── Types ─────────────────────────────────────────────────────────────────
type Tab = "support" | "supported" | "raised";

// ─── Data ──────────────────────────────────────────────────────────────────
const CLAIMS = [
  {
    id: "CLM-9092",
    icon: "cloud-rain" as const,
    iconBg: "bg-blue-50",
    iconColor: "#3b82f6",
    riskBg: "bg-blue-50",
    riskText: "text-blue-600",
    title: "Flash Flood Alert - Lower East Side",
    desc: "Water levels rising rapidly on 4th Ave making deliveries extremely hazardous. Seeking validation to trigger auto-protection for route #4A.",
    risk: "High Risk",
    statusLabel: "34% / 100%",
    progress: 34,
  },
  {
    id: "CLM-8831",
    icon: "shield" as const,
    iconBg: "bg-red-50",
    iconColor: "#ef4444",
    riskBg: "bg-red-50",
    riskText: "text-red-600",
    title: "Arbitrary Deactivations Spiking",
    desc: "Multiple drivers reporting sudden account suspensions on Platform Z without appeal options. Seeking consensus to trigger legal fund.",
    risk: "Critical",
    statusLabel: "82% / 100%",
    progress: 82,
  },
  {
    id: "CLM-7712",
    icon: "activity" as const,
    iconBg: "bg-orange-50",
    iconColor: "#f97316",
    riskBg: "bg-orange-50",
    riskText: "text-orange-600",
    title: "Algorithm Payout Suppression",
    desc: "Fare mapping shows a 15% reduction in base pay across all zones since the v4.0 app update. Need 100 signatures to dispute.",
    risk: "Medium Risk",
    statusLabel: "91% / 100%",
    progress: 91,
  },
];

const SUPPORTED_CLAIMS = [
  {
    id: "CLM-6621",
    icon: "cloud-rain" as const,
    title: "Hurricane Base Payout",
    desc: "Emergency payout multipliers successfully dispensed to coastal drivers over 48 hours. Consensus reached and executed.",
  },
  {
    id: "CLM-5100",
    icon: "tool" as const,
    title: "Payment Gateway Crash",
    desc: "Bank API failure affected direct withdrawals. Loss of time completely buffered and credited to all active workers.",
  },
  {
    id: "CLM-4882",
    icon: "shield" as const,
    title: "City-Wide Curfew Active",
    desc: "Mandatory curfew restricted route operations for 12 hours. Platform losses fully reimbursed from the protection pool.",
  },
];

// ─── Claim card (Support tab) ────────────────────────────────────────────────
function ClaimCard({ claim, onSupport }: { claim: typeof CLAIMS[0]; onSupport: () => void }) {
  return (
    <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
      <View className="flex-row items-start justify-between mb-4">
        <View className={`w-12 h-12 rounded-2xl ${claim.iconBg} items-center justify-center`}>
          <Feather name={claim.icon} size={20} color={claim.iconColor} />
        </View>
        <View className={`px-2.5 py-1 rounded-lg ${claim.riskBg}`}>
          <Text className={`text-[9px] font-extrabold uppercase tracking-widest ${claim.riskText}`}>
            {claim.risk}
          </Text>
        </View>
      </View>

      <Text className="text-base font-extrabold text-slate-900 mb-1.5 leading-snug">
        {claim.title}
      </Text>
      <Text className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
        {claim.desc}
      </Text>

      {/* Progress */}
      <View className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 mb-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
            Consensus Status
          </Text>
          <Text className="text-[9px] font-extrabold text-slate-900 uppercase tracking-widest">
            {claim.statusLabel}
          </Text>
        </View>
        <View className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <View className="h-full bg-slate-900 rounded-full" style={{ width: `${claim.progress}%` }} />
        </View>
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity className="flex-1 py-3.5 rounded-2xl bg-white border border-slate-200 items-center">
          <Text className="text-sm font-extrabold text-slate-600">Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSupport}
          className="flex-1 py-3.5 rounded-2xl bg-blue-600 items-center flex-row justify-center gap-2"
        >
          <Feather name="thumbs-up" size={14} color="white" />
          <Text className="text-sm font-extrabold text-white">Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Supported card (History tab) ────────────────────────────────────────────
function SupportedCard({ claim }: { claim: typeof SUPPORTED_CLAIMS[0] }) {
  return (
    <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
      <View className="flex-row items-start justify-between mb-4">
        <View className="w-12 h-12 rounded-2xl bg-emerald-50 items-center justify-center">
          <Feather name={claim.icon} size={20} color="#10b981" />
        </View>
        <View className="px-2.5 py-1 rounded-lg bg-emerald-50">
          <Text className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-600">
            Verified
          </Text>
        </View>
      </View>
      <Text className="text-base font-extrabold text-slate-900 mb-1.5">{claim.title}</Text>
      <Text className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{claim.desc}</Text>
      <View className="flex-row items-center gap-3 pt-4 border-t border-slate-100">
        <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center">
          <Feather name="check-circle" size={16} color="#10b981" />
        </View>
        <View>
          <Text className="text-xs font-extrabold text-slate-900 leading-none">Your vote was recorded</Text>
          <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">
            Consensus Executed
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function VotingScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("support");
  const [isRaising, setIsRaising] = useState(false);
  const [supported, setSupported] = useState<string[]>([]);

  const TABS: { key: Tab; label: string; badge?: string; badgeBg: string; badgeText: string }[] = [
    { key: "support",   label: "Support",   badge: "12", badgeBg: "bg-slate-900", badgeText: "text-white" },
    { key: "supported", label: "Supported", badge: "48", badgeBg: "bg-emerald-100", badgeText: "text-emerald-700" },
    { key: "raised",    label: "Raised",    badgeBg: "", badgeText: "" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5">
          {/* Header */}
          <View className="flex-row items-start justify-between mt-6 mb-6">
            <View className="flex-1 mr-3">
              <View className="bg-blue-50 border border-blue-100 self-start px-2 py-1 rounded-lg mb-2">
                <Text className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest">
                  Decentralized Consensus
                </Text>
              </View>
              <Text className="text-3xl font-extrabold text-slate-900 leading-none mb-1">
                Voting Chamber
              </Text>
              <Text className="text-sm text-slate-500 font-medium">
                Validate community risk claims to trigger protective payouts.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsRaising(true)}
              className="bg-slate-900 px-4 py-3 rounded-2xl flex-row items-center gap-2 mt-1 shrink-0"
            >
              <Feather name="plus" size={15} color="white" />
              <Text className="text-white text-xs font-extrabold">Raise Ticket</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View className="flex-row border-b border-slate-200 mb-5">
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className={`flex-row items-center gap-1.5 pb-3 mr-5 ${activeTab === tab.key ? "border-b-2 border-slate-900" : ""}`}
              >
                <Text className={`text-sm font-extrabold ${activeTab === tab.key ? "text-slate-900" : "text-slate-400"}`}>
                  {tab.label}
                </Text>
                {tab.badge && (
                  <View className={`px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? tab.badgeBg : "bg-slate-100"}`}>
                    <Text className={`text-[9px] font-extrabold ${activeTab === tab.key ? tab.badgeText : "text-slate-500"}`}>
                      {tab.badge}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab content */}
          {activeTab === "support" && CLAIMS.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              onSupport={() => setSupported((s) => [...s, claim.id])}
            />
          ))}

          {activeTab === "supported" && SUPPORTED_CLAIMS.map((claim) => (
            <SupportedCard key={claim.id} claim={claim} />
          ))}

          {activeTab === "raised" && (
            <View className="bg-white rounded-3xl p-8 border border-slate-100 items-center">
              <View className="w-16 h-16 bg-blue-50 rounded-3xl items-center justify-center mb-4">
                <Feather name="file-plus" size={26} color="#3b82f6" />
              </View>
              <Text className="text-lg font-extrabold text-slate-900 mb-2">No Active Tickets</Text>
              <Text className="text-sm text-slate-500 font-medium text-center mb-6 leading-relaxed">
                You haven't submitted any risk tickets to the network for validation yet.
              </Text>
              <TouchableOpacity
                onPress={() => setIsRaising(true)}
                className="flex-row items-center gap-2 bg-slate-900 px-5 py-3 rounded-2xl"
              >
                <Text className="text-white text-sm font-extrabold">Raise a Ticket</Text>
                <Feather name="arrow-right" size={15} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Why your vote matters */}
          <View className="bg-slate-900 rounded-3xl p-6 mt-5 mb-4 overflow-hidden">
            <Text className="text-xl font-extrabold text-white mb-2">Why your vote matters?</Text>
            <Text className="text-sm text-slate-400 font-medium leading-relaxed mb-5">
              Every supported claim strengthens the collective intelligence. Your validation mathematically triggers automated risk mitigation payouts for the entire driver network.
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-row">
                {["#475569", "#10b981", "#3b82f6"].map((c, i) => (
                  <View key={i} className="w-9 h-9 rounded-full border-2 border-slate-900 -ml-2 first:ml-0 items-center justify-center" style={{ backgroundColor: c }}>
                    {i === 2 && <Text className="text-[10px] font-extrabold text-white">+</Text>}
                  </View>
                ))}
              </View>
              <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                2,401 nodes active
              </Text>
            </View>
          </View>

          {/* Network Authority card */}
          <View className="bg-white rounded-3xl p-6 border border-slate-100 mb-4">
            <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
              Network Authority
            </Text>
            <Text className="text-5xl font-extrabold text-slate-900 mb-1">
              84<Text className="text-2xl text-slate-400">%</Text>
            </Text>
            <Text className="text-sm font-bold text-slate-500 mb-4">Reliability Score</Text>
            <View className="flex-row items-center gap-2 bg-emerald-50 border border-emerald-100 self-start px-3 py-1.5 rounded-lg">
              <Feather name="check-circle" size={13} color="#10b981" />
              <Text className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-widest">
                Top Validator
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Raise Ticket Bottom Sheet Modal ── */}
      <Modal visible={isRaising} animationType="slide" transparent presentationStyle="overFullScreen">
        <Pressable
          onPress={() => setIsRaising(false)}
          className="flex-1 bg-slate-900/40 justify-end"
        >
          <Pressable onPress={() => {}} className="bg-white rounded-t-[2rem] p-6 pb-10">
            <View className="w-10 h-1 bg-slate-200 rounded-full self-center mb-5" />
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xl font-extrabold text-slate-900">Raise Risk Ticket</Text>
              <TouchableOpacity onPress={() => setIsRaising(false)} className="w-9 h-9 bg-slate-100 rounded-full items-center justify-center">
                <Feather name="x" size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-slate-500 font-medium mb-6">
              Submit disruptive events for community validation.
            </Text>

            <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
              Event Title
            </Text>
            <TextInput
              placeholder="e.g. Major Highway Blocked"
              placeholderTextColor="#94a3b8"
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 mb-4"
            />

            <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
              Evidence / Description
            </Text>
            <TextInput
              placeholder="Describe the conditions..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 mb-6"
              style={{ textAlignVertical: "top" }}
            />

            <TouchableOpacity
              onPress={() => setIsRaising(false)}
              className="w-full bg-blue-600 py-4 rounded-2xl items-center"
            >
              <Text className="text-white font-extrabold text-sm">Broadcast to Network</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
