import { Text, Pressable, PressableProps } from "react-native";
import React from "react";

interface PrimaryButtonProps extends PressableProps {
  title: string;
}

export const PrimaryButton = ({ title, ...props }: PrimaryButtonProps) => {
  return (
    <Pressable
      className="bg-[#0D6EFD] rounded-2xl py-[18px] items-center justify-center shadow-lg shadow-blue-500/20 active:opacity-80"
      {...props}
    >
      <Text className="text-white font-extrabold text-base">{title}</Text>
    </Pressable>
  );
};
