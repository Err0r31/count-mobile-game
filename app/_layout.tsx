import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar
        bar-style="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Stack
        screenOptions={{
          headerTintColor: "#333",
          headerTitleStyle: { fontWeight: "bold" },
          headerBackVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "Быстрый счет", headerLeft: () => null }}
        />
        <Stack.Screen
          name="rules"
          options={{ title: "Правила", headerLeft: () => null }}
        />
        <Stack.Screen
          name="game"
          options={{ title: "Игра", headerLeft: () => null }}
        />
      </Stack>
    </>
  );
}
