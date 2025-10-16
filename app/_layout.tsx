import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#6366f1" },                // фон хедера
          headerTitleStyle: { fontWeight: "bold", color: "#ffffff" }, // цвет заголовка
          headerBackVisible: false,                                     // отключаем ссылку "назад" в хедере
          // headerTintColor: "#000000ff"                             // цвет ссылки "назад"
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "Быстрый счет", headerLeft: () => null }}
        />
        <Stack.Screen
          name="game"
          options={{ title: "Игра", headerLeft: () => null }}
        />
        <Stack.Screen
          name="highscores"
          options={{ title: "Рекорды", headerLeft: () => null }}
        />
        <Stack.Screen
          name="rules"
          options={{ title: "Правила", headerLeft: () => null }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: "Настройки", headerLeft: () => null }}
        />
      </Stack>
    </>
  );
}
