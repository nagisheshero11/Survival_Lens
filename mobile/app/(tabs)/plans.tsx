import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

type Location = "Metropolitan" | "Urban" | "Semi-Urban" | "Rural";

export default function PlansScreen() {
  const [step, setStep] = useState<"calculator" | "plans">("calculator");
  const [income, setIncome] = useState<number>(8000);
  const [location, setLocation] = useState<Location>("Urban");

  // Calculate dynamic weekly pricing (Mirroring Web Logic)
  const calculatePricing = () => {
    let multiplier = 1.0;
    if (location === "Metropolitan") multiplier = 1.4;
    if (location === "Urban") multiplier = 1.1;
    if (location === "Semi-Urban") multiplier = 0.85;
    if (location === "Rural") multiplier = 0.6;

    const litePremium = Math.round(income * 0.015 * multiplier);
    const liteCoverage = Math.round(income * 0.5);

    const proPremium = Math.round(income * 0.035 * multiplier);
    const proCoverage = Math.round(income * 1.0);

    const maxPremium = Math.round(income * 0.06 * multiplier);
    const maxCoverage = Math.round(income * 1.5);

    return {
      lite: { premium: litePremium, coverage: liteCoverage },
      pro: { premium: proPremium, coverage: proCoverage },
      max: { premium: maxPremium, coverage: maxCoverage },
    };
  };

  const pricing = calculatePricing();

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
            <View className="flex-row items-center gap-2 mb-2">
              <View className="bg-blue-50 border border-blue-100 flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg">
                <Feather name="cpu" size={10} color="#2563eb" />
                <Text className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest">
                  Dynamic Quoting Engine
                </Text>
              </View>
            </View>
            <Text className="text-3xl font-extrabold text-slate-900 leading-tight">
              {step === "calculator"
                ? "Calibrate Your Coverage"
                : "Your Weekly Buffers"}
            </Text>
            <Text className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
              {step === "calculator"
                ? "Configure your base operating metrics to calculate the exact algorithmic premium required."
                : `Based on a ${location} zone with ₹${income.toLocaleString()} income, we recommend these buffers.`}
            </Text>
          </View>

          {step === "calculator" ? (
            <View className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm shadow-slate-200/50">
              {/* Income Input */}
              <View className="mb-8">
                <View className="flex-row items-center gap-3 mb-4">
                  <View className="w-10 h-10 rounded-2xl bg-emerald-50 items-center justify-center">
                    <Feather name="dollar-sign" size={20} color="#10b981" />
                  </View>
                  <View>
                    <Text className="text-sm font-extrabold text-slate-900">
                      Weekly Income
                    </Text>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Baseline Target
                    </Text>
                  </View>
                </View>
                <View className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 flex-row items-center">
                  <Text className="text-2xl font-extrabold text-slate-900 mr-1">₹</Text>
                  <TextInput
                    value={income.toString()}
                    onChangeText={(val) => setIncome(Number(val.replace(/[^0-9]/g, "")))}
                    keyboardType="numeric"
                    className="flex-1 text-2xl font-extrabold text-slate-900 outline-none"
                  />
                </View>
                <View className="flex-row gap-2 mt-3">
                  {[5000, 10000, 15000].map((v) => (
                    <TouchableOpacity
                      key={v}
                      onPress={() => setIncome(v)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200"
                    >
                      <Text className="text-[10px] font-extrabold text-slate-500">
                        ₹{v / 1000}k
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Location Selector */}
              <View className="mb-10">
                <View className="flex-row items-center gap-3 mb-4">
                  <View className="w-10 h-10 rounded-2xl bg-indigo-50 items-center justify-center">
                    <Feather name="map-pin" size={18} color="#6366f1" />
                  </View>
                  <View>
                    <Text className="text-sm font-extrabold text-slate-900">
                      Geopolitical Zone
                    </Text>
                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Risk Environment
                    </Text>
                  </View>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {["Metropolitan", "Urban", "Semi-Urban", "Rural"].map((loc) => (
                    <TouchableOpacity
                      key={loc}
                      onPress={() => setLocation(loc as Location)}
                      className={`px-4 py-3 rounded-2xl border-2 ${
                        location === loc
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-100 bg-white"
                      }`}
                    >
                      <Text
                        className={`text-xs font-extrabold ${
                          location === loc ? "text-blue-700" : "text-slate-500"
                        }`}
                      >
                        {loc}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setStep("plans")}
                className="w-full bg-slate-900 py-4 rounded-2xl flex-row items-center justify-center gap-2"
              >
                <Text className="text-white font-extrabold text-base">Generate Plans</Text>
                <Feather name="arrow-right" size={18} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {/* LITE TIER */}
              <View className="bg-white rounded-[40px] p-6 mb-6 border border-slate-100 shadow-sm shadow-slate-200/50">
                <View className="bg-slate-50 self-start px-3 py-1.5 rounded-lg border border-slate-100 mb-4">
                  <Text className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">
                    Lite Buffer
                  </Text>
                </View>
                <View className="flex-row items-baseline gap-1 mb-2">
                  <Text className="text-4xl font-extrabold text-slate-900">₹{pricing.lite.premium}</Text>
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    / week
                  </Text>
                </View>
                <Text className="text-xs text-slate-500 font-medium mb-6">
                  Fundamental buffering covering 50% of your ₹{income.toLocaleString()} target.
                </Text>
                <View className="space-y-3 mb-8">
                  <View className="flex-row items-center gap-3">
                    <Feather name="check-circle" size={16} color="#10b981" />
                    <Text className="text-sm font-extrabold text-slate-700">
                      ₹{pricing.lite.coverage.toLocaleString()} Guaranteed Floor
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <Feather name="check-circle" size={16} color="#10b981" />
                    <Text className="text-sm font-extrabold text-slate-700">Rain & Snow Auto-Buffer</Text>
                  </View>
                  <View className="flex-row items-center gap-3 opacity-30">
                    <Feather name="x-circle" size={16} color="#94a3b8" />
                    <Text className="text-sm font-bold text-slate-400">Gridlock & Traffic Overrides</Text>
                  </View>
                </View>
                <TouchableOpacity className="w-full bg-slate-50 py-4 rounded-2xl border border-slate-200 items-center">
                  <Text className="text-slate-600 font-extrabold text-sm">Pay ₹{pricing.lite.premium} / wk</Text>
                </TouchableOpacity>
              </View>

              {/* PRO TIER */}
              <View className="bg-slate-900 rounded-[40px] p-8 mb-6 relative overflow-hidden">
                <View className="absolute top-0 right-0 opacity-10">
                  <Feather name="zap" size={120} color="white" />
                </View>
                <View className="absolute top-4 right-6 bg-blue-500 px-3 py-1 rounded-full">
                  <Text className="text-[8px] font-extrabold text-white uppercase tracking-widest">
                    Recommended
                  </Text>
                </View>
                <View className="bg-blue-500/20 self-start px-3 py-1.5 rounded-lg border border-blue-500/30 mb-4">
                  <Text className="text-[9px] font-extrabold text-blue-400 uppercase tracking-widest">
                    Geospatial Pro
                  </Text>
                </View>
                <View className="flex-row items-baseline gap-1 mb-2">
                  <Text className="text-5xl font-extrabold text-white">₹{pricing.pro.premium}</Text>
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    / week
                  </Text>
                </View>
                <Text className="text-xs text-slate-400 font-medium mb-6">
                  Secures 100% of your ₹{income.toLocaleString()} target against environment faults.
                </Text>
                <View className="space-y-4 mb-8">
                  {[
                    `₹${pricing.pro.coverage.toLocaleString()} Guaranteed Floor`,
                    "Gridlock & ETA Failure overrides",
                    "Full Environmental Array",
                    "100% DAO Voting Power",
                  ].map((f) => (
                    <View key={f} className="flex-row items-center gap-3">
                      <Feather name="check-circle" size={18} color="#3b82f6" />
                      <Text className="text-sm font-extrabold text-white">{f}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity className="w-full bg-blue-600 py-4 rounded-2xl items-center flex-row justify-center gap-2 shadow-lg shadow-blue-600/30">
                  <Text className="text-white font-extrabold text-sm">Pay ₹{pricing.pro.premium} / wk</Text>
                  <Feather name="arrow-right" size={16} color="white" />
                </TouchableOpacity>
              </View>

              {/* MAX TIER */}
              <View className="bg-white rounded-[40px] p-6 mb-10 border border-slate-100 shadow-sm shadow-slate-200/50">
                <View className="bg-amber-50 self-start px-3 py-1.5 rounded-lg border border-amber-100 mb-4">
                  <Text className="text-[9px] font-extrabold text-amber-600 uppercase tracking-widest">
                    Max Authority
                  </Text>
                </View>
                <View className="flex-row items-baseline gap-1 mb-2">
                  <Text className="text-4xl font-extrabold text-slate-900">₹{pricing.max.premium}</Text>
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    / week
                  </Text>
                </View>
                <Text className="text-xs text-slate-500 font-medium mb-6">
                  Unrestricted legal and algorithmic shielding targeting 150% security.
                </Text>
                <View className="space-y-3 mb-8">
                  {[
                    `₹${pricing.max.coverage.toLocaleString()} Max Coverage Cap`,
                    "Arbitrary Deactivation Legal Fund",
                    "Priority human mediation",
                    "Direct DAO Treasury access",
                  ].map((f) => (
                    <View key={f} className="flex-row items-center gap-3">
                      <Feather name="star" size={16} color="#f59e0b" />
                      <Text className="text-sm font-extrabold text-slate-800">{f}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity className="w-full bg-slate-900 py-4 rounded-2xl items-center">
                  <Text className="text-white font-extrabold text-sm">Pay ₹{pricing.max.premium} / wk</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setStep("calculator")}
                className="self-center mb-10"
              >
                <Text className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                  ← Recalibrate Metrics
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Algorithmic Guarantee Footer */}
          <View className="bg-white/60 border border-white rounded-[40px] p-8 mt-4">
            <View className="flex-row items-center gap-2 mb-3">
              <Feather name="activity" size={18} color="#10b981" />
              <Text className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">
                Decentralized Vault
              </Text>
            </View>
            <Text className="text-2xl font-extrabold text-slate-900 mb-3 leading-tight">
              The Geospatial Reliability Guarantee
            </Text>
            <Text className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
              Every subscription tier is backed by our proprietary smart-contracts, distributing
              risk automatically the moment your route goes red.
            </Text>

            <View className="flex-row gap-8 mb-8">
              <View>
                <Text className="text-3xl font-extrabold text-slate-900">99.9%</Text>
                <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Sensor Uptime
                </Text>
              </View>
              <View>
                <Text className="text-3xl font-extrabold text-slate-900">₹40M+</Text>
                <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Locked Buffer
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-3">
              {[
                { icon: "shield" as const, label: "AES-256", bg: "bg-blue-50" },
                { icon: "cloud" as const, label: "Radars", bg: "bg-indigo-50" },
                { icon: "users" as const, label: "Peer Valid", bg: "bg-emerald-50" },
                { icon: "zap" as const, label: "Instant", bg: "bg-amber-50" },
              ].map((f) => (
                <View
                  key={f.label}
                  className={`flex-1 min-w-[40%] ${f.bg} rounded-2xl p-4 items-center border border-white/50`}
                >
                  <Feather name={f.icon} size={20} color="#64748b" className="mb-2" />
                  <Text className="text-[8px] font-extrabold text-slate-900 uppercase tracking-widest">
                    {f.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
