import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function VotingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
      <Feather name="check-square" size={40} color="#2563eb" />
      <Text className="text-lg font-extrabold text-slate-900 mt-4 mb-1">Voting</Text>
      <Text className="text-sm text-slate-400 font-medium">Coming soon</Text>
    </SafeAreaView>
  );
}
