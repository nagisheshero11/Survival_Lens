import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { TabSwitcher } from "../components/TabSwitcher";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState("Standard");

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-white rounded-[32px] p-7 shadow-sm shadow-slate-200/50">
            <Text className="text-3xl font-extrabold text-slate-800 mb-2 mt-4 tracking-tight">
              Welcome back
            </Text>
            <Text className="text-slate-500 text-sm mb-7 font-semibold">
              Please enter your details to access your dashboard.
            </Text>

            <TabSwitcher
              tabs={["Standard", "OTP / SMS"]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <InputField
              label="USERNAME OR EMAIL"
              placeholder="name@example.com"
              icon="at-sign"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <InputField
              label="PASSWORD"
              placeholder="........"
              icon="lock"
              isPassword
              rightLabel="Forgot Password?"
              onRightLabelPress={() => {}}
            />

            <View className="mt-6 mb-10">
              <PrimaryButton title="Login to Dashboard" onPress={() => {}} />
            </View>

            <View className="flex-row items-center mb-10">
              <View className="flex-1 h-[1px] bg-slate-100" />
              <Text className="px-4 text-[10px] font-extrabold tracking-[0.2em] text-slate-400">
                SECURE GATEWAY
              </Text>
              <View className="flex-1 h-[1px] bg-slate-100" />
            </View>

            <View className="flex-row justify-center mb-4">
              <Text className="text-slate-500 font-semibold text-sm">New to Survival Lens? </Text>
              <Text className="text-blue-600 font-extrabold text-sm">Create an account</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
