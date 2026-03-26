import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

// ─── Data ──────────────────────────────────────────────────────────────────
const TICKETS = [
  {
    id: "SL-9421",
    status: "Audit Pending",
    statusColor: "#f59e0b",
    statusBg: "bg-amber-100",
    icon: "alert-triangle" as const,
    iconColor: "#f59e0b",
    iconBg: "bg-amber-50",
    title: "Unreasonable Account Deactivation Threat by Logistics App",
    desc: "Received an automated warning for late delivery despite being blocked by a massive unauthorized parade that wasn't tracked on the maps.",
    time: "45 mins ago",
    priority: "Priority Level I",
  },
  {
    id: "SL-9402",
    status: "Dispute Settled",
    statusColor: "#10b981",
    statusBg: "bg-emerald-50",
    icon: "check-circle" as const,
    iconColor: "#10b981",
    iconBg: "bg-emerald-50",
    title: "Automated Payout Failure during Hurricane Protocol",
    desc: "The gig-economy risk multiplier for my coastal zone did not trigger the 1.5x buffer during yesterday's severe flash floods.",
    resolution: "Verified geospatial disconnect on the routing API. Your ledger has been credited with ₹2,500.",
    time: "2 days ago",
  },
  {
    id: "SL-9388",
    status: "Request Refused",
    statusColor: "#64748b",
    statusBg: "bg-slate-100",
    icon: "slash" as const,
    iconColor: "#94a3b8",
    iconBg: "bg-slate-50",
    title: "Add custom coverage for International Transit",
    desc: "Requesting international fiat-based risk intelligence for cross-border logistics protection.",
    resolution: "Survival Lens currently only supports domestic protection. Cross-border arbitrage is not under our protection umbrella.",
    time: "1 week ago",
  },
];

// ─── Ticket Card ────────────────────────────────────────────────────────────
function TicketCard({ ticket }: { ticket: typeof TICKETS[0] }) {
  const isResolved = ticket.status === "Dispute Settled";
  const isRejected = ticket.status === "Request Refused";

  return (
    <View className="bg-white rounded-[32px] p-6 mb-5 border border-slate-100 shadow-sm shadow-slate-200/50">
      <View className="flex-row justify-between items-start mb-5">
        <View className="flex-row items-center gap-4">
          <View className={`w-12 h-12 rounded-2xl ${ticket.iconBg} items-center justify-center`}>
            <Feather name={ticket.icon} size={20} color={ticket.iconColor} />
          </View>
          <View>
            <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
              {ticket.id}
            </Text>
            <Text className="text-base font-extrabold text-slate-900 leading-tight max-w-[200px]">
              {ticket.title}
            </Text>
          </View>
        </View>
        <View className={`px-2 py-1 rounded-lg ${ticket.statusBg}`}>
          <Text className="text-[8px] font-extrabold uppercase tracking-widest" style={{ color: ticket.statusColor }}>
            {ticket.status}
          </Text>
        </View>
      </View>

      <View className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4">
        <Text className="text-[12px] font-medium text-slate-500 leading-relaxed">
          {ticket.desc}
        </Text>
      </View>

      {ticket.resolution && (
        <View className={`border-l-4 rounded-r-2xl p-4 mb-4 ${isResolved ? "bg-emerald-50 border-emerald-500" : "bg-slate-50 border-slate-400"}`}>
          <Text className={`text-[9px] font-extrabold uppercase tracking-widest mb-1 ${isResolved ? "text-emerald-700" : "text-slate-500"}`}>
            Resolution Payload
          </Text>
          <Text className={`text-[12px] font-bold italic ${isResolved ? "text-emerald-900" : "text-slate-700"}`}>
            "{ticket.resolution}"
          </Text>
        </View>
      )}

      <View className="flex-row items-center justify-between pt-2 border-t border-slate-50">
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1.5 opacity-40">
            <Feather name="clock" size={12} color="#64748b" />
            <Text className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">
              {ticket.time}
            </Text>
          </View>
          {ticket.priority && (
            <View className="flex-row items-center gap-1.5">
              <Feather name="shield" size={12} color="#ef4444" />
              <Text className="text-[9px] font-extrabold text-red-600 uppercase tracking-widest">
                {ticket.priority}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity>
          <Text className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">
            Details →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function SupportScreen() {
  const [isRaising, setIsRaising] = useState(false);

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
          <View className="mt-8 mb-8">
            <View className="flex-row items-center gap-2 mb-3">
              <View className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg flex-row items-center gap-2">
                <Feather name="shield" size={12} color="#ef4444" />
                <Text className="text-[9px] font-extrabold text-red-600 uppercase tracking-widest">
                  Priority Mediation
                </Text>
              </View>
            </View>
            <Text className="text-3xl font-extrabold text-slate-900 leading-tight">
              Dispute Resolution
            </Text>
            <Text className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
              Execute legal requests and challenge algorithmic deactivations through the operational desk.
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={() => setIsRaising(true)}
            className="w-full bg-slate-900 py-4 rounded-3xl flex-row items-center justify-center gap-2 mb-10 shadow-lg shadow-slate-900/20"
          >
            <Feather name="plus" size={18} color="white" />
            <Text className="text-white font-extrabold text-base">Initialize Support Ticket</Text>
          </TouchableOpacity>

          {/* Ticket History Section */}
          <View className="flex-row items-center gap-2 mb-6">
            <Feather name="clock" size={14} color="#94a3b8" />
            <Text className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Active Sequence History
            </Text>
          </View>

          {TICKETS.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </View>
      </ScrollView>

      {/* ── Raise Ticket Bottom Sheet Modal ── */}
      <Modal visible={isRaising} animationType="slide" transparent presentationStyle="overFullScreen">
        <Pressable
          onPress={() => setIsRaising(false)}
          className="flex-1 bg-slate-900/40 justify-end"
        >
          <Pressable onPress={() => {}} className="bg-white rounded-t-[40px] p-8 pb-12">
            <View className="w-10 h-1 bg-slate-200 rounded-full self-center mb-6" />
            <View className="flex-row items-center justify-between mb-2">
              <View>
                <Text className="text-2xl font-extrabold text-slate-900">Generate Payload</Text>
                <Text className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Formal Dispute Sequence
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsRaising(false)} className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center">
                <Feather name="x" size={18} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View className="mt-8 space-y-6">
              <View>
                <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Incident Headline
                </Text>
                <TextInput
                  placeholder="e.g. Unjust Deactivation Notice"
                  placeholderTextColor="#94a3b8"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-extrabold text-slate-900"
                />
              </View>

              <View>
                <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Detailed Report
                </Text>
                <TextInput
                  placeholder="Describe the operational failure..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={4}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900"
                  style={{ textAlignVertical: "top" }}
                />
              </View>

              <TouchableOpacity
                onPress={() => setIsRaising(false)}
                className="w-full bg-blue-600 py-4 rounded-2xl items-center flex-row justify-center gap-2 mt-4"
              >
                <Feather name="send" size={16} color="white" />
                <Text className="text-white font-extrabold text-sm">Transmit to Underwriters</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
