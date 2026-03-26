import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [percentage] = useState(70); // Mocking 70% completion

  const isComplete = percentage === 100;

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5">
          {/* KYC Alert Banner */}
          {!isComplete && (
            <View className="bg-amber-50 border border-amber-200 rounded-[32px] p-6 mt-6 mb-8 flex-row items-center gap-4">
              <View className="w-12 h-12 bg-amber-100 rounded-2xl items-center justify-center border border-amber-200/50">
                <Feather name="shield" size={20} color="#d97706" />
              </View>
              <View className="flex-1">
                <View className="bg-amber-100/50 self-start px-2 py-0.5 rounded-md mb-1.5">
                  <Text className="text-[8px] font-extrabold text-amber-600 uppercase tracking-widest">
                    Action Required
                  </Text>
                </View>
                <Text className="text-base font-extrabold text-slate-900 leading-tight">
                  KYC Pending ({percentage}%)
                </Text>
                <Text className="text-[11px] text-amber-800 font-medium mt-1 leading-relaxed">
                  Compliance requires identity verification to activate buffers.
                </Text>
              </View>
              <TouchableOpacity className="w-10 h-10 bg-slate-900 rounded-full items-center justify-center">
                <Feather name="arrow-right" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Profile Identity Card */}
          <View className="bg-white rounded-[40px] p-8 border border-slate-100 items-center shadow-sm shadow-slate-200/50 mb-6">
            <View className="relative mb-6">
              <View className="w-32 h-32 bg-slate-900 rounded-full border-4 border-white shadow-xl items-center justify-center overflow-hidden">
                <Feather name="user" size={60} color="#cbd5e1" className="mt-4" />
                <View className="absolute bottom-0 w-full h-8 bg-slate-800 items-center justify-center">
                  <Text className="text-[8px] font-extrabold text-slate-400">PRO LEVEL</Text>
                </View>
              </View>
              <TouchableOpacity className="absolute bottom-0 right-0 bg-white p-2.5 rounded-full border border-slate-100 shadow-lg">
                <Feather name="edit-3" size={14} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text className="text-2xl font-extrabold text-slate-900 mb-1">Marcus Sterling</Text>
            <Text className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-8">
              {isComplete ? "Verified Operative" : "Unverified Driver"}
            </Text>

            <View className="flex-row w-full pt-8 border-t border-slate-50 justify-between items-center px-4">
              <View className="items-center">
                <View className="flex-row items-center gap-1 mb-1.5">
                  <Feather name="alert-circle" size={10} color="#f59e0b" />
                  <Text className="text-[9px] font-extrabold text-amber-600 uppercase tracking-widest">Status</Text>
                </View>
                <Text className="text-sm font-extrabold text-slate-900">Restricted</Text>
              </View>
              <View className="items-center">
                <View className="flex-row items-center gap-1 mb-1.5">
                  <Feather name="lock" size={10} color="#cbd5e1" />
                  <Text className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest">Authority</Text>
                </View>
                <Text className="text-sm font-extrabold text-slate-900">Level 0 Access</Text>
              </View>
            </View>
          </View>

          {/* KYC Widget */}
          {!isComplete && (
            <View className="bg-white rounded-[40px] p-8 border border-slate-100 mb-6">
              <View className="flex-row items-center gap-3 mb-6">
                <View className="w-10 h-10 bg-slate-900 rounded-2xl items-center justify-center shadow-lg shadow-slate-900/10">
                  <Feather name="fingerprint" size={20} color="white" />
                </View>
                <View>
                  <Text className="text-lg font-extrabold text-slate-900">Authentication</Text>
                  <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                    KYC Protocol Sequence
                  </Text>
                </View>
              </View>

              <View className="bg-slate-50 border border-slate-100 rounded-3xl p-6 items-center">
                <View className="flex-row justify-between w-full mb-3">
                  <Text className="text-sm font-extrabold text-slate-900">Progress</Text>
                  <Text className="text-sm font-extrabold text-blue-600">{percentage}%</Text>
                </View>
                <View className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner mb-6">
                  <View className="h-full bg-blue-600 rounded-full" style={{ width: `${percentage}%` }} />
                </View>
                <TouchableOpacity className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 items-center">
                  <Text className="text-xs font-extrabold text-slate-400">
                    + Supply Missing Documents
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Verified Metrics (Locked) */}
          <View className="bg-white rounded-[40px] p-8 border border-slate-100 opacity-50">
            <View className="flex-row justify-between items-start mb-10">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-slate-100 rounded-2xl items-center justify-center border border-slate-200">
                  <Feather name="credit-card" size={18} color="#64748b" />
                </View>
                <View>
                  <Text className="text-lg font-extrabold text-slate-900">Verified Metrics</Text>
                  <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Locked during KYC
                  </Text>
                </View>
              </View>
              <Feather name="lock" size={16} color="#94a3b8" />
            </View>

            <View className="space-y-6">
              <View>
                <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Company / Platform
                </Text>
                <View className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <Text className="text-sm font-extrabold text-slate-900">Uber / Swiggy (Linked)</Text>
                </View>
              </View>
              <View>
                <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Location Zone
                </Text>
                <View className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <Text className="text-sm font-extrabold text-slate-900">Metropolitan Zone 4</Text>
                </View>
              </View>
              <View>
                <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Target Weekly Income
                </Text>
                <View className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <Text className="text-sm font-extrabold text-slate-900">₹12,450.80</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
