import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

// ─── Payout row ──────────────────────────────────────────────────────────────
function PayoutRow({
  icon,
  iconBg,
  iconColor,
  event,
  sub,
  amount,
  time,
  date,
  status,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  iconBg: string;
  iconColor: string;
  event: string;
  sub: string;
  amount: string;
  time: string;
  date: string;
  status: "Credited" | "Processing";
}) {
  const credited = status === "Credited";
  return (
    <View className="flex-row items-center gap-3 py-3.5 border-b border-slate-100">
      <View className={`w-10 h-10 rounded-2xl ${iconBg} items-center justify-center shrink-0`}>
        <Feather name={icon} size={16} color={iconColor} />
      </View>
      <View className="flex-1 min-w-0">
        <Text className="text-sm font-extrabold text-slate-900 leading-none">{event}</Text>
        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{sub}</Text>
      </View>
      <View className="items-end gap-1 shrink-0">
        <Text className="text-sm font-extrabold text-slate-900">{amount}</Text>
        <Text className="text-[10px] font-bold text-slate-500">{date} · {time}</Text>
        <View className={`px-2 py-0.5 rounded-lg ${credited ? "bg-emerald-50" : "bg-slate-100"}`}>
          <Text className={`text-[9px] font-extrabold uppercase tracking-widest ${credited ? "text-emerald-600" : "text-slate-500"}`}>
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Intelligence brief row ───────────────────────────────────────────────────
function IntelRow({
  icon,
  iconBg,
  iconColor,
  title,
  desc,
  showLine = true,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  showLine?: boolean;
}) {
  return (
    <View className="flex-row gap-3">
      <View className="items-center">
        <View className={`w-10 h-10 rounded-2xl ${iconBg} items-center justify-center shrink-0`}>
          <Feather name={icon} size={15} color={iconColor} />
        </View>
        {showLine && <View className="w-px flex-1 bg-slate-100 mt-1" />}
      </View>
      <View className="flex-1 pb-5">
        <Text className="text-sm font-extrabold text-slate-900 mb-0.5">{title}</Text>
        <Text className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</Text>
      </View>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top navbar */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <View>
            <Text className="text-base font-extrabold text-slate-900 leading-tight">
              Survival Lens
            </Text>
            <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
              Financial Risk Intelligence
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity className="relative w-9 h-9 rounded-full bg-white border border-slate-200 items-center justify-center">
              <Feather name="bell" size={16} color="#475569" />
              <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </TouchableOpacity>
            <View className="w-9 h-9 rounded-2xl bg-slate-100 border border-slate-200 items-center justify-center">
              <Text className="text-xs font-extrabold text-slate-500">MS</Text>
            </View>
          </View>
        </View>

        <View className="px-5">
          {/* Page header */}
          <View className="mt-4 mb-5">
            <View className="flex-row items-center gap-2 mb-1.5">
              <View className="bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg">
                <Text className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest">
                  Live Feed
                </Text>
              </View>
              <Text className="text-xs font-bold text-slate-400">Last synced: Just now</Text>
            </View>
            <Text className="text-3xl font-extrabold text-slate-900 leading-none mb-1">Overview</Text>
            <Text className="text-sm text-slate-500 font-medium">
              Your risk profile is{" "}
              <Text className="text-emerald-500 font-extrabold">Stable &amp; Protected</Text>.
            </Text>
          </View>

          {/* Profile card */}
          <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100 items-center">
            <View className="relative mb-3">
              <View className="w-20 h-20 rounded-full bg-slate-100 border-4 border-white items-center justify-center shadow-sm">
                <Text className="text-xl font-extrabold text-slate-400">MS</Text>
              </View>
              <View className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-slate-100 items-center justify-center shadow-sm">
                <Feather name="check-circle" size={14} color="#3b82f6" />
              </View>
            </View>
            <Text className="text-base font-extrabold text-slate-900 mb-0.5">Marcus Sterling</Text>
            <Text className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">
              Verified Gig Driver
            </Text>
            <View className="flex-row w-full border-t border-slate-100 pt-4">
              <View className="flex-1">
                <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                  Account Level
                </Text>
                <Text className="text-sm font-extrabold text-slate-900">Pro</Text>
              </View>
              <View className="flex-1 items-end">
                <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                  Platforms Linked
                </Text>
                <Text className="text-sm font-extrabold text-slate-900">Uber, Swiggy</Text>
              </View>
            </View>
          </View>

          {/* Liquidity card — dark */}
          <View className="bg-slate-900 rounded-3xl p-5 mb-4 overflow-hidden">
            <View className="flex-row items-start justify-between mb-5">
              <View className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                <Text className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest">
                  Guaranteed Floor
                </Text>
              </View>
              <Feather name="credit-card" size={20} color="#34d399" />
            </View>
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Available Buffer
            </Text>
            <Text className="text-4xl font-extrabold text-white mb-1.5">₹12,450</Text>
            <Text className="text-xs text-slate-500 font-medium mb-6">
              +₹850 accrued from disruptions this week.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-white/10 border border-white/10 rounded-2xl py-3.5 items-center">
                <Text className="text-white text-sm font-extrabold">Withdraw</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-emerald-500 px-6 rounded-2xl py-3.5 items-center">
                <Text className="text-slate-900 text-sm font-extrabold">Auto-Claim</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Geospatial Protection */}
          <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
            <View className="flex-row items-center justify-between mb-3">
              <View className="bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                <Text className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">
                  Active Status
                </Text>
              </View>
              <Feather name="activity" size={18} color="#3b82f6" />
            </View>
            <Text className="text-lg font-extrabold text-slate-900 mb-1.5">
              Geospatial Protection
            </Text>
            <Text className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
              Monitoring hyper-local weather patterns, traffic congestion, and blockades to guarantee standard earning rates.
            </Text>
            <TouchableOpacity className="flex-row items-center justify-between border-t border-slate-100 pt-4">
              <Text className="text-sm font-extrabold text-blue-600">
                Configure Threat Thresholds
              </Text>
              <Feather name="arrow-right" size={16} color="#2563eb" />
            </TouchableOpacity>
          </View>

          {/* Recent Buffer Payouts */}
          <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
            <View className="flex-row items-end justify-between mb-4">
              <View>
                <Text className="text-base font-extrabold text-slate-900">
                  Recent Buffer Payouts
                </Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  History of earnings protected automatically.
                </Text>
              </View>
              <TouchableOpacity className="border border-slate-200 px-3 py-1.5 rounded-xl">
                <Text className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Download Log
                </Text>
              </TouchableOpacity>
            </View>

            <PayoutRow
              icon="cloud-rain"
              iconBg="bg-blue-50"
              iconColor="#3b82f6"
              event="Monsoon Downpour"
              sub="Velocity -40%"
              amount="+₹300.00"
              date="Today"
              time="14:22 PM"
              status="Credited"
            />
            <PayoutRow
              icon="tool"
              iconBg="bg-orange-50"
              iconColor="#f97316"
              event="Route Obstruction"
              sub="Detour +45m"
              amount="+₹150.00"
              date="Yesterday"
              time="09:15 AM"
              status="Processing"
            />
            <PayoutRow
              icon="sun"
              iconBg="bg-red-50"
              iconColor="#ef4444"
              event="Extreme Heatwave"
              sub="Safety AI Protocol"
              amount="+₹450.00"
              date="Oct 12"
              time="16:45 PM"
              status="Credited"
            />
          </View>

          {/* Intelligence Brief */}
          <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
            <View className="mb-5">
              <Text className="text-base font-extrabold text-slate-900">Intelligence Brief</Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Next 24 Hours
              </Text>
            </View>

            <IntelRow
              icon="cloud-rain"
              iconBg="bg-indigo-50"
              iconColor="#6366f1"
              title="Storm Cell Approaching"
              desc="High probability of extreme weather between 4PM – 8PM. Base earning rates buffered automatically."
            />
            <IntelRow
              icon="tool"
              iconBg="bg-orange-50"
              iconColor="#f97316"
              title="Main Arterial Blocked"
              desc="Major congestion projected on I-95 south. Algorithmic detours active; delays buffered."
            />
            <IntelRow
              icon="shield"
              iconBg="bg-emerald-50"
              iconColor="#10b981"
              title="Vault Secure"
              desc="All weekly targets met and guaranteed. Liquidity withdrawal requested successfully."
              showLine={false}
            />

            <TouchableOpacity className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 items-center mt-4">
              <Text className="text-slate-600 text-sm font-extrabold">Configure Radars</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center gap-2 mt-4">
          <Text className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest text-center">
            © 2024 Survival Lens Risk Intelligence
          </Text>
          <View className="flex-row gap-4">
            {["Privacy", "Terms", "Contact"].map((t) => (
              <TouchableOpacity key={t}>
                <Text className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
