import { View, Text, Pressable, LayoutChangeEvent } from "react-native";
import React, { useState } from "react";
import Animated, { useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";

interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabSwitcher = ({ tabs, activeTab, onTabChange }: TabSwitcherProps) => {
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const activeIndex = tabs.indexOf(activeTab);

  // We subtract 10 for the total horizontal padding (p-[5px] -> 5px left + 5px right = 10px)
  const tabWidth = wrapperWidth > 0 ? (wrapperWidth - 10) / tabs.length : 0;

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateX: withTiming(activeIndex * tabWidth, {
            duration: 200,
            easing: Easing.out(Easing.cubic)
          }) 
        }
      ],
      width: tabWidth,
    };
  });

  return (
    <View 
      className="flex-row relative bg-slate-100 p-[5px] rounded-2xl mb-8"
      onLayout={(e: LayoutChangeEvent) => setWrapperWidth(e.nativeEvent.layout.width)}
    >
      {wrapperWidth > 0 && (
        <Animated.View 
          className="absolute top-[5px] bottom-[5px] left-[5px] bg-white rounded-xl shadow-sm shadow-slate-200"
          style={indicatorStyle}
        />
      )}
      
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <Pressable
            key={tab}
            onPress={() => onTabChange(tab)}
            className="flex-1 py-3.5 items-center justify-center z-10"
          >
            <Text
              className={`font-extrabold text-sm ${
                isActive ? "text-blue-600" : "text-slate-500 font-bold"
              }`}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
