import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

function ClaimRow({
  title,
  id,
  date,
  amount,
  status,
}: {
  title: string;
  id: string;
  date: string;
  amount: string;
  status: "APPROVED" | "PROCESSING" | "FLAGGED";
}) {
  const map = {
    APPROVED:   { bg: "bg-emerald-100", text: "text-emerald-700" },
    PROCESSING: { bg: "bg-blue-100",    text: "text-blue-700" },
    FLAGGED:    { bg: "bg-red-100",     text: "text-red-600" },
  };
  const s = map[status];
  return (
    <View className="py-4 border-b border-slate-100">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-sm font-extrabold text-slate-900">{title}</Text>
          <Text className="text-xs text-slate-400 font-semibold mt-0.5">
            {id} · {date}
          </Text>
        </View>
        <View className="items-end gap-1">
          <Text className="text-sm font-extrabold text-slate-900">{amount}</Text>
          <View className={`px-2 py-0.5 rounded-full ${s.bg}`}>
            <Text className={`text-[10px] font-extrabold tracking-widest ${s.text}`}>
              {status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function InsightRow({
  icon,
  iconBg,
  iconColor,
  title,
  desc,
  time,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  time: string;
}) {
  return (
    <View className="flex-row gap-3 py-3 border-b border-slate-50">
      <View
        className={`w-9 h-9 rounded-full ${iconBg} items-center justify-center shrink-0 mt-0.5`}
      >
        <Feather name={icon} size={16} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-extrabold text-slate-900 mb-0.5">{title}</Text>
        <Text className="text-xs text-slate-500 font-medium leading-relaxed mb-1">
          {desc}
        </Text>
        <Text className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
          {time}
        </Text>
      </View>
    </View>
  );
}

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
            <TouchableOpacity className="relative w-9 h-9 rounded-full bg-slate-100 items-center justify-center">
              <Feather name="bell" size={16} color="#475569" />
              <View className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
            </TouchableOpacity>
            <View className="w-9 h-9 rounded-full bg-slate-300" />
          </View>
        </View>

        <View className="px-5">
          {/* Header */}
          <View className="mt-4 mb-5">
            <Text className="text-2xl font-extrabold text-slate-900 mb-0.5">
              Intelligence Dashboard
            </Text>
            <Text className="text-sm text-slate-500 font-semibold">
              Status:{" "}
              <Text className="text-emerald-600 font-extrabold">Stable</Text>
            </Text>
          </View>

          {/* Profile card */}
          <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100 items-center">
            <View className="relative mb-3">
              <View className="w-20 h-20 rounded-full bg-slate-300" />
              <View className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white items-center justify-center border border-white">
                <Feather name="check-circle" size={14} color="#10b981" />
              </View>
            </View>
            <Text className="text-base font-extrabold text-slate-900 mb-0.5">
              Marcus Sterling
            </Text>
            <Text className="text-xs text-slate-500 font-semibold mb-4">
              Independent Logistics Consultant
            </Text>
            <View className="flex-row w-full border-t border-slate-100 pt-4">
              <View className="flex-1">
                <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                  Age
                </Text>
                <Text className="text-sm font-extrabold text-slate-900">34 Years</Text>
              </View>
              <View className="flex-1 items-end">
                <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                  Company
                </Text>
                <Text className="text-sm font-extrabold text-slate-900">
                  Sterling Gig Ltd.
                </Text>
              </View>
            </View>
          </View>

          {/* Liquidity card */}
          <View className="bg-[#1155ff] rounded-3xl p-5 mb-4 overflow-hidden">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[10px] font-extrabold text-blue-100 uppercase tracking-widest">
                Available Liquidity
              </Text>
              <Feather name="credit-card" size={18} color="#bfdbfe" />
            </View>
            <Text className="text-4xl font-extrabold text-white mb-6">
              $12,450.80
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-white/10 border border-white/20 rounded-2xl py-3 items-center">
                <Text className="text-white text-sm font-extrabold">Withdraw</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-white rounded-2xl py-3 items-center">
                <Text className="text-blue-600 text-sm font-extrabold">Add Funds</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Active plan */}
          <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
            <View className="flex-row items-center justify-between mb-3">
              <View className="bg-blue-50 px-3 py-1.5 rounded-lg">
                <Text className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">
                  Active Plan
                </Text>
              </View>
              <Feather name="shield" size={18} color="#2563eb" />
            </View>
            <Text className="text-lg font-extrabold text-slate-900 mb-1.5">
              Enterprise Shield
            </Text>
            <Text className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
              Comprehensive risk coverage with priority AI diagnostics and legal
              mediation.
            </Text>
            <TouchableOpacity className="flex-row items-center justify-between border-t border-slate-100 pt-4">
              <Text className="text-sm font-extrabold text-blue-600">
                View Upgrade Options
              </Text>
              <Feather name="arrow-right" size={16} color="#2563eb" />
            </TouchableOpacity>
          </View>

          {/* Recent Claims */}
          <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-base font-extrabold text-slate-900">
                Recent Claims
              </Text>
              <TouchableOpacity>
                <Text className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Download
                </Text>
              </TouchableOpacity>
            </View>
            <ClaimRow
              title="Contract Violation"
              id="#CLM-99021"
              date="Oct 24, 2023 · 14:22"
              amount="$2,400.00"
              status="APPROVED"
            />
            <ClaimRow
              title="Equipment Damage"
              id="#CLM-88742"
              date="Oct 18, 2023 · 09:15"
              amount="$850.25"
              status="PROCESSING"
            />
            <ClaimRow
              title="Identity Protection"
              id="#CLM-77103"
              date="Oct 12, 2023 · 16:45"
              amount="$120.00"
              status="FLAGGED"
            />
          </View>

          {/* Risk Insights */}
          <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
            <Text className="text-base font-extrabold text-slate-900 mb-2">
              Risk Insights
            </Text>
            <InsightRow
              icon="bar-chart-2"
              iconBg="bg-indigo-50"
              iconColor="#4f46e5"
              title="Market Shift Detected"
              desc="Gig-index rates in your sector dropped by 4.2% this morning. Adjust liquidity accordingly."
              time="2 hours ago"
            />
            <InsightRow
              icon="shield"
              iconBg="bg-emerald-50"
              iconColor="#059669"
              title="Policy Renewed"
              desc="Enterprise Shield successfully rolled over for the next billing cycle."
              time="Yesterday"
            />
            <InsightRow
              icon="alert-triangle"
              iconBg="bg-red-50"
              iconColor="#dc2626"
              title="High Exposure Alert"
              desc="Pending mediation for CLM-77103 requires your digital signature."
              time="3 days ago"
            />
            <TouchableOpacity className="w-full bg-slate-100 rounded-2xl py-3 items-center mt-3">
              <Text className="text-slate-600 text-sm font-extrabold">
                View All Activity
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center gap-2 mt-4">
          <Text className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest text-center">
            © 2024 Survival Lens Risk Intelligence. All Rights Reserved.
          </Text>
          <View className="flex-row gap-4">
            {["Privacy", "Terms", "Contact"].map((t) => (
              <TouchableOpacity key={t}>
                <Text className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
