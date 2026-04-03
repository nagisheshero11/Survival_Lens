import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

type WalletTransaction = {
  type: "credit" | "debit";
  amount: number;
  reason: "claim" | "withdraw" | "premium";
  status: "pending" | "completed" | "failed";
  paymentRef: string;
  createdAt: string;
};

type WalletResponse = {
  balance: number;
  transactions: WalletTransaction[];
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";

function formatAmount(value: number) {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function TransactionRow({ tx }: { tx: WalletTransaction }) {
  const isCredit = tx.type === "credit";
  const isPending = tx.status === "pending";
  const statusStyle =
    tx.status === "completed"
      ? "bg-emerald-50 text-emerald-600"
      : tx.status === "failed"
        ? "bg-red-50 text-red-600"
        : "bg-slate-100 text-slate-600";

  return (
    <View className="flex-row items-center gap-3 py-3.5 border-b border-slate-100">
      <View className={`w-10 h-10 rounded-2xl items-center justify-center ${isCredit ? "bg-emerald-50" : "bg-amber-50"}`}>
        <Feather
          name={isCredit ? "arrow-down-left" : "arrow-up-right"}
          size={16}
          color={isCredit ? "#10b981" : "#f59e0b"}
        />
      </View>

      <View className="flex-1 min-w-0">
        <Text className="text-sm font-extrabold text-slate-900">{titleCase(tx.reason)}</Text>
        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5" numberOfLines={1}>
          Ref: {tx.paymentRef || "N/A"}
        </Text>
      </View>

      <View className="items-end gap-1 shrink-0">
        <Text className={`text-sm font-extrabold ${isCredit ? "text-emerald-600" : "text-slate-900"}`}>
          {isCredit ? "+" : "-"}
          {formatAmount(tx.amount)}
        </Text>
        <Text className="text-[10px] font-bold text-slate-500">
          {new Date(tx.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Text>
        <View className={`px-2 py-0.5 rounded-lg ${statusStyle.split(" ")[0]}`}>
          <Text className={`text-[9px] font-extrabold uppercase tracking-widest ${statusStyle.split(" ")[1]}`}>
            {isPending ? "Processing" : titleCase(tx.status)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function WalletScreen() {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wallet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to fetch wallet details");
      }

      setWallet({
        balance: Number(data.balance) || 0,
        transactions: Array.isArray(data.transactions) ? data.transactions : [],
      });
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to fetch wallet details";
      setError(message);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await fetchWallet();
      setLoading(false);
    };

    initialize();
  }, [fetchWallet]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchWallet();
    setRefreshing(false);
  }, [fetchWallet]);

  const transactions = useMemo(() => wallet?.transactions ?? [], [wallet]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />}
      >
        <View className="px-5">
          <View className="mt-8 mb-6">
            <View className="bg-blue-50 border border-blue-100 self-start px-3 py-1.5 rounded-lg mb-2">
              <Text className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest">Wallet</Text>
            </View>
            <Text className="text-3xl font-extrabold text-slate-900 leading-tight">Funds & Transactions</Text>
            <Text className="text-sm text-slate-500 font-medium mt-2">
              Monitor your balance and recent wallet activity in real time.
            </Text>
          </View>

          {loading ? (
            <View className="bg-white rounded-3xl border border-slate-100 p-8 items-center justify-center">
              <ActivityIndicator size="small" color="#2563eb" />
              <Text className="text-xs font-bold text-slate-500 mt-3">Loading wallet details...</Text>
            </View>
          ) : (
            <>
              <View className="bg-slate-900 rounded-3xl p-5 mb-4 overflow-hidden">
                <View className="flex-row items-center justify-between mb-5">
                  <View className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                    <Text className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest">Available Balance</Text>
                  </View>
                  <Feather name="credit-card" size={20} color="#34d399" />
                </View>

                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Amount</Text>
                <Text className="text-4xl font-extrabold text-white mb-1.5">{formatAmount(wallet?.balance ?? 0)}</Text>
                <Text className="text-xs text-slate-500 font-medium">
                  Synced from /api/wallet
                </Text>
              </View>

              {error ? (
                <View className="bg-red-50 border border-red-100 rounded-3xl p-5 mb-4">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Feather name="alert-circle" size={14} color="#dc2626" />
                    <Text className="text-sm font-extrabold text-red-700">Unable to load wallet data</Text>
                  </View>
                  <Text className="text-xs text-red-700/80 font-medium leading-relaxed mb-3">{error}</Text>
                  <TouchableOpacity
                    onPress={onRefresh}
                    className="self-start px-3 py-2 rounded-xl bg-white border border-red-200"
                  >
                    <Text className="text-[10px] font-extrabold text-red-700 uppercase tracking-widest">Try Again</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <View className="bg-white rounded-3xl p-5 mb-4 border border-slate-100">
                <View className="mb-3">
                  <Text className="text-base font-extrabold text-slate-900">Transactions</Text>
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Latest first
                  </Text>
                </View>

                {transactions.length === 0 ? (
                  <View className="py-8 items-center">
                    <Feather name="inbox" size={18} color="#94a3b8" />
                    <Text className="text-xs font-bold text-slate-500 mt-2">No wallet transactions yet.</Text>
                  </View>
                ) : (
                  transactions.map((tx, index) => (
                    <TransactionRow
                      key={`${tx.paymentRef}-${tx.createdAt}-${index}`}
                      tx={tx}
                    />
                  ))
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}