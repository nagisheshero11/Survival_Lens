import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { View } from "react-native";

function TabIcon({
  name,
  focused,
}: {
  name: React.ComponentProps<typeof Feather>["name"];
  focused: boolean;
}) {
  return (
    <View
      className={`items-center justify-center w-10 h-10 rounded-2xl ${
        focused ? "bg-blue-50" : ""
      }`}
    >
      <Feather name={name} size={20} color={focused ? "#2563eb" : "#94a3b8"} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: 2,
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="voting"
        options={{
          title: "Voting",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="check-square" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: "Coverage Plans",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="shield" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="user" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "Raise Ticket",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="help-circle" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
