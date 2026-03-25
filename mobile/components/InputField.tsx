import { View, Text, TextInput, Pressable, TextInputProps } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";

interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
  rightLabel?: string;
  onRightLabelPress?: () => void;
}

export const InputField = ({
  label,
  icon,
  isPassword,
  rightLabel,
  onRightLabelPress,
  ...props
}: InputFieldProps) => {
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(isPassword);

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-slate-500 font-extrabold text-[11px] tracking-wider uppercase">
          {label}
        </Text>
        {rightLabel && (
          <Pressable onPress={onRightLabelPress}>
            <Text className="text-blue-600 font-extrabold text-xs">
              {rightLabel}
            </Text>
          </Pressable>
        )}
      </View>
      <View className="flex-row items-center bg-slate-100/80 rounded-2xl px-4 min-h-[56px]">
        {icon && (
          <View className="mr-3" pointerEvents="none">
            <Feather name={icon} size={20} color="#94a3b8" />
          </View>
        )}
        <TextInput
          className="flex-1 text-slate-700 text-[15px] font-bold h-full py-4"
          placeholderTextColor="#94a3b8"
          secureTextEntry={isSecureTextEntry}
          {...props}
        />
        {isPassword && (
          <Pressable onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}>
            <Feather
              name={isSecureTextEntry ? "eye" : "eye-off"}
              size={20}
              color="#94a3b8"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};
